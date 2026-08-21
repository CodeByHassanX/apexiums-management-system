import { Request, Response, NextFunction, Router } from 'express';
import prisma from '../config/db';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// Get all suppliers
router.get('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const whereClause: any = {};
    if (req.user?.role !== 'SUPER_ADMIN' && req.user?.storeId) {
      whereClause.storeId = req.user.storeId;
    }
    const suppliers = await prisma.supplier.findMany({
      where: whereClause,
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { purchases: true } }
      }
    });
    res.json({ success: true, data: suppliers });
  } catch (error) { next(error); }
});

// Create supplier
router.post('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, company, phone, email, address } = req.body;
    const supplier = await prisma.supplier.create({
      data: { 
        name, company, phone, email, address,
        storeId: req.user?.role !== 'SUPER_ADMIN' ? req.user?.storeId : undefined
      }
    });
    res.status(201).json({ success: true, data: supplier });
  } catch (error) { next(error); }
});

export default router;
