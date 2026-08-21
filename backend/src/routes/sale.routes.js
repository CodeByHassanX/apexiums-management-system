"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../config/db"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Get all sales (Orders History)
router.get('/', auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        const whereClause = {};
        if (req.user?.role !== 'SUPER_ADMIN' && req.user?.storeId) {
            whereClause.storeId = req.user.storeId;
        }
        const sales = await db_1.default.sale.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            include: {
                customer: true,
                user: { select: { name: true } },
                items: {
                    include: { product: { select: { name: true, sku: true } } }
                }
            }
        });
        res.json({ success: true, data: sales });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=sale.routes.js.map