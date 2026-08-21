import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
  paymentMethod: string; // CASH, CARD
  discountAmount?: number;
  taxAmount?: number;
}

export class POSService {
  static async checkout(payload: CheckoutPayload) {
    const { userId, branchId, storeId, customerId, items, paymentMethod, discountAmount = 0, taxAmount = 0 } = payload;

    if (items.length === 0) throw new Error("Cart is empty");

    return await prisma.$transaction(async (tx) => {
      // 1. Calculate Total Amount
      let subtotal = 0;
      for (const item of items) {
        subtotal += (item.sellingPrice * item.quantity);
      }
      const totalAmount = subtotal + taxAmount - discountAmount;

      // 2. Create Sale Record
      const sale = await tx.sale.create({
        data: {
          userId,
          storeId,
          customerId,
          status: 'COMPLETED',
          totalAmount,
          taxAmount,
          discountAmount,
          items: {
            create: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              sellingPrice: item.sellingPrice
            }))
          },
          payments: {
            create: {
              method: paymentMethod,
              amount: totalAmount
            }
          }
        },
        include: { items: true, payments: true }
      });

      // 3. Deduct Inventory & Create Audit Trail
      for (const item of items) {
        // Find existing inventory
        const inventory = await tx.inventory.findUnique({
          where: {
            productId_branchId: { productId: item.productId, branchId }
          }
        });

        if (!inventory) {
          throw new Error(`Product ${item.productId} not found in this branch inventory.`);
        }
        if (inventory.quantity < item.quantity) {
          throw new Error(`Insufficient stock for Product ${item.productId}. Available: ${inventory.quantity}, Requested: ${item.quantity}`);
        }

        // Deduct
        await tx.inventory.update({
          where: { id: inventory.id },
          data: { quantity: { decrement: item.quantity } }
        });

        // Audit Trail
        await tx.inventoryTransaction.create({
          data: {
            productId: item.productId,
            type: 'SALE',
            quantity: -item.quantity, // Negative for deduction
            reason: `Sold in Sale #${sale.id}`,
            referenceId: sale.id,
            userId
          }
        });
      }

      return sale;
    });
  }
}
