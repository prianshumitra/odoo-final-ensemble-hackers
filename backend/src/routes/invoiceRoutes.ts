import { Router } from 'express';
import {
  getInvoices,
  getInvoiceById,
  createInvoiceFromOrder,
  payInvoice,
  printInvoicePDF,
} from '../controllers/invoiceController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, getInvoices);
router.get('/:id', authenticate, getInvoiceById);
router.post('/', authenticate, createInvoiceFromOrder);
router.patch('/:id/pay', authenticate, payInvoice);
router.get('/:id/print', authenticate, printInvoicePDF);

export default router;
