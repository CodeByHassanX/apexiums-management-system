import { Request, Response, NextFunction } from 'express';
import { POSService } from '../services/pos.service';
import { AuthRequest } from '../middleware/auth.middleware';

export class POSController {
  static async checkout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { branchId, items, paymentMethod, customerId, discountAmount, taxAmount } = req.body;
      
      const sale = await POSService.checkout({
        userId: req.user!.userId,
        branchId,
        storeId: req.user!.storeId,
        customerId,
        items,
        paymentMethod,
        discountAmount,
        taxAmount
      });

      res.status(201).json({
        success: true,
        message: 'Checkout successful',
        data: sale
      });
    } catch (error) {
      next(error);
    }
  }
}
