import { Request, Response, NextFunction, Router } from 'express';
import prisma from '../config/db';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// Get messages for current store
router.get('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const whereClause: any = { type: 'SYSTEM_MSG' };
    
    // If not super admin, only get messages for this store OR broadcast messages (storeId = null)
    if (req.user?.role !== 'SUPER_ADMIN') {
      whereClause.OR = [
        { storeId: req.user?.storeId },
        { storeId: null }
      ];
    }
    
    const messages = await prisma.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        store: { select: { name: true } }
      }
    });
    
    res.json({ success: true, data: messages });
  } catch (error) { next(error); }
});

// Broadcast/Send a message (Super Admin only)
router.post('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const { storeId, message } = req.body;
    
    const msg = await prisma.notification.create({
      data: {
        type: 'SYSTEM_MSG',
        message,
        storeId: storeId || null
      }
    });

    res.status(201).json({ success: true, data: msg });
  } catch (error) { next(error); }
});

export default router;
