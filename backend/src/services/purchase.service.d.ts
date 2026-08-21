export declare class PurchaseService {
    static createPurchase(data: {
        supplierId: string;
        branchId: string;
        storeId?: string;
        userId: string;
        totalAmount: number;
        items: {
            productId: string;
            quantity: number;
            costPrice: number;
        }[];
    }): Promise<{
        id: string;
        supplierId: string;
        status: string;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        taxAmount: import("@prisma/client/runtime/library").Decimal;
        discountAmount: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
        storeId: string | null;
    }>;
}
//# sourceMappingURL=purchase.service.d.ts.map