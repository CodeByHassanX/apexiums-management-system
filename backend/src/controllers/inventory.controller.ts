import { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../services/inventory.service';
import { adjustStockSchema } from '../validators/inventory.validator';
import { AuthRequest } from '../middleware/auth.middleware';

export class InventoryController {
  static async getBranches(req: Request, res: Response, next: NextFunction) {
    try {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      const branches = await prisma.branch.findMany();
      res.json({ success: true, data: branches });
    } catch (error) { next(error); }
  }

  static async getStock(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {
        branchId: req.query.branchId as string,
        productId: req.query.productId as string,
        lowStock: req.query.lowStock === 'true'
      };
      const stock = await InventoryService.getStock(filters);
      res.json({ success: true, data: stock });
    } catch (error) { next(error); }
  }

  static async getMovements(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {
        productId: req.query.productId as string,
        type: req.query.type as string
      };
      const movements = await InventoryService.getMovements(filters);
      res.json({ success: true, data: movements });
    } catch (error) { next(error); }
  }

  static async adjustStock(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = adjustStockSchema.parse(req.body);
      const userId = req.user!.userId;

      const result = await InventoryService.adjustStock({
        ...data,
        userId
      });

      res.status(201).json({ success: true, message: 'Stock adjusted successfully', data: result });
    } catch (error) { next(error); }
  }
}
