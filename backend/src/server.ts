import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedDatabase } from './scripts/seed.js';
import { initSocket } from './socket.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import rentalRoutes from './routes/rentalRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import attributeRoutes from './routes/attributeRoutes.js';
import pricelistRoutes from './routes/pricelistRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import quotationTemplateRoutes from './routes/quotationTemplateRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

import { initOverdueCronJob } from './services/cronScheduler.js';
import { ensureSystemProducts } from './controllers/orderController.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Socket.io
initSocket(httpServer);

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// REST API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/attributes', attributeRoutes);
app.use('/api/pricelists', pricelistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/quotation-templates', quotationTemplateRoutes);
app.use('/api/reports', reportRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'EZRent Rental Management API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// Start Server
const startServer = async () => {
  await connectDB();
  await seedDatabase();
  await ensureSystemProducts();
  initOverdueCronJob();

  httpServer.listen(PORT, () => {
    console.log(`🚀 Realtime EZRent Management API Server listening on http://localhost:${PORT}`);
  });
};

startServer();
