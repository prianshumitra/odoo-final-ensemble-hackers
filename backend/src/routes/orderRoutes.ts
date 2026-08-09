import { Router } from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  confirmOrder,
  cancelOrder,
} from '../controllers/orderController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, getOrders);
router.get('/:id', authenticate, getOrderById);
router.post('/', authenticate, createOrder);
router.patch('/:id/confirm', authenticate, confirmOrder);
router.patch('/:id/cancel', authenticate, cancelOrder);

export default router;
