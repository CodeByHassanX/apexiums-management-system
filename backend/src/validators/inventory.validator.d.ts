import { z } from 'zod';
export declare const adjustStockSchema: z.ZodObject<{
    productId: z.ZodString;
    branchId: z.ZodString;
    quantity: z.ZodNumber;
    type: z.ZodEnum<{
        ADJUSTMENT: "ADJUSTMENT";
        DAMAGE: "DAMAGE";
        EXPIRED: "EXPIRED";
        INITIAL_STOCK: "INITIAL_STOCK";
        PURCHASE: "PURCHASE";
        RETURN: "RETURN";
        SALE: "SALE";
        TRANSFER: "TRANSFER";
    }>;
    reason: z.ZodOptional<z.ZodString>;
    referenceId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=inventory.validator.d.ts.map