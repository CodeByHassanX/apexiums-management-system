import { Request, Response, NextFunction, Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { FinanceService } from '../services/finance.service';

const router = Router();

// Get Revenue overview
router.get('/revenue', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const storeId = req.user?.role !== 'SUPER_ADMIN' ? req.user?.storeId : undefined;
    const data = await FinanceService.getRevenueStats(storeId);
    res.json({ success: true, data });
  } catch (error) { next(error); }
});

// Get Debt overview
router.get('/debt', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const storeId = req.user?.role !== 'SUPER_ADMIN' ? req.user?.storeId : undefined;
    const data = await FinanceService.getDebtStats(storeId);
    res.json({ success: true, data });
  } catch (error) { next(error); }
});

export default router;
