import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller';
import { authenticate, requirePermission } from '../middleware/auth.middleware';

const router = Router();

router.get('/branches', authenticate, InventoryController.getBranches);
router.get('/stock', authenticate, requirePermission('inventory.view'), InventoryController.getStock);
router.get('/movements', authenticate, requirePermission('inventory.view'), InventoryController.getMovements);
router.post('/adjust', authenticate, requirePermission('inventory.adjust'), InventoryController.adjustStock);

export default router;
