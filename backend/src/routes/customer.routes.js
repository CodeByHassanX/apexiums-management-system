"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../config/db"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Get all customers
router.get('/', auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        const whereClause = {};
        if (req.user?.role !== 'SUPER_ADMIN' && req.user?.storeId) {
            whereClause.storeId = req.user.storeId;
        }
        const customers = await db_1.default.customer.findMany({
            where: whereClause,
            orderBy: { name: 'asc' },
            include: {
                _count: { select: { sales: true } }
            }
        });
        res.json({ success: true, data: customers });
    }
    catch (error) {
        next(error);
    }
});
// Create customer
router.post('/', auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        const { name, phone, email, address, openingBalance, creditLimit } = req.body;
        const customer = await db_1.default.customer.create({
            data: {
                name, phone, email, address, openingBalance: openingBalance || 0, creditLimit: creditLimit || 0,
                storeId: req.user?.role !== 'SUPER_ADMIN' ? req.user?.storeId : undefined
            }
        });
        res.status(201).json({ success: true, data: customer });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=customer.routes.js.map