import { Router } from 'express';
import {
  getProducts,
  getProductById,
  getVendorProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { authenticate, requireVendorOrAdmin } from '../middleware/auth.js';

const router = Router();

// Public
router.get('/', getProducts);
router.get('/vendor/my-products', authenticate, requireVendorOrAdmin, getVendorProducts);
router.get('/:id', getProductById);

// Vendor/Admin only
router.post('/', authenticate, requireVendorOrAdmin, createProduct);
router.put('/:id', authenticate, requireVendorOrAdmin, updateProduct);
router.delete('/:id', authenticate, requireVendorOrAdmin, deleteProduct);

export default router;
