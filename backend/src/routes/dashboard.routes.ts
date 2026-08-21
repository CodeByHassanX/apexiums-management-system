import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Everyone who is authenticated can see the dashboard for now
router.get('/stats', authenticate, DashboardController.getDashboardData);

export default router;
