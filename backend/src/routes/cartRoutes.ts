import { Router } from 'express';
import { getCart, syncCart, clearCart } from '../controllers/cartController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getCart);
router.post('/sync', syncCart);
router.delete('/', clearCart);

export default router;
