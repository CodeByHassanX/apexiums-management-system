"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Everyone who is authenticated can see the dashboard for now
router.get('/stats', auth_middleware_1.authenticate, dashboard_controller_1.DashboardController.getDashboardData);
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map