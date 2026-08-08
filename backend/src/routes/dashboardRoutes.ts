import { Router } from 'express';
import { getDashboardKPIs, getSchedulerBookings } from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/kpis', authenticate, getDashboardKPIs);
router.get('/scheduler', authenticate, getSchedulerBookings);

export default router;
