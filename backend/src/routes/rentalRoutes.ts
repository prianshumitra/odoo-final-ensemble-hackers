import { Router } from 'express';
import { createRental, getMyRentals, getVendorRentals, updateRentalStatus } from '../controllers/rentalController.js';
import { authenticate, requireVendor } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, createRental);
router.get('/my-rentals', authenticate, getMyRentals);
router.get('/vendor', authenticate, requireVendor, getVendorRentals);
router.put('/:id/status', authenticate, requireVendor, updateRentalStatus);

export default router;
