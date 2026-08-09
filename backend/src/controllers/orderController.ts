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
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order' });
  }
};

// POST /api/orders — customer creates a rental order (status: pending)
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { lines } = req.body;

    if (!lines || !Array.isArray(lines) || lines.length === 0) {
      res.status(400).json({ message: 'Order must have at least one product line.' });
      return;
    }

    // Validate all products exist and have stock, and determine vendorId
    let total = 0;
    const formattedLines = [];
    let vendorId: string | null = null;

    for (const line of lines) {
      const product = await Product.findById(line.productId);
      if (!product) {
        res.status(400).json({ message: `Product not found: ${line.productId}` });
        return;
      }

      if (product.quantityOnHand < (line.quantity || 1)) {
        res.status(400).json({ message: `Not enough stock for "${product.name}". Available: ${product.quantityOnHand}` });
        return;
      }

      // All products in one order must belong to the same vendor
      if (!vendorId) {
        vendorId = String(product.vendorId);
      } else if (String(product.vendorId) !== vendorId) {
        res.status(400).json({ message: 'All products in an order must be from the same vendor.' });
        return;
      }

      const qty = Number(line.quantity || 1);
      const unitPrice = product.pricePerUnit;
      const amount = unitPrice * qty;
      total += amount;

      formattedLines.push({
        product: product._id,
        productName: product.name,
        productImage: product.image,
        quantity: qty,
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
      vendorId,
      status: 'pending',
      lines: formattedLines,
      total,
    });

    try { getIO().emit('order:created', order); } catch (_) {}

    res.status(201).json({ message: 'Rental order created (pending vendor confirmation)', order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Error creating order', error: (error as Error).message });
  }
};

// PATCH /api/orders/:id/confirm — vendor confirms order → stock decrements
export const confirmOrder = async (req: AuthRequest, res: Response) => {
  try {
    const order = await RentalOrder.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    if (order.status !== 'pending') {
      res.status(400).json({ message: `Cannot confirm order with status "${order.status}".` });
      return;
    }

    // Verify vendor owns this order
    if (req.user?.role === 'vendor' && String(order.vendorId) !== String(req.user.id)) {
      res.status(403).json({ message: 'Not authorized to confirm this order.' });
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

    order.status = 'confirmed';
    await order.save();

    try { getIO().emit('order:updated', order); } catch (_) {}

    res.json({ message: 'Order confirmed and stock decremented', order });
  } catch (error) {
    console.error('Confirm order error:', error);
    res.status(500).json({ message: 'Error confirming order' });
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

    if (order.status === 'cancelled') {
      res.status(400).json({ message: 'Order is already cancelled.' });
      return;
    }

    // If cancelling a confirmed order, restore stock
    if (order.status === 'confirmed') {
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
