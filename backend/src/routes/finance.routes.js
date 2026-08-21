"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const finance_service_1 = require("../services/finance.service");
const router = (0, express_1.Router)();
// Get Revenue overview
router.get('/revenue', auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        const storeId = req.user?.role !== 'SUPER_ADMIN' ? req.user?.storeId : undefined;
        const data = await finance_service_1.FinanceService.getRevenueStats(storeId);
        res.json({ success: true, data });
    }
    catch (error) {
        next(error);
    }
});
// Get Debt overview
router.get('/debt', auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        const storeId = req.user?.role !== 'SUPER_ADMIN' ? req.user?.storeId : undefined;
        const data = await finance_service_1.FinanceService.getDebtStats(storeId);
        res.json({ success: true, data });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=finance.routes.js.map