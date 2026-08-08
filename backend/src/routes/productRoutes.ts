import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  getVendorProducts,
  deleteProduct,
} from '../controllers/productController.js';
import { authenticate, requireVendor } from '../middleware/auth.js';

const router = Router();

router.get('/', getProducts);
router.get('/vendor/my-products', authenticate, requireVendor, getVendorProducts);
router.get('/:id', getProductById);
router.post('/', authenticate, requireVendor, createProduct);
router.put('/:id', authenticate, requireVendor, updateProduct);
router.delete('/:id', authenticate, requireVendor, deleteProduct);

export default router;
