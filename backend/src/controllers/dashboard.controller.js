"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const dashboard_service_1 = require("../services/dashboard.service");
class DashboardController {
    static async getDashboardData(req, res, next) {
        try {
            // In a real app, you might pass branchId from query if filtering by branch
            const branchId = req.query.branchId;
            const storeId = req.user?.role !== 'SUPER_ADMIN' ? req.user?.storeId : undefined;
            const data = await dashboard_service_1.DashboardService.getStats(branchId, storeId);
            res.status(200).json({
                success: true,
                data
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.DashboardController = DashboardController;
//# sourceMappingURL=dashboard.controller.js.map