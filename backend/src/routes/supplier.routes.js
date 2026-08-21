"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../config/db"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Get all suppliers
router.get('/', auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        const whereClause = {};
        if (req.user?.role !== 'SUPER_ADMIN' && req.user?.storeId) {
            whereClause.storeId = req.user.storeId;
        }
        const suppliers = await db_1.default.supplier.findMany({
            where: whereClause,
            orderBy: { name: 'asc' },
            include: {
                _count: { select: { purchases: true } }
            }
        });
        res.json({ success: true, data: suppliers });
    }
    catch (error) {
        next(error);
    }
});
// Create supplier
router.post('/', auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        const { name, company, phone, email, address } = req.body;
        const supplier = await db_1.default.supplier.create({
            data: {
                name, company, phone, email, address,
                storeId: req.user?.role !== 'SUPER_ADMIN' ? req.user?.storeId : undefined
            }
        });
        res.status(201).json({ success: true, data: supplier });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=supplier.routes.js.map