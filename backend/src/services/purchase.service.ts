import prisma from '../config/db';

export class PurchaseService {
  static async createPurchase(data: {
    supplierId: string;
    branchId: string;
    storeId?: string;
    userId: string;
    totalAmount: number;
    items: { productId: string; quantity: number; costPrice: number }[];
  }) {
    return await prisma.$transaction(async (tx) => {
      // 1. Create Purchase Record
      const purchase = await tx.purchase.create({
        data: {
          supplierId: data.supplierId,
          status: "RECEIVED",
          totalAmount: data.totalAmount,
          storeId: data.storeId,
          items: {
            create: data.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              costPrice: item.costPrice
            }))
          }
        }
      });

      // 2. Update Inventory for each item
      for (const item of data.items) {
        // Upsert inventory record
        const inventory = await tx.inventory.findUnique({
          where: {
            productId_branchId: { productId: item.productId, branchId: data.branchId }
          }
        });

        if (inventory) {
          await tx.inventory.update({
            where: { id: inventory.id },
            data: { quantity: { increment: item.quantity } }
          });
        } else {
          await tx.inventory.create({
            data: {
              productId: item.productId,
              branchId: data.branchId,
              quantity: item.quantity
            }
          });
        }

        // 3. Create Inventory Transaction Log
        await tx.inventoryTransaction.create({
          data: {
            productId: item.productId,
            userId: data.userId,
            type: 'PURCHASE',
            quantity: item.quantity,
            referenceId: purchase.id
          }
        });
      }

      return purchase;
    });
  }
}
