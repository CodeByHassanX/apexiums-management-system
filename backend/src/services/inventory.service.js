"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const db_1 = __importDefault(require("../config/db"));
class InventoryService {
    /**
     * Get current stock for all products or a specific branch/product
     */
    static async getStock(filters) {
        const where = {};
        if (filters.branchId)
            where.branchId = filters.branchId;
        if (filters.productId)
            where.productId = filters.productId;
        let inventory = await db_1.default.inventory.findMany({
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
    static async getMovements(filters) {
        const where = {};
        if (filters.productId)
            where.productId = filters.productId;
        if (filters.type)
            where.type = filters.type;
        return await db_1.default.inventoryTransaction.findMany({
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
    static async adjustStock(data) {
        if (data.quantity === 0)
            throw { statusCode: 400, message: 'Quantity cannot be zero' };
        return await db_1.default.$transaction(async (tx) => {
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
exports.InventoryService = InventoryService;
//# sourceMappingURL=inventory.service.js.map