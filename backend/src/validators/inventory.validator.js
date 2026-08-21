"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adjustStockSchema = void 0;
const zod_1 = require("zod");
exports.adjustStockSchema = zod_1.z.object({
    productId: zod_1.z.string().uuid(),
    branchId: zod_1.z.string().uuid(),
    quantity: zod_1.z.number().int().describe('Positive to add, negative to deduct'),
    type: zod_1.z.enum([
        'PURCHASE', 'SALE', 'RETURN', 'ADJUSTMENT',
        'DAMAGE', 'EXPIRED', 'TRANSFER', 'INITIAL_STOCK'
    ]),
    reason: zod_1.z.string().optional(),
    referenceId: zod_1.z.string().optional(),
});
//# sourceMappingURL=inventory.validator.js.map