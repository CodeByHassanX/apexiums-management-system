import prisma from '../config/db';

export class InventoryService {
  /**
   * Get current stock for all products or a specific branch/product
   */
  static async getStock(filters: { branchId?: string, productId?: string, lowStock?: boolean }) {
    const where: any = {};
    if (filters.branchId) where.branchId = filters.branchId;
    if (filters.productId) where.productId = filters.productId;
    
    let inventory = await prisma.inventory.findMany({
      where,
      include: {
        product: { select: { id: true, name: true, sku: true, minimumStock: true } },
        branch: { select: { id: true, name: true } }
      }
    });

    if (filters.lowStock) {
      inventory = inventory.filter(inv => inv.quantity <= inv.product.minimumStock);
    }

    return inventory;
  }

  /**
   * Get audit trail of stock movements
   */
  static async getMovements(filters: { productId?: string, type?: string }) {
    const where: any = {};
    if (filters.productId) where.productId = filters.productId;
    if (filters.type) where.type = filters.type;

    return await prisma.inventoryTransaction.findMany({
      where,
      include: {
        product: { select: { name: true, sku: true } },
        user: { select: { name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 100 // pagination could be added here
    });
  }

  /**
   * Adjust stock atomically
   */
  static async adjustStock(data: {
    productId: string;
    branchId: string;
    quantity: number;
    type: string;
    reason?: string;
    referenceId?: string;
    userId: string;
  }) {
    if (data.quantity === 0) throw { statusCode: 400, message: 'Quantity cannot be zero' };

    return await prisma.$transaction(async (tx) => {
      // 1. Get or create current inventory record
      let inventory = await tx.inventory.findUnique({
        where: {
          productId_branchId: { productId: data.productId, branchId: data.branchId }
        }
      });

      if (!inventory) {
        inventory = await tx.inventory.create({
          data: {
            productId: data.productId,
            branchId: data.branchId,
            quantity: 0
          }
        });
      }

      const newQuantity = inventory.quantity + data.quantity;

      // Prevent negative stock unless configured otherwise (hardcoded prevention here)
      if (newQuantity < 0) {
        throw { statusCode: 400, message: `Insufficient stock. Available: ${inventory.quantity}` };
      }

      // 2. Update inventory quantity
      const updatedInventory = await tx.inventory.update({
        where: { id: inventory.id },
        data: { quantity: newQuantity }
      });

      // 3. Create audit transaction
      const transaction = await tx.inventoryTransaction.create({
        data: {
          productId: data.productId,
          type: data.type,
          quantity: data.quantity,
          reason: data.reason,
          referenceId: data.referenceId,
          userId: data.userId
        }
      });

      return { inventory: updatedInventory, transaction };
    });
  }
}
