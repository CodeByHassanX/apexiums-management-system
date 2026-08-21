"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandController = void 0;
const brand_service_1 = require("../services/brand.service");
const catalog_validator_1 = require("../validators/catalog.validator");
class BrandController {
    static async getAll(req, res, next) {
        try {
            const brands = await brand_service_1.BrandService.getAll();
            res.json({ success: true, data: brands });
        }
        catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        try {
            const brand = await brand_service_1.BrandService.getById(req.params.id);
            res.json({ success: true, data: brand });
        }
        catch (error) {
            next(error);
        }
    }
    static async create(req, res, next) {
        try {
            const data = catalog_validator_1.createBrandSchema.parse(req.body);
            const brand = await brand_service_1.BrandService.create(data);
            res.status(201).json({ success: true, data: brand });
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const data = catalog_validator_1.updateBrandSchema.parse(req.body);
            const brand = await brand_service_1.BrandService.update(req.params.id, data);
            res.json({ success: true, data: brand });
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            await brand_service_1.BrandService.delete(req.params.id);
            res.json({ success: true, message: 'Brand deleted' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.BrandController = BrandController;
//# sourceMappingURL=brand.controller.js.map