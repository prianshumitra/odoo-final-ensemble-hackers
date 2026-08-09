import { Request, Response } from 'express';
import { RentalOrder } from '../models/RentalOrder.js';
import { Product } from '../models/Product.js';
import { AuthRequest } from '../middleware/auth.js';
import { getIO } from '../socket.js';

// Helper: generate sequential order ref
const getNextOrderRef = async (): Promise<string> => {
  const count = await RentalOrder.countDocuments();
  return `RO${(count + 1).toString().padStart(4, '0')}`;
};

// Helper: calculate overdue status and 2% per day late fees
const processLateFees = async (orders: any[]) => {
  const now = new Date();
  for (const order of orders) {
    if (order.status === 'active' || order.status === 'overdue') {
      const endDate = new Date(order.rentalEnd);
      if (now > endDate) {
        const diffTime = Math.abs(now.getTime() - endDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        // Late fee: 2% per day of the order total
        const computedLateFee = Math.round(order.total * 0.02 * diffDays);
        let updated = false;

        if (order.status !== 'overdue') {
          order.status = 'overdue';
          updated = true;
        }
        if (order.lateFee !== computedLateFee) {
          order.lateFee = computedLateFee;
          updated = true;
        }

        if (updated && typeof order.save === 'function') {
          await order.save();
        }
      }
    }
  }
};

// GET /api/orders — list orders for the current user's role
export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const filter: any = {};

    if (req.user?.role === 'customer') {
      filter.customer = req.user.id;
    } else if (req.user?.role === 'vendor') {
      filter.vendorId = req.user.id;
    }
    // admin sees all

    const { status } = req.query;
    if (status && status !== 'all') {
      filter.status = status;
    }

    const orders = await RentalOrder.find(filter).sort({ createdAt: -1 });
    await processLateFees(orders);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: (error as Error).message });
  }
};

// GET /api/orders/:id
export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const order = await RentalOrder.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    await processLateFees([order]);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order' });
  }
};

// POST /api/orders — customer creates a rental order (status: pending)
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { lines, rentalStart, rentalEnd } = req.body;

    if (!lines || !Array.isArray(lines) || lines.length === 0) {
      res.status(400).json({ message: 'Order must have at least one product line.' });
      return;
    }

    const start = rentalStart ? new Date(rentalStart) : new Date();
    const end = rentalEnd
      ? new Date(rentalEnd)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Group items by vendorId
    const linesByVendor: { [vendorId: string]: { product: any; quantity: number }[] } = {};

    for (const line of lines) {
      const pId = line.productId || line.product;
      const product = await Product.findById(pId);
      if (!product) {
        res.status(400).json({ message: `Product not found: ${pId}` });
        return;
      }

      const qty = Number(line.quantity || 1);
      if (product.quantityOnHand < qty) {
        res.status(400).json({ message: `Not enough stock for "${product.name}". Available: ${product.quantityOnHand}` });
        return;
      }

      const vId = String(product.vendorId);
      if (!linesByVendor[vId]) {
        linesByVendor[vId] = [];
      }
      linesByVendor[vId].push({ product, quantity: qty });
    }

    const createdOrders = [];

    for (const [vId, vendorLines] of Object.entries(linesByVendor)) {
      let total = 0;
      const formattedLines = [];

      for (const { product, quantity } of vendorLines) {
        const unitPrice = product.pricePerUnit;
        const amount = unitPrice * quantity;
        total += amount;

        formattedLines.push({
          product: product._id,
          productName: product.name,
          productImage: product.image,
          quantity,
          unitPrice,
          amount,
        });
      }

      const orderRef = await getNextOrderRef();

      const order = await RentalOrder.create({
        orderRef,
        customer: req.user!.id,
        customerName: req.user!.name || req.user!.email,
        customerEmail: req.user!.email,
        vendorId: vId,
        status: 'pending',
        rentalStart: start,
        rentalEnd: end,
        lines: formattedLines,
        total,
        lateFee: 0,
      });

      try { getIO().emit('order:created', order); } catch (_) {}
      createdOrders.push(order);
    }

    res.status(201).json({
      message: 'Rental order(s) created (pending vendor confirmation)',
      order: createdOrders[0],
      orders: createdOrders,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Error creating order', error: (error as Error).message });
  }
};

// PATCH /api/orders/:id/confirm — vendor approves rental request → status: active, stock decrements
export const confirmOrder = async (req: AuthRequest, res: Response) => {
  try {
    const order = await RentalOrder.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    if (order.status !== 'pending') {
      res.status(400).json({ message: `Cannot approve order with status "${order.status}".` });
      return;
    }

    // Verify vendor owns this order
    if (req.user?.role === 'vendor' && String(order.vendorId) !== String(req.user.id)) {
      res.status(403).json({ message: 'Not authorized to approve this order.' });
      return;
    }

    // Decrement stock for each line
    for (const line of order.lines) {
      const product = await Product.findById(line.product);
      if (!product) continue;

      if (product.quantityOnHand < line.quantity) {
        res.status(400).json({ message: `Not enough stock for "${product.name}". Available: ${product.quantityOnHand}, Requested: ${line.quantity}` });
        return;
      }

      product.quantityOnHand -= line.quantity;
      await product.save();

      try { getIO().emit('product:updated', product); } catch (_) {}
    }

    order.status = 'active';
    await order.save();

    try { getIO().emit('order:updated', order); } catch (_) {}

    res.json({ message: 'Rental order approved and active', order });
  } catch (error) {
    console.error('Confirm order error:', error);
    res.status(500).json({ message: 'Error confirming order' });
  }
};

// PATCH /api/orders/:id/complete — vendor marks returned/completed → restores stock
export const completeOrder = async (req: AuthRequest, res: Response) => {
  try {
    const order = await RentalOrder.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    if (order.status !== 'active' && order.status !== 'overdue') {
      res.status(400).json({ message: `Cannot complete order with status "${order.status}".` });
      return;
    }

    // Restore stock
    for (const line of order.lines) {
      const product = await Product.findById(line.product);
      if (!product) continue;

      product.quantityOnHand += line.quantity;
      await product.save();

      try { getIO().emit('product:updated', product); } catch (_) {}
    }

    order.status = 'completed';
    await order.save();

    try { getIO().emit('order:updated', order); } catch (_) {}

    res.json({ message: 'Rental completed and returned successfully', order });
  } catch (error) {
    console.error('Complete order error:', error);
    res.status(500).json({ message: 'Error completing order' });
  }
};

// PATCH /api/orders/:id/cancel — vendor or customer cancels order
export const cancelOrder = async (req: AuthRequest, res: Response) => {
  try {
    const order = await RentalOrder.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    if (order.status === 'cancelled' || order.status === 'completed') {
      res.status(400).json({ message: `Order is already ${order.status}.` });
      return;
    }

    // If cancelling an active or overdue order, restore stock
    if (order.status === 'active' || order.status === 'overdue') {
      for (const line of order.lines) {
        const product = await Product.findById(line.product);
        if (!product) continue;

        product.quantityOnHand += line.quantity;
        await product.save();

        try { getIO().emit('product:updated', product); } catch (_) {}
      }
    }

    order.status = 'cancelled';
    await order.save();

    try { getIO().emit('order:updated', order); } catch (_) {}

    res.json({ message: 'Order cancelled', order });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Error cancelling order' });
  }
};
