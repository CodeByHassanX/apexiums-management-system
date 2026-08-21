"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_service_1 = require("../services/product.service");
const catalog_validator_1 = require("../validators/catalog.validator");
class ProductController {
    static async getAll(req, res, next) {
        try {
            const result = await product_service_1.ProductService.getAll(req.query);
            res.json({ success: true, ...result });
        }
        catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        try {
            const product = await product_service_1.ProductService.getById(req.params.id);
            res.json({ success: true, data: product });
        }
        catch (error) {
            next(error);
        }
    }
    static async create(req, res, next) {
        try {
            const data = catalog_validator_1.createProductSchema.parse(req.body);
            const product = await product_service_1.ProductService.create(data);
            res.status(201).json({ success: true, data: product });
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const data = catalog_validator_1.updateProductSchema.parse(req.body);
            const product = await product_service_1.ProductService.update(req.params.id, data);
            res.json({ success: true, data: product });
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            await product_service_1.ProductService.delete(req.params.id);
            res.json({ success: true, message: 'Product deleted' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=product.controller.js.map