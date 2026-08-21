"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POSController = void 0;
const pos_service_1 = require("../services/pos.service");
class POSController {
    static async checkout(req, res, next) {
        try {
            const { branchId, items, paymentMethod, customerId, discountAmount, taxAmount } = req.body;
            const sale = await pos_service_1.POSService.checkout({
                userId: req.user.userId,
                branchId,
                storeId: req.user.storeId,
                customerId,
                items,
                paymentMethod,
                discountAmount,
                taxAmount
            });
            res.status(201).json({
                success: true,
                message: 'Checkout successful',
                data: sale
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.POSController = POSController;
//# sourceMappingURL=pos.controller.js.map