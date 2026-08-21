"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryController = void 0;
const inventory_service_1 = require("../services/inventory.service");
const inventory_validator_1 = require("../validators/inventory.validator");
class InventoryController {
    static async getBranches(req, res, next) {
        try {
            const { PrismaClient } = require('@prisma/client');
            const prisma = new PrismaClient();
            const branches = await prisma.branch.findMany();
            res.json({ success: true, data: branches });
        }
        catch (error) {
            next(error);
        }
    }
    static async getStock(req, res, next) {
        try {
            const filters = {
                branchId: req.query.branchId,
                productId: req.query.productId,
                lowStock: req.query.lowStock === 'true'
            };
            const stock = await inventory_service_1.InventoryService.getStock(filters);
            res.json({ success: true, data: stock });
        }
        catch (error) {
            next(error);
        }
    }
    static async getMovements(req, res, next) {
        try {
            const filters = {
                productId: req.query.productId,
                type: req.query.type
            };
            const movements = await inventory_service_1.InventoryService.getMovements(filters);
            res.json({ success: true, data: movements });
        }
        catch (error) {
            next(error);
        }
    }
    static async adjustStock(req, res, next) {
        try {
            const data = inventory_validator_1.adjustStockSchema.parse(req.body);
            const userId = req.user.userId;
            const result = await inventory_service_1.InventoryService.adjustStock({
                ...data,
                userId
            });
            res.status(201).json({ success: true, message: 'Stock adjusted successfully', data: result });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.InventoryController = InventoryController;
//# sourceMappingURL=inventory.controller.js.map