import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare class InventoryController {
    static getBranches(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getStock(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getMovements(req: Request, res: Response, next: NextFunction): Promise<void>;
    static adjustStock(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=inventory.controller.d.ts.map