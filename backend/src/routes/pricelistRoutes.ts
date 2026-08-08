import { Router } from 'express';
import {
  getPricelists,
  createPricelist,
  updatePricelist,
  deletePricelist,
} from '../controllers/pricelistController.js';
import { authenticate, requireVendorOrAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getPricelists);
router.post('/', authenticate, requireVendorOrAdmin, createPricelist);
router.put('/:id', authenticate, requireVendorOrAdmin, updatePricelist);
router.delete('/:id', authenticate, requireVendorOrAdmin, deletePricelist);

export default router;
