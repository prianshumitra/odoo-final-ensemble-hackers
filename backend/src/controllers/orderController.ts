import { Request, Response } from 'express';
import { RentalOrder } from '../models/RentalOrder.js';
import { Invoice } from '../models/Invoice.js';
import { Product } from '../models/Product.js';
import { Settings } from '../models/Settings.js';
import { AuthRequest } from '../middleware/auth.js';
import { getIO } from '../socket.js';
import { generateQuotationPDFBuffer } from '../utils/pdfGenerator.js';

// Helper to generate next sequential order reference (e.g. SO0001)
const getNextOrderRef = async (): Promise<string> => {
  const count = await RentalOrder.countDocuments();
  const nextNum = (count + 1).toString().padStart(4, '0');
  return `SO${nextNum}`;
};

// Helper to ensure system products exist ("Late Fees", "Deposit/Downpayment", "Warranty")
export const ensureSystemProducts = async () => {
  try {
    const systemProducts = [
      { name: 'Late Fees', category: 'System Services', type: 'service', isSystemProduct: true, salesPrice: 150, image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600' },
      { name: 'Deposit/Downpayment', category: 'System Services', type: 'service', isSystemProduct: true, salesPrice: 500, image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600' },
      { name: 'Warranty', category: 'System Services', type: 'service', isSystemProduct: true, salesPrice: 200, image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600' },
    ];

    for (const sysProd of systemProducts) {
      const exists = await Product.findOne({ name: sysProd.name, isSystemProduct: true });
      if (!exists) {
        await Product.create({
          name: sysProd.name,
          brand: 'System',
          category: sysProd.category,
          type: sysProd.type,
          isSystemProduct: true,
          salesPrice: sysProd.salesPrice,
          pricing: { amount: sysProd.salesPrice, unit: 'day' },
          description: `Default system product for ${sysProd.name}`,
          image: sysProd.image,
          inStock: true,
          isPublished: true,
        });
      }
    }
  } catch (err) {
    console.warn('System products check warning:', (err as Error).message);
  }
};

// GET /api/orders
export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const { status, customer, dateRange } = req.query;
    const filter: any = {};

    if (req.user?.role === 'customer') {
      filter.$or = [{ customer: req.user.id }, { customerEmail: req.user.email }];
    } else if (req.user?.role === 'vendor') {
      filter.vendorId = req.user.id;
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (customer) {
      filter.customerName = { $regex: customer, $options: 'i' };
    }

    const orders = await RentalOrder.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: (error as Error).message });
  }
};

// GET /api/orders/:id
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await RentalOrder.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: (error as Error).message });
  }
};

// POST /api/orders (Create Quotation / Order)
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    await ensureSystemProducts();
    const {
      customerName,
      customerEmail,
      invoiceAddress,
      deliveryAddress,
      deliveryMethod,
      pricelist,
      rentalPeriod,
      lines,
      note,
      taxRate,
      securityDepositAmount,
    } = req.body;

    if (!lines || !Array.isArray(lines) || lines.length === 0) {
      res.status(400).json({ message: 'Cannot create an order with no order lines.' });
      return;
    }

    const orderRef = await getNextOrderRef();
    let untaxedAmount = 0;

    const formattedLines = lines.map((line: any) => {
      const lineAmt = Number(line.unitPrice || 0) * Number(line.quantity || 1);
      untaxedAmount += lineAmt;
      return {
        product: line.product || line.productId,
        productName: line.productName || 'Rental Product',
        productImage: line.productImage || '',
        variant: line.variant || '',
        selectedColor: line.selectedColor || '',
        selectedSize: line.selectedSize || '',
        quantity: Number(line.quantity || 1),
        unit: line.unit || 'Month',
        unitPrice: Number(line.unitPrice || 0),
        amount: lineAmt,
        note: line.note || '',
      };
    });

    const currentTaxRate = Number(taxRate !== undefined ? taxRate : 10);
    const taxAmount = (untaxedAmount * currentTaxRate) / 100;
    const depAmount = Number(securityDepositAmount || 500);
    const total = untaxedAmount + taxAmount + depAmount;

    const start = rentalPeriod?.start ? new Date(rentalPeriod.start) : new Date();
    const end = rentalPeriod?.end ? new Date(rentalPeriod.end) : new Date(Date.now() + 7 * 86400000);

    const order = await RentalOrder.create({
      orderRef,
      customer: req.user?.id || 'customer_demo',
      customerName: customerName || req.user?.name || 'Valued Customer',
      customerEmail: customerEmail || req.user?.email || 'customer@example.com',
      vendorId: req.user?.role === 'vendor' ? req.user.id : undefined,
      status: 'quotation',
      invoiceStatus: 'nothing_to_invoice',
      invoiceAddress: invoiceAddress || {},
      deliveryAddress: deliveryAddress || {},
      deliveryMethod: deliveryMethod || 'Standard Delivery',
      pricelist,
      rentalPeriod: { start, end },
      lines: formattedLines,
      note: note || '',
      untaxedAmount,
      taxRate: currentTaxRate,
      taxAmount,
      deliveryCharges: 0,
      securityDeposit: {
        amount: depAmount,
        status: 'held',
        deductedAmount: 0,
        refundedAmount: 0,
      },
      total,
      pickupDate: start,
      returnDate: end,
    });

    try {
      getIO().emit('order:created', order);
    } catch (err) {}

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: (error as Error).message });
  }
};

// PATCH /api/orders/:id/send (Email / Flip status to quotation_sent)
export const sendQuotation = async (req: Request, res: Response) => {
  try {
    const order = await RentalOrder.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    order.status = 'quotation_sent';
    await order.save();

    try {
      getIO().emit('order:updated', order);
    } catch (err) {}

    res.json({ message: 'Quotation sent to customer successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error sending quotation' });
  }
};

// PATCH /api/orders/:id/confirm (Confirm Quotation -> Sale Order)
export const confirmOrder = async (req: Request, res: Response) => {
  try {
    const order = await RentalOrder.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    if (!order.lines || order.lines.length === 0) {
      res.status(400).json({ message: 'Cannot confirm a Quotation with no order lines.' });
      return;
    }

    order.status = 'confirmed';
    await order.save();

    // Auto create linked Invoice as specified in § 6.1
    const invoiceCount = await Invoice.countDocuments();
    const invNumber = `INV/${new Date().getFullYear()}/${(invoiceCount + 1).toString().padStart(4, '0')}`;

    const invoiceLines = order.lines.map((l) => ({
      product: l.product,
      productName: l.productName,
      quantity: l.quantity,
      unitPrice: l.unitPrice,
      amount: l.amount,
    }));

    if (order.securityDeposit?.amount > 0) {
      invoiceLines.push({
        product: 'system_deposit',
        productName: 'Security Deposit (Held)',
        quantity: 1,
        unitPrice: order.securityDeposit.amount,
        amount: order.securityDeposit.amount,
      });
    }

    const invoice = await Invoice.create({
      invoiceNumber: invNumber,
      order: order._id,
      orderRef: order.orderRef,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 14 * 86400000),
      status: 'draft',
      lines: invoiceLines,
      untaxedAmount: order.untaxedAmount,
      taxAmount: order.taxAmount,
      total: order.total,
    });

    order.invoiceStatus = 'invoiced';
    await order.save();

    try {
      getIO().emit('order:updated', order);
      getIO().emit('invoice:created', invoice);
    } catch (err) {}

    res.json({ message: 'Order confirmed and Invoice created', order, invoice });
  } catch (error) {
    res.status(500).json({ message: 'Error confirming order', error: (error as Error).message });
  }
};

// PATCH /api/orders/:id/cancel
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const order = await RentalOrder.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    order.status = 'cancelled';
    if (order.securityDeposit) {
      order.securityDeposit.status = 'refunded';
      order.securityDeposit.refundedAmount = order.securityDeposit.amount;
    }
    await order.save();

    try {
      getIO().emit('order:updated', order);
    } catch (err) {}

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling order' });
  }
};

// POST /api/orders/:id/pickup
export const processPickup = async (req: Request, res: Response) => {
  try {
    const order = await RentalOrder.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    order.status = 'picked_up';
    order.pickupDate = new Date();
    await order.save();

    try {
      getIO().emit('order:updated', order);
    } catch (err) {}

    res.json({ message: 'Item picked up successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error processing pickup' });
  }
};

// POST /api/orders/:id/return (Triggers late fee calculation & deposit settlement)
export const processReturn = async (req: Request, res: Response) => {
  try {
    const order = await RentalOrder.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    const actualReturnDate = new Date();
    order.actualReturnDate = actualReturnDate;

    // Fetch settings for late fee rules
    const settings = await Settings.findOne() || {
      lateFeeEnabled: true,
      defaultLateFeeAmount: 150,
      gracePeriodMinutes: 30,
      maxLateFeeCap: 5000,
    };

    let computedLateFee = 0;
    const scheduledEnd = order.rentalPeriod.end ? new Date(order.rentalPeriod.end) : new Date();
    const graceMs = (settings.gracePeriodMinutes || 30) * 60 * 1000;

    if (actualReturnDate.getTime() > scheduledEnd.getTime() + graceMs) {
      const diffMs = actualReturnDate.getTime() - scheduledEnd.getTime() - graceMs;
      const lateHours = Math.ceil(diffMs / (1000 * 60 * 60));
      const rate = settings.defaultLateFeeAmount || 150;
      computedLateFee = lateHours * rate;
      if (settings.maxLateFeeCap && computedLateFee > settings.maxLateFeeCap) {
        computedLateFee = settings.maxLateFeeCap;
      }
    }

    order.lateFeeCalculated = computedLateFee;

    // Deposit settlement per § 6.2 & § 6.3
    const depositAmt = order.securityDeposit?.amount || 0;
    if (computedLateFee > 0) {
      const deducted = Math.min(depositAmt, computedLateFee);
      const refunded = Math.max(0, depositAmt - computedLateFee);
      order.securityDeposit = {
        amount: depositAmt,
        status: 'partially_deducted',
        deductedAmount: deducted,
        refundedAmount: refunded,
      };

      // Auto inject system product "Late Fees" into Sales Order Lines
      let lateFeeProduct = await Product.findOne({ name: 'Late Fees', isSystemProduct: true });
      if (!lateFeeProduct) {
        lateFeeProduct = await Product.create({
          name: 'Late Fees',
          brand: 'System',
          category: 'System Services',
          type: 'service',
          isSystemProduct: true,
          salesPrice: 150,
          description: 'Late Return Fee',
          image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
        });
      }

      order.lines.push({
        product: lateFeeProduct._id,
        productName: `Late Fees (${computedLateFee > depositAmt ? 'Excess Outstanding' : 'Deducted from Deposit'})`,
        quantity: 1,
        unit: 'fixed',
        unitPrice: computedLateFee,
        amount: computedLateFee,
      });

      order.untaxedAmount += computedLateFee;
      order.total += computedLateFee;
      order.status = 'late_return';
    } else {
      order.securityDeposit = {
        amount: depositAmt,
        status: 'refunded',
        deductedAmount: 0,
        refundedAmount: depositAmt,
      };
      order.status = 'completed';
    }

    await order.save();

    try {
      getIO().emit('order:updated', order);
    } catch (err) {}

    res.json({
      message: 'Return processed successfully. Deposit settled and late fees applied.',
      lateFeeCalculated: computedLateFee,
      securityDeposit: order.securityDeposit,
      order,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing return', error: (error as Error).message });
  }
};

// GET /api/orders/:id/print (PDF output)
export const printQuotationPDF = async (req: Request, res: Response) => {
  try {
    const order = await RentalOrder.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    const pdfBuffer = await generateQuotationPDFBuffer(order);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=Quotation_${order.orderRef}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: 'Error generating quotation PDF' });
  }
};
