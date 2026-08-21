"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inventory_controller_1 = require("../controllers/inventory.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get('/branches', auth_middleware_1.authenticate, inventory_controller_1.InventoryController.getBranches);
router.get('/stock', auth_middleware_1.authenticate, (0, auth_middleware_1.requirePermission)('inventory.view'), inventory_controller_1.InventoryController.getStock);
router.get('/movements', auth_middleware_1.authenticate, (0, auth_middleware_1.requirePermission)('inventory.view'), inventory_controller_1.InventoryController.getMovements);
router.post('/adjust', auth_middleware_1.authenticate, (0, auth_middleware_1.requirePermission)('inventory.adjust'), inventory_controller_1.InventoryController.adjustStock);
exports.default = router;
//# sourceMappingURL=inventory.routes.js.map