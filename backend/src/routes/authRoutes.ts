import { Router } from 'express';
import {
  registerUser,
  registerVendor,
  loginUser,
  adminLogin,
  getMe,
  listUsers,
  updateUserStatus,
} from '../controllers/authController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/register', registerUser);
router.post('/register-vendor', registerVendor);
router.post('/login', loginUser);
router.post('/admin-login', adminLogin);
router.get('/me', authenticate, getMe);

// Admin user management
router.get('/users', authenticate, requireAdmin, listUsers);
router.put('/users/:id/status', authenticate, requireAdmin, updateUserStatus);

export default router;
