"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../config/db"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const purchase_service_1 = require("../services/purchase.service");
const router = (0, express_1.Router)();
// Get all purchases
router.get('/', auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        const whereClause = {};
        if (req.user?.role !== 'SUPER_ADMIN' && req.user?.storeId) {
            whereClause.storeId = req.user.storeId;
        }
        const purchases = await db_1.default.purchase.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            include: {
                supplier: { select: { name: true, company: true } },
                items: {
                    include: { product: { select: { name: true } } }
                }
            }
        });
        res.json({ success: true, data: purchases });
    }
    catch (error) {
        next(error);
    }
});
// Create purchase
router.post('/', auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        const { supplierId, branchId, totalAmount, items } = req.body;
        const storeId = req.user?.role !== 'SUPER_ADMIN' ? req.user?.storeId : undefined;
        const userId = req.user.userId;
        const purchase = await purchase_service_1.PurchaseService.createPurchase({ supplierId, branchId, storeId, userId, totalAmount, items });
        res.status(201).json({ success: true, data: purchase });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=purchase.routes.js.map