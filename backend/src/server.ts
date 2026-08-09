import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedDatabase } from './scripts/seed.js';
import { initSocket, getIO } from './socket.js';
import { RentalOrder } from './models/RentalOrder.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Socket.io
initSocket(httpServer);

// Middleware with raw body verification for webhook signature checks
app.use(cors({ origin: true, credentials: true }));
app.use(
  express.json({
    verify: (req, _res, buf) => {
      (req as any).rawBody = buf;
    },
  })
);

// REST API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'EZRent API running', timestamp: new Date().toISOString() });
});

// Periodic background check to mark overdue rentals and calculate 2%/day late fee
const startOverdueMonitor = () => {
  setInterval(async () => {
    try {
      const orders = await RentalOrder.find({ status: { $in: ['active', 'overdue'] } });
      const now = new Date();
      for (const order of orders) {
        const endDate = new Date(order.rentalEnd);
        if (now > endDate) {
          const diffTime = Math.abs(now.getTime() - endDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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

          if (updated) {
            await order.save();
            try { getIO().emit('order:updated', order); } catch (_) {}
          }
        }
      }
    } catch (_) {}
  }, 15000); // check every 15 seconds for tight real-time sync
};

// Start Server
const startServer = async () => {
  await connectDB();
  await seedDatabase();
  startOverdueMonitor();

  httpServer.listen(PORT, () => {
    console.log(`🚀 EZRent API Server running on http://localhost:${PORT}`);
  });
};

startServer();

