"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pos_controller_1 = require("../controllers/pos.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/checkout', auth_middleware_1.authenticate, (0, auth_middleware_1.requirePermission)('sales.create'), pos_controller_1.POSController.checkout);
exports.default = router;
//# sourceMappingURL=pos.routes.js.map