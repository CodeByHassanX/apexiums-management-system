"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.createProductSchema = exports.updateBrandSchema = exports.createBrandSchema = exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    description: zod_1.z.string().optional(),
    parentId: zod_1.z.string().uuid().optional(),
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE']).optional(),
});
exports.updateCategorySchema = exports.createCategorySchema.partial();
exports.createBrandSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
});
exports.updateBrandSchema = exports.createBrandSchema.partial();
exports.createProductSchema = zod_1.z.object({
    sku: zod_1.z.string().min(2, 'SKU is required'),
    barcode: zod_1.z.string().optional(),
    name: zod_1.z.string().min(2, 'Name is required'),
    description: zod_1.z.string().optional(),
    categoryId: zod_1.z.string().uuid('Invalid Category ID'),
    brandId: zod_1.z.string().uuid('Invalid Brand ID').optional(),
    unit: zod_1.z.string().default('pcs'),
    costPrice: zod_1.z.number().min(0, 'Cost price must be positive'),
    sellingPrice: zod_1.z.number().min(0, 'Selling price must be positive'),
    discount: zod_1.z.number().min(0).default(0),
    tax: zod_1.z.number().min(0).default(0),
    minimumStock: zod_1.z.number().int().min(0).default(0),
    maximumStock: zod_1.z.number().int().optional(),
    image: zod_1.z.string().url('Must be a valid URL').optional().or(zod_1.z.literal('')),
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});
exports.updateProductSchema = exports.createProductSchema.partial();
//# sourceMappingURL=catalog.validator.js.map