"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const db_1 = __importDefault(require("../config/db"));
class DashboardService {
    static async getStats(branchId, storeId) {
        // 1. Core Stats
        const totalProducts = await db_1.default.product.count({ where: { status: 'ACTIVE' } });
        const totalCategories = await db_1.default.category.count({ where: { status: 'ACTIVE' } });
        const salesAggregate = await db_1.default.sale.aggregate({
            _sum: { totalAmount: true },
            _count: { id: true },
            where: {
                status: 'COMPLETED',
                ...(storeId ? { storeId } : {})
            }
        });
        const totalRevenue = salesAggregate._sum.totalAmount || 0;
        const totalSales = salesAggregate._count.id || 0;
        // 2. Low Stock Alerts
        const lowStockItems = await db_1.default.inventory.findMany({
            where: {
                ...(branchId ? { branchId } : {}),
                quantity: { lte: 10 } // We'll just hardcode <= 10 or could use product.minimumStock
            },
            include: {
                product: true,
                branch: true
            },
            take: 10,
            orderBy: { quantity: 'asc' }
        });
        // Filtering out items that aren't actually below their specific minimumStock
        const actualLowStock = lowStockItems.filter(item => item.quantity <= item.product.minimumStock).slice(0, 5);
        // 3. Recent Sales
        const recentSales = await db_1.default.sale.findMany({
            take: 5,
            where: {
                ...(storeId ? { storeId } : {})
            },
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true } },
                items: {
                    include: { product: { select: { name: true } } }
                }
            }
        });
        return {
            stats: {
                totalProducts,
                totalCategories,
                totalRevenue,
                totalSales
            },
            lowStock: actualLowStock,
            recentSales
        };
    }
}
exports.DashboardService = DashboardService;
//# sourceMappingURL=dashboard.service.js.map