"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceService = void 0;
const db_1 = __importDefault(require("../config/db"));
class FinanceService {
    static async getRevenueStats(storeId) {
        const whereStore = storeId ? { storeId } : {};
        const totalSales = await db_1.default.sale.aggregate({
            _sum: { totalAmount: true, taxAmount: true, discountAmount: true },
            where: { status: 'COMPLETED', ...whereStore }
        });
        const totalPurchases = await db_1.default.purchase.aggregate({
            _sum: { totalAmount: true },
            where: { status: { in: ['RECEIVED', 'PAID'] }, ...whereStore }
        });
        const totalExpenses = await db_1.default.expense.aggregate({
            _sum: { amount: true },
            where: whereStore
        });
        const revenue = Number(totalSales._sum.totalAmount || 0);
        const cogs = Number(totalPurchases._sum.totalAmount || 0); // Cost of goods sold roughly
        const expenses = Number(totalExpenses._sum.amount || 0);
        const netProfit = revenue - cogs - expenses;
        // Recent Payments
        const recentPayments = await db_1.default.payment.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            where: {
                sale: { ...whereStore }
            },
            include: { sale: { include: { customer: true } } }
        });
        return {
            overview: {
                revenue,
                cogs,
                expenses,
                netProfit
            },
            recentPayments
        };
    }
    static async getDebtStats(storeId) {
        const whereStore = storeId ? { storeId } : {};
        // Customers with positive openingBalance are considered in debt to us
        const customerDebts = await db_1.default.customer.findMany({
            where: { openingBalance: { gt: 0 }, ...whereStore },
            orderBy: { openingBalance: 'desc' }
        });
        // Suppliers with positive openingBalance means we owe them
        const supplierDebts = await db_1.default.supplier.findMany({
            where: { openingBalance: { gt: 0 }, ...whereStore },
            orderBy: { openingBalance: 'desc' }
        });
        return {
            customerDebts,
            supplierDebts,
            totalCustomerDebt: customerDebts.reduce((sum, c) => sum + Number(c.openingBalance), 0),
            totalSupplierDebt: supplierDebts.reduce((sum, s) => sum + Number(s.openingBalance), 0),
        };
    }
}
exports.FinanceService = FinanceService;
//# sourceMappingURL=finance.service.js.map