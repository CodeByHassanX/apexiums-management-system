interface CheckoutItem {
    productId: string;
    quantity: number;
    sellingPrice: number;
}
interface CheckoutPayload {
    userId: string;
    branchId: string;
    storeId?: string;
    customerId?: string;
    items: CheckoutItem[];
    paymentMethod: string;
    discountAmount?: number;
    taxAmount?: number;
}
export declare class POSService {
    static checkout(payload: CheckoutPayload): Promise<{
        items: {
            id: string;
            saleId: string;
            productId: string;
            quantity: number;
            sellingPrice: import("@prisma/client/runtime/library").Decimal;
            tax: import("@prisma/client/runtime/library").Decimal;
            discount: import("@prisma/client/runtime/library").Decimal;
        }[];
        payments: {
            id: string;
            saleId: string;
            method: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            createdAt: Date;
        }[];
    } & {
        id: string;
        customerId: string | null;
        userId: string;
        status: string;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        taxAmount: import("@prisma/client/runtime/library").Decimal;
        discountAmount: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
        storeId: string | null;
    }>;
}
export {};
//# sourceMappingURL=pos.service.d.ts.map