import { Router } from 'express';
import { POSController } from '../controllers/pos.controller';
import { authenticate, requirePermission } from '../middleware/auth.middleware';

const router = Router();

router.post('/checkout', authenticate, requirePermission('sales.create'), POSController.checkout);

export default router;
