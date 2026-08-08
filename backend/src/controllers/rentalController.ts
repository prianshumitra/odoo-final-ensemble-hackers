import { Response } from 'express';
import { Rental } from '../models/Rental.js';
import { AuthRequest } from '../middleware/auth.js';
import { getIO } from '../socket.js';

export const createRental = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, productName, productImage, selectedColor, selectedSize, rentDuration, amount, unit } = req.body;

    const rental = await Rental.create({
      userEmail: req.user?.email || 'customer@example.com',
      userName: req.user?.name || 'Customer',
      productId,
      productName,
      productImage,
      selectedColor: selectedColor || 'Default',
      selectedSize: selectedSize || '',
      rentDuration: rentDuration || '6 Month',
      amount: amount || 0,
      unit: unit || 'Month',
      status: 'Active Subscription',
    });

    // ⚡ Emit realtime event
    try {
      const io = getIO();
      io.emit('rental:created', rental);
      if (req.user?.id) {
        io.to(`user:${req.user.id}`).emit('my:rental:created', rental);
      }
    } catch (err) {
      console.warn('Socket emit error:', (err as Error).message);
    }

    res.status(201).json({
      message: 'Rental subscription created successfully!',
      rental,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error placing rental order', error: (error as Error).message });
  }
};

export const getMyRentals = async (req: AuthRequest, res: Response) => {
  try {
    const userEmail = req.user?.email || 'alex.wombat@example.com';
    const rentals = await Rental.find({ userEmail }).sort({ createdAt: -1 });
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rentals' });
  }
};

export const getVendorRentals = async (req: AuthRequest, res: Response) => {
  try {
    const rentals = await Rental.find().sort({ createdAt: -1 });
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vendor rentals' });
  }
};

export const updateRentalStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const rental = await Rental.findById(req.params.id);
    if (!rental) {
      res.status(404).json({ message: 'Rental not found' });
      return;
    }

    if (status) {
      rental.status = status;
    }

    const updatedRental = await rental.save();

    // ⚡ Realtime broadcast
    try {
      const io = getIO();
      io.emit('rental:updated', updatedRental);
      console.log(`📡 Broadcasted rental:updated for ${updatedRental._id}`);
    } catch (err) {
      console.warn('Socket broadcast error:', (err as Error).message);
    }

    res.json({ message: 'Rental status updated successfully', rental: updatedRental });
  } catch (error) {
    res.status(500).json({ message: 'Error updating rental status', error: (error as Error).message });
  }
};
