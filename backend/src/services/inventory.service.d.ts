export declare class InventoryService {
    /**
     * Get current stock for all products or a specific branch/product
     */
    static getStock(filters: {
        branchId?: string;
        productId?: string;
        lowStock?: boolean;
    }): Promise<({
        branch: {
            id: string;
            name: string;
        };
        product: {
            id: string;
            minimumStock: number;
            name: string;
            sku: string;
        };
    } & {
        id: string;
        productId: string;
        branchId: string;
        quantity: number;
    })[]>;
    /**
     * Get audit trail of stock movements
     */
    static getMovements(filters: {
        productId?: string;
        type?: string;
    }): Promise<({
        product: {
            name: string;
            sku: string;
        };
        user: {
            email: string;
            name: string;
        };
    } & {
        id: string;
        productId: string;
        type: string;
        quantity: number;
        reason: string | null;
        referenceId: string | null;
        userId: string;
        createdAt: Date;
    })[]>;
    /**
     * Adjust stock atomically
     */
    static adjustStock(data: {
        productId: string;
        branchId: string;
        quantity: number;
        type: string;
        reason?: string;
        referenceId?: string;
        userId: string;
    }): Promise<{
        inventory: {
            id: string;
            productId: string;
            branchId: string;
            quantity: number;
        };
        transaction: {
            id: string;
            productId: string;
            type: string;
            quantity: number;
            reason: string | null;
            referenceId: string | null;
            userId: string;
            createdAt: Date;
        };
    }>;
}
//# sourceMappingURL=inventory.service.d.ts.map