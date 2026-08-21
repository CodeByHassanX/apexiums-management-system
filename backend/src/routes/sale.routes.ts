import { Request, Response, NextFunction, Router } from 'express';
import prisma from '../config/db';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// Get all sales (Orders History)
router.get('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const whereClause: any = {};
    if (req.user?.role !== 'SUPER_ADMIN' && req.user?.storeId) {
      whereClause.storeId = req.user.storeId;
    }

    const sales = await prisma.sale.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: true,
        user: { select: { name: true } },
        items: {
          include: { product: { select: { name: true, sku: true } } }
        }
      }
    });
    res.json({ success: true, data: sales });
  } catch (error) { next(error); }
});

export default router;
