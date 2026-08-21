export declare class DashboardService {
    static getStats(branchId?: string, storeId?: string): Promise<{
        stats: {
            totalProducts: number;
            totalCategories: number;
            totalRevenue: number | import("@prisma/client/runtime/library").Decimal;
            totalSales: number;
        };
        lowStock: ({
            branch: {
                id: string;
                name: string;
                address: string | null;
                storeId: string;
            };
            product: {
                id: string;
                sku: string;
                barcode: string | null;
                name: string;
                description: string | null;
                categoryId: string;
                brandId: string | null;
                unit: string;
                costPrice: import("@prisma/client/runtime/library").Decimal;
                sellingPrice: import("@prisma/client/runtime/library").Decimal;
                discount: import("@prisma/client/runtime/library").Decimal;
                tax: import("@prisma/client/runtime/library").Decimal;
                status: string;
                image: string | null;
                minimumStock: number;
                maximumStock: number | null;
                expiryDate: Date | null;
                supplierId: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            productId: string;
            branchId: string;
            quantity: number;
        })[];
        recentSales: ({
            items: ({
                product: {
                    name: string;
                };
            } & {
                id: string;
                saleId: string;
                productId: string;
                quantity: number;
                sellingPrice: import("@prisma/client/runtime/library").Decimal;
                tax: import("@prisma/client/runtime/library").Decimal;
                discount: import("@prisma/client/runtime/library").Decimal;
            })[];
            user: {
                name: string;
            };
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
        })[];
    }>;
}
//# sourceMappingURL=dashboard.service.d.ts.map