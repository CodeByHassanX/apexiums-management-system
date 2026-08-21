"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const db_1 = __importDefault(require("../config/db"));
class ProductService {
    static async getAll(params = {}) {
        const { search, categoryId, brandId, status, page = 1, limit = 10 } = params;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } },
                { barcode: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (categoryId)
            where.categoryId = categoryId;
        if (brandId)
            where.brandId = brandId;
        if (status)
            where.status = status;
        const skip = (Number(page) - 1) * Number(limit);
        const [products, total] = await Promise.all([
            db_1.default.product.findMany({
                where,
                include: { category: true, brand: true, inventory: true },
                skip,
                take: Number(limit),
                orderBy: { createdAt: 'desc' }
            }),
            db_1.default.product.count({ where })
        ]);
        return {
            products,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        };
    }
    static async getById(id) {
        const product = await db_1.default.product.findUnique({
            where: { id },
            include: { category: true, brand: true, inventory: { include: { branch: true } } }
        });
        if (!product)
            throw { statusCode: 404, message: 'Product not found' };
        return product;
    }
    static async create(data) {
        // Check SKU uniqueness
        const existingSku = await db_1.default.product.findUnique({ where: { sku: data.sku } });
        if (existingSku)
            throw { statusCode: 400, message: 'SKU already exists' };
        return await db_1.default.product.create({ data });
    }
    static async update(id, data) {
        if (data.sku) {
            const existingSku = await db_1.default.product.findFirst({ where: { sku: data.sku, NOT: { id } } });
            if (existingSku)
                throw { statusCode: 400, message: 'SKU already exists' };
        }
        return await db_1.default.product.update({
            where: { id },
            data
        });
    }
    static async delete(id) {
        // Should verify if product is used in Sales or Purchases before deleting, or just mark inactive
        const salesCount = await db_1.default.saleItem.count({ where: { productId: id } });
        if (salesCount > 0) {
            // Soft delete instead
            return await db_1.default.product.update({
                where: { id },
                data: { status: 'INACTIVE' }
            });
        }
        return await db_1.default.product.delete({ where: { id } });
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map