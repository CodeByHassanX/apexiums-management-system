"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseService = void 0;
const db_1 = __importDefault(require("../config/db"));
class PurchaseService {
    static async createPurchase(data) {
        return await db_1.default.$transaction(async (tx) => {
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
                }
                else {
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
exports.PurchaseService = PurchaseService;
//# sourceMappingURL=purchase.service.js.map