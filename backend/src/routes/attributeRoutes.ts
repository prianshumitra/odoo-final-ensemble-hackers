import { Router } from 'express';
import {
  getAttributes,
  createAttribute,
  updateAttribute,
  deleteAttribute,
} from '../controllers/attributeController.js';
import { authenticate, requireVendorOrAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getAttributes);
router.post('/', authenticate, requireVendorOrAdmin, createAttribute);
router.put('/:id', authenticate, requireVendorOrAdmin, updateAttribute);
router.delete('/:id', authenticate, requireVendorOrAdmin, deleteAttribute);

export default router;
