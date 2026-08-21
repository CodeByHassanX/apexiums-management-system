"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandService = void 0;
const db_1 = __importDefault(require("../config/db"));
class BrandService {
    static async getAll() {
        return await db_1.default.brand.findMany();
    }
    static async getById(id) {
        const brand = await db_1.default.brand.findUnique({ where: { id } });
        if (!brand)
            throw { statusCode: 404, message: 'Brand not found' };
        return brand;
    }
    static async create(data) {
        return await db_1.default.brand.create({ data });
    }
    static async update(id, data) {
        return await db_1.default.brand.update({
            where: { id },
            data
        });
    }
    static async delete(id) {
        const productCount = await db_1.default.product.count({ where: { brandId: id } });
        if (productCount > 0) {
            throw { statusCode: 400, message: 'Cannot delete brand with associated products' };
        }
        return await db_1.default.brand.delete({ where: { id } });
    }
}
exports.BrandService = BrandService;
//# sourceMappingURL=brand.service.js.map