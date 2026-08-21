import { Request, Response, NextFunction, Router } from 'express';
import prisma from '../config/db';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { PurchaseService } from '../services/purchase.service';

const router = Router();

// Get all purchases
router.get('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const whereClause: any = {};
    if (req.user?.role !== 'SUPER_ADMIN' && req.user?.storeId) {
      whereClause.storeId = req.user.storeId;
    }
    const purchases = await prisma.purchase.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        supplier: { select: { name: true, company: true } },
        items: {
          include: { product: { select: { name: true } } }
        }
      }
    });
    res.json({ success: true, data: purchases });
  } catch (error) { next(error); }
});

// Create purchase
router.post('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { supplierId, branchId, totalAmount, items } = req.body;
    const storeId = req.user?.role !== 'SUPER_ADMIN' ? req.user?.storeId : undefined;
    const userId = req.user!.userId;
    const purchase = await PurchaseService.createPurchase({ supplierId, branchId, storeId, userId, totalAmount, items });
    res.status(201).json({ success: true, data: purchase });
  } catch (error) { next(error); }
});

export default router;
