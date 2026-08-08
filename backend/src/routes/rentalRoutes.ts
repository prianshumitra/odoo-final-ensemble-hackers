import { Router } from 'express';
import { createRental, getMyRentals } from '../controllers/rentalController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, createRental);
router.get('/my-rentals', authenticate, getMyRentals);

export default router;
