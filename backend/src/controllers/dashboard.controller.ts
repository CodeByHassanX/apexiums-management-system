import { Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { AuthRequest } from '../middleware/auth.middleware';

export class DashboardController {
  static async getDashboardData(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // In a real app, you might pass branchId from query if filtering by branch
      const branchId = req.query.branchId as string;
      const storeId = req.user?.role !== 'SUPER_ADMIN' ? req.user?.storeId : undefined;
      const data = await DashboardService.getStats(branchId, storeId);

      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }
}
