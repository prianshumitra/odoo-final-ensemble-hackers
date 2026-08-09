import { Router } from 'express';
import {
  createPaymentOrder,
  verifyPayment,
  handleWebhook,
  getVendorPayments,
  getUserPayments,
  processRefund,
} from '../controllers/paymentController.js';
import { authenticate, requireVendorOrAdmin } from '../middleware/auth.js';

const router = Router();

// Customer endpoints
router.post('/create-order', authenticate, createPaymentOrder);
router.post('/verify', authenticate, verifyPayment);
router.get('/my-payments', authenticate, getUserPayments);

// Razorpay Webhook endpoint (Signature checked via raw payload)
router.post('/webhook', handleWebhook);

// Vendor / Admin endpoints
router.get('/vendor', authenticate, requireVendorOrAdmin, getVendorPayments);
router.post('/:id/refund', authenticate, requireVendorOrAdmin, processRefund);

export default router;
