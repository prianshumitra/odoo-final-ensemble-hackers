import { Router } from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  sendQuotation,
  confirmOrder,
  cancelOrder,
  processPickup,
  processReturn,
  printQuotationPDF,
} from '../controllers/orderController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, getOrders);
router.get('/:id', authenticate, getOrderById);
router.post('/', authenticate, createOrder);
router.patch('/:id/send', authenticate, sendQuotation);
router.patch('/:id/confirm', authenticate, confirmOrder);
router.patch('/:id/cancel', authenticate, cancelOrder);
router.post('/:id/pickup', authenticate, processPickup);
router.post('/:id/return', authenticate, processReturn);
router.get('/:id/print', authenticate, printQuotationPDF);

export default router;
