import { Request, Response, NextFunction, Router } from 'express';
import prisma from '../config/db';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// Get all customers
router.get('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const whereClause: any = {};
    if (req.user?.role !== 'SUPER_ADMIN' && req.user?.storeId) {
      whereClause.storeId = req.user.storeId;
    }
    const customers = await prisma.customer.findMany({
      where: whereClause,
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { sales: true } }
      }
    });
    res.json({ success: true, data: customers });
  } catch (error) { next(error); }
});

// Create customer
router.post('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, phone, email, address, openingBalance, creditLimit } = req.body;
    const customer = await prisma.customer.create({
      data: { 
        name, phone, email, address, openingBalance: openingBalance || 0, creditLimit: creditLimit || 0,
        storeId: req.user?.role !== 'SUPER_ADMIN' ? req.user?.storeId : undefined
      }
    });
    res.status(201).json({ success: true, data: customer });
  } catch (error) { next(error); }
});

export default router;
