import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import prisma from '../config/db';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
    permissions?: string[];
    storeId?: string;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token) as any;

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      storeId: decoded.storeId
    };

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const requirePermission = (requiredPermission: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      // Check if user is SUPER_ADMIN
      if (req.user.role === 'SUPER_ADMIN') {
        return next();
      }

      // Fetch user's role and permissions
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        include: {
          role: {
            include: {
              permissions: {
                include: { permission: true }
              }
            }
          }
        }
      });

      if (!user || user.status !== 'ACTIVE') {
        return res.status(403).json({ success: false, message: 'Account is inactive or not found' });
      }

      let permissions = user.role.permissions.map(rp => rp.permission.action);

      // --- Hardcoded Fallbacks for missing DB permissions ---
      if (req.user.role === 'ADMIN') {
        // Admins can do almost everything
        return next();
      }
      if (req.user.role === 'MANAGER') {
        const managerPerms = ['sales.create', 'sales.view', 'products.view', 'products.create', 'products.update', 'inventory.view', 'inventory.create', 'purchases.view', 'purchases.create', 'finance.view'];
        permissions = [...permissions, ...managerPerms];
      }
      if (req.user.role === 'INVENTORY_MANAGER') {
        const invPerms = ['products.view', 'products.create', 'products.update', 'products.delete', 'inventory.view', 'inventory.create', 'purchases.view', 'purchases.create'];
        permissions = [...permissions, ...invPerms];
      }
      if (req.user.role === 'ACCOUNTANT') {
        const accPerms = ['finance.view', 'finance.create', 'sales.view', 'purchases.view'];
        permissions = [...permissions, ...accPerms];
      }
      if (req.user.role === 'CASHIER') {
        const cashPerms = ['sales.create', 'sales.view', 'products.view'];
        permissions = [...permissions, ...cashPerms];
      }
      
      if (!permissions.includes(requiredPermission)) {
        return res.status(403).json({ success: false, message: 'Forbidden: Insufficient permissions' });
      }

      req.user.permissions = permissions;
      if (user.storeId) {
        req.user.storeId = user.storeId;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
