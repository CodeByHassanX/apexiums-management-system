import prisma from '../config/db';

export class FinanceService {
  static async getRevenueStats(storeId?: string) {
    const whereStore = storeId ? { storeId } : {};

    const totalSales = await prisma.sale.aggregate({
      _sum: { totalAmount: true, taxAmount: true, discountAmount: true },
      where: { status: 'COMPLETED', ...whereStore }
    });

    const totalPurchases = await prisma.purchase.aggregate({
      _sum: { totalAmount: true },
      where: { status: { in: ['RECEIVED', 'PAID'] }, ...whereStore }
    });

    const totalExpenses = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: whereStore
    });

    const revenue = Number(totalSales._sum.totalAmount || 0);
    const cogs = Number(totalPurchases._sum.totalAmount || 0); // Cost of goods sold roughly
    const expenses = Number(totalExpenses._sum.amount || 0);
    const netProfit = revenue - cogs - expenses;

    // Recent Payments
    const recentPayments = await prisma.payment.findMany({
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

  static async getDebtStats(storeId?: string) {
    const whereStore = storeId ? { storeId } : {};

    // Customers with positive openingBalance are considered in debt to us
    const customerDebts = await prisma.customer.findMany({
      where: { openingBalance: { gt: 0 }, ...whereStore },
      orderBy: { openingBalance: 'desc' }
    });

    // Suppliers with positive openingBalance means we owe them
    const supplierDebts = await prisma.supplier.findMany({
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
