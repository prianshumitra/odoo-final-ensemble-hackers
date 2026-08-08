import { Router } from 'express';
import {
  getQuotationTemplates,
  createQuotationTemplate,
  updateQuotationTemplate,
  deleteQuotationTemplate,
} from '../controllers/quotationTemplateController.js';
import { authenticate, requireVendorOrAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getQuotationTemplates);
router.post('/', authenticate, requireVendorOrAdmin, createQuotationTemplate);
router.put('/:id', authenticate, requireVendorOrAdmin, updateQuotationTemplate);
router.delete('/:id', authenticate, requireVendorOrAdmin, deleteQuotationTemplate);

export default router;
