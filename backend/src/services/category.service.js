"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const db_1 = __importDefault(require("../config/db"));
class CategoryService {
    static async getAll() {
        return await db_1.default.category.findMany({
            include: { parent: true, children: true }
        });
    }
    static async getById(id) {
        const category = await db_1.default.category.findUnique({
            where: { id },
            include: { children: true }
        });
        if (!category)
            throw { statusCode: 404, message: 'Category not found' };
        return category;
    }
    static async create(data) {
        return await db_1.default.category.create({ data });
    }
    static async update(id, data) {
        return await db_1.default.category.update({
            where: { id },
            data
        });
    }
    static async delete(id) {
        // Basic check if it has products before deleting
        const productCount = await db_1.default.product.count({ where: { categoryId: id } });
        if (productCount > 0) {
            throw { statusCode: 400, message: 'Cannot delete category with associated products' };
        }
        return await db_1.default.category.delete({ where: { id } });
    }
}
exports.CategoryService = CategoryService;
//# sourceMappingURL=category.service.js.map