export declare class FinanceService {
    static getRevenueStats(storeId?: string): Promise<{
        overview: {
            revenue: number;
            cogs: number;
            expenses: number;
            netProfit: number;
        };
        recentPayments: ({
            sale: {
                customer: {
                    id: string;
                    name: string;
                    phone: string | null;
                    email: string | null;
                    address: string | null;
                    openingBalance: import("@prisma/client/runtime/library").Decimal;
                    creditLimit: import("@prisma/client/runtime/library").Decimal;
                    status: string;
                    storeId: string | null;
                } | null;
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
            };
        } & {
            id: string;
            saleId: string;
            method: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            createdAt: Date;
        })[];
    }>;
    static getDebtStats(storeId?: string): Promise<{
        customerDebts: {
            id: string;
            name: string;
            phone: string | null;
            email: string | null;
            address: string | null;
            openingBalance: import("@prisma/client/runtime/library").Decimal;
            creditLimit: import("@prisma/client/runtime/library").Decimal;
            status: string;
            storeId: string | null;
        }[];
        supplierDebts: {
            id: string;
            name: string;
            company: string | null;
            phone: string | null;
            email: string | null;
            address: string | null;
            taxNumber: string | null;
            openingBalance: import("@prisma/client/runtime/library").Decimal;
            status: string;
            storeId: string | null;
        }[];
        totalCustomerDebt: number;
        totalSupplierDebt: number;
    }>;
}
//# sourceMappingURL=finance.service.d.ts.map