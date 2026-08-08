import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  getVendorProducts,
  togglePublishProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { authenticate, requireVendorOrAdmin, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getProducts);
router.get('/vendor/my-products', authenticate, requireVendorOrAdmin, getVendorProducts);
router.get('/:id', getProductById);
router.post('/', authenticate, requireVendorOrAdmin, createProduct);
router.put('/:id', authenticate, requireVendorOrAdmin, updateProduct);
router.patch('/:id/publish', authenticate, requireAdmin, togglePublishProduct);
router.delete('/:id', authenticate, requireVendorOrAdmin, deleteProduct);

export default router;
