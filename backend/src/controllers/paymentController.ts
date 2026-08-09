import { Response } from 'express';
import crypto from 'crypto';
import { AuthRequest } from '../middleware/auth.js';
import { Payment } from '../models/Payment.js';
import { RentalOrder } from '../models/RentalOrder.js';
import { Product } from '../models/Product.js';
import { WebhookLog } from '../models/WebhookLog.js';
import { getRazorpayInstance, razorpayKeyId, razorpayKeySecret, razorpayWebhookSecret } from '../config/razorpay.js';
import { getIO } from '../socket.js';

// Helper: generate sequential order ref
const getNextOrderRef = async (): Promise<string> => {
  const count = await RentalOrder.countDocuments();
  return `RO${(count + 1).toString().padStart(4, '0')}`;
};

// POST /api/payments/create-order — Server-side Razorpay order creation
export const createPaymentOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { lines, rentalStart, rentalEnd, deliveryMethod } = req.body;

    if (!lines || !Array.isArray(lines) || lines.length === 0) {
      res.status(400).json({ message: 'Order must contain at least one valid product line.' });
      return;
    }

    const start = rentalStart ? new Date(rentalStart) : new Date();
    const end = rentalEnd ? new Date(rentalEnd) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Validate inventory & calculate authoritative price server-side
    let subtotal = 0;
    const formattedLines = [];
    let primaryVendorId = '';

    for (const line of lines) {
      const pId = line.productId || line.product;
      const product = await Product.findById(pId);
      if (!product) {
        res.status(400).json({ message: `Product not found: ${pId}` });
        return;
      }

      const qty = Number(line.quantity || 1);
      if (product.quantityOnHand < qty) {
        res.status(400).json({ message: `Insufficient inventory for "${product.name}". Available: ${product.quantityOnHand}` });
        return;
      }

      const unitPrice = product.pricePerUnit;
      const lineAmount = unitPrice * qty;
      subtotal += lineAmount;

      if (!primaryVendorId) {
        primaryVendorId = String(product.vendorId);
      }

      formattedLines.push({
        product: product._id,
        productName: product.name,
        productImage: product.image,
        quantity: qty,
        unitPrice,
        amount: lineAmount,
      });
    }

    // Authoritative calculations
    const deliveryCharge = deliveryMethod === 'Standard Delivery' ? 150 : 0;
    const securityDeposit = 500 * (lines.length || 1);
    const taxAmount = Math.round((subtotal * 10) / 100);
    const grandTotalINR = subtotal + taxAmount + deliveryCharge + securityDeposit;
    const amountInPaise = Math.round(grandTotalINR * 100);

    const orderRef = await getNextOrderRef();

    // 1. Create Pending RentalOrder
    const rentalOrder = await RentalOrder.create({
      orderRef,
      customer: req.user!.id,
      customerName: req.user!.name || req.user!.email,
      customerEmail: req.user!.email,
      vendorId: primaryVendorId || req.user!.id,
      status: 'pending',
      rentalStart: start,
      rentalEnd: end,
      lines: formattedLines,
      total: grandTotalINR,
      lateFee: 0,
    });

    // 2. Create Razorpay Order via SDK
    const razorpay = getRazorpayInstance();
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: orderRef,
      notes: {
        rentalOrderId: rentalOrder._id.toString(),
        userId: req.user!.id,
        userEmail: req.user!.email,
      },
    });

    // 3. Create Internal Payment record
    const payment = await Payment.create({
      user: req.user!.id,
      rentalOrder: rentalOrder._id,
      vendorId: primaryVendorId || req.user!.id,
      amount: grandTotalINR,
      currency: 'INR',
      status: 'CREATED',
      razorpayOrderId: razorpayOrder.id,
      paymentMethod: 'Razorpay Standard',
      metadata: {
        receipt: orderRef,
        deliveryMethod,
        subtotal,
        taxAmount,
        securityDeposit,
      },
    });

    res.status(201).json({
      success: true,
      keyId: razorpayKeyId,
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      amountINR: grandTotalINR,
      currency: 'INR',
      paymentId: payment._id,
      orderRef,
      orderId: rentalOrder._id,
    });
  } catch (error: any) {
    console.error('Payment order creation error:', error);
    res.status(500).json({ message: 'Error creating payment order', error: error?.message || 'Server error' });
  }
};

// POST /api/payments/verify — Server-side HMAC-SHA256 signature verification
export const verifyPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({ message: 'Payment verification failed: Missing required verification parameters.' });
      return;
    }

    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!payment) {
      res.status(404).json({ message: 'Payment order record not found in system.' });
      return;
    }

    // Server-side HMAC signature verification
    const expectedSignature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(razorpay_signature)
    );

    if (!isSignatureValid) {
      payment.status = 'FAILED';
      payment.failureReason = 'Invalid cryptographic signature match';
      await payment.save();

      res.status(400).json({ message: 'Payment verification failed: Cryptographic signature mismatch.' });
      return;
    }

    // Signature matches -> Mark payment CAPTURED
    payment.status = 'CAPTURED';
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    await payment.save();

    // Confirm rental & decrement product stock
    const rentalOrder = await RentalOrder.findById(payment.rentalOrder);
    if (rentalOrder) {
      rentalOrder.status = 'active';
      await rentalOrder.save();

      for (const line of rentalOrder.lines) {
        const product = await Product.findById(line.product);
        if (product && product.quantityOnHand >= line.quantity) {
          product.quantityOnHand -= line.quantity;
          await product.save();

          try { getIO().emit('product:updated', product); } catch (_) {}
        }
      }

      try {
        getIO().emit('payment:captured', { payment, order: rentalOrder });
        getIO().emit('order:created', rentalOrder);
      } catch (_) {}
    }

    res.json({
      success: true,
      message: 'Payment verified and rental confirmed successfully.',
      payment,
      order: rentalOrder,
    });
  } catch (error: any) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: 'Error verifying payment signature', error: error?.message || 'Server error' });
  }
};

