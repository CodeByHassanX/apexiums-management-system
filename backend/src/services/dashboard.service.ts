import prisma from '../config/db';

export class DashboardService {
  static async getStats(branchId?: string, storeId?: string) {
    // 1. Core Stats
    const totalProducts = await prisma.product.count({ where: { status: 'ACTIVE' } });
    const totalCategories = await prisma.category.count({ where: { status: 'ACTIVE' } });
    
    const salesAggregate = await prisma.sale.aggregate({
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
    const lowStockItems = await prisma.inventory.findMany({
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
    const recentSales = await prisma.sale.findMany({
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
