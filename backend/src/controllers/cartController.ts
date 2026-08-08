import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { CartItemModel } from '../models/Cart.js';
import { getIO } from '../socket.js';

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || req.user?.email || 'guest';
    const items = await CartItemModel.find({
      $or: [{ userId }, { userEmail: req.user?.email }],
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart items', error: (error as Error).message });
  }
};

export const syncCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || req.user?.email || 'guest';
    const userEmail = req.user?.email || 'user@example.com';
    const { items } = req.body;

    if (!Array.isArray(items)) {
      res.status(400).json({ message: 'Items array is required' });
      return;
    }

    // Remove existing cart for user
    await CartItemModel.deleteMany({
      $or: [{ userId }, { userEmail }],
    });

    // Insert new cart items
    const docs = items.map((item: any) => ({
      userId,
      userEmail,
      productId: item.productId || item.product?.id || item.product?._id,
      productName: item.productName || item.product?.name || 'Rental Item',
      productImage: item.productImage || item.product?.image || '',
      amount: item.amount || item.product?.pricing?.amount || 0,
      unit: item.unit || item.product?.pricing?.unit || 'Month',
      quantity: item.quantity || 1,
      selectedColor: item.selectedColor || '',
      selectedSize: item.selectedSize || '',
      rentDuration: item.rentDuration || item.product?.duration || '6 Month',
    }));

    const saved = await CartItemModel.insertMany(docs);

    // ⚡ Realtime emit to user room
    try {
      getIO().to(`user:${userId}`).emit('cart:updated', saved);
    } catch (err) {
      // socket silent fallback
    }

    res.json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Error syncing cart', error: (error as Error).message });
  }
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || req.user?.email || 'guest';
    const userEmail = req.user?.email || 'user@example.com';
    await CartItemModel.deleteMany({
      $or: [{ userId }, { userEmail }],
    });

    try {
      getIO().to(`user:${userId}`).emit('cart:updated', []);
    } catch (err) {}

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart' });
  }
};
