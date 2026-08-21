import { z } from 'zod';

export const adjustStockSchema = z.object({
  productId: z.string().uuid(),
  branchId: z.string().uuid(),
  quantity: z.number().int().describe('Positive to add, negative to deduct'),
  type: z.enum([
    'PURCHASE', 'SALE', 'RETURN', 'ADJUSTMENT', 
    'DAMAGE', 'EXPIRED', 'TRANSFER', 'INITIAL_STOCK'
  ]),
  reason: z.string().optional(),
  referenceId: z.string().optional(),
});