// POST /api/payments/webhook — Razorpay Webhook Handler with Signature & Idempotency Check
export const handleWebhook = async (req: AuthRequest, res: Response) => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const rawBody = (req as any).rawBody || JSON.stringify(req.body);

    if (!signature) {
      res.status(400).json({ message: 'Missing webhook signature' });
      return;
    }

    const expectedSignature = crypto
      .createHmac('sha256', razorpayWebhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      res.status(400).json({ message: 'Webhook signature validation failed' });
      return;
    }

    const payload = req.body;
    const eventId = payload.event_id || payload.created_at?.toString();

    // Idempotency check
    if (eventId) {
      const existingLog = await WebhookLog.findOne({ eventId });
      if (existingLog) {
        res.json({ status: 'ok', message: 'Webhook event already processed (idempotent)' });
        return;
      }
      await WebhookLog.create({ eventId, eventType: payload.event, payload });
    }

    const event = payload.event;
    if (event === 'payment.captured' || event === 'order.paid') {
      const entity = payload.payload.payment?.entity || payload.payload.order?.entity;
      const orderId = entity.order_id || entity.id;

      const payment = await Payment.findOne({ razorpayOrderId: orderId });
      if (payment && payment.status !== 'CAPTURED') {
        payment.status = 'CAPTURED';
        if (entity.id) payment.razorpayPaymentId = entity.id;
        await payment.save();

        const rentalOrder = await RentalOrder.findById(payment.rentalOrder);
        if (rentalOrder && rentalOrder.status === 'pending') {
          rentalOrder.status = 'active';
          await rentalOrder.save();
        }
      }
    } else if (event === 'payment.failed') {
      const entity = payload.payload.payment?.entity;
      if (entity?.order_id) {
        const payment = await Payment.findOne({ razorpayOrderId: entity.order_id });
        if (payment) {
          payment.status = 'FAILED';
          payment.failureReason = entity.error_description || 'Payment processing failed';
          await payment.save();
        }
      }
    }

    res.json({ status: 'ok', message: 'Webhook event processed successfully' });
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Webhook processing error', error: error?.message || 'Server error' });
  }
};

// GET /api/payments/vendor — Vendor Revenue Metrics & Transactions Ledger
export const getVendorPayments = async (req: AuthRequest, res: Response) => {
  try {
    const filter = req.user?.role === 'admin' ? {} : { vendorId: req.user?.id };
    const payments = await Payment.find(filter)
      .populate('user', 'name email')
      .populate('rentalOrder', 'orderRef status rentalStart rentalEnd lines')
      .sort({ createdAt: -1 });

    const totalRevenue = payments
      .filter((p) => p.status === 'CAPTURED')
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingRevenue = payments
      .filter((p) => p.status === 'CREATED' || p.status === 'PENDING')
      .reduce((sum, p) => sum + p.amount, 0);

    const refundedAmount = payments
      .filter((p) => p.status === 'REFUNDED' || p.status === 'PARTIALLY_REFUNDED')
      .reduce((sum, p) => sum + (p.refundedAmount || p.amount), 0);

    const completedPaidCount = payments.filter((p) => p.status === 'CAPTURED').length;

    res.json({
      stats: {
        totalRevenue,
        pendingRevenue,
        refundedAmount,
        completedPaidCount,
        totalTransactions: payments.length,
      },
      payments,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching vendor payments', error: error?.message });
  }
};

// GET /api/payments/my-payments — Customer Payment History
export const getUserPayments = async (req: AuthRequest, res: Response) => {
  try {
    const payments = await Payment.find({ user: req.user!.id })
      .populate('rentalOrder', 'orderRef status rentalStart rentalEnd lines')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching customer payments', error: error?.message });
  }
};

// POST /api/payments/:id/refund — Admin/Vendor Authorized Refund
export const processRefund = async (req: AuthRequest, res: Response) => {
  try {
    const { amount } = req.body;
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      res.status(404).json({ message: 'Payment record not found.' });
      return;
    }

    if (payment.status !== 'CAPTURED') {
      res.status(400).json({ message: `Cannot refund payment with status "${payment.status}".` });
      return;
    }

    const refundAmountINR = amount ? Number(amount) : payment.amount;
    const refundAmountPaise = Math.round(refundAmountINR * 100);

    // Call Razorpay Refund API if paymentId exists
    if (payment.razorpayPaymentId && !payment.razorpayPaymentId.startsWith('dummy')) {
      const razorpay = getRazorpayInstance();
      await razorpay.payments.refund(payment.razorpayPaymentId, {
        amount: refundAmountPaise,
      });
    }

    payment.status = 'REFUNDED';
    payment.refundStatus = 'full';
    payment.refundedAmount = refundAmountINR;
    await payment.save();

    // Update Rental Order & restore stock
    const rentalOrder = await RentalOrder.findById(payment.rentalOrder);
    if (rentalOrder) {
      rentalOrder.status = 'cancelled';
      await rentalOrder.save();

      for (const line of rentalOrder.lines) {
        const product = await Product.findById(line.product);
        if (product) {
          product.quantityOnHand += line.quantity;
          await product.save();

          try { getIO().emit('product:updated', product); } catch (_) {}
        }
      }
    }

    try { getIO().emit('payment:refunded', payment); } catch (_) {}

    res.json({ message: 'Refund processed successfully', payment });
  } catch (error: any) {
    console.error('Process refund error:', error);
    res.status(500).json({ message: 'Error processing refund', error: error?.message });
  }
};
