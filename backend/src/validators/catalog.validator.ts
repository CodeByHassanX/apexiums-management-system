import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  parentId: z.string().uuid().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const createBrandSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const updateBrandSchema = createBrandSchema.partial();

export const createProductSchema = z.object({
  sku: z.string().min(2, 'SKU is required'),
  barcode: z.string().optional(),
  name: z.string().min(2, 'Name is required'),
  description: z.string().optional(),
  categoryId: z.string().uuid('Invalid Category ID'),
  brandId: z.string().uuid('Invalid Brand ID').optional(),
  unit: z.string().default('pcs'),
  costPrice: z.number().min(0, 'Cost price must be positive'),
  sellingPrice: z.number().min(0, 'Selling price must be positive'),
  discount: z.number().min(0).default(0),
  tax: z.number().min(0).default(0),
  minimumStock: z.number().int().min(0).default(0),
  maximumStock: z.number().int().optional(),
  image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const updateProductSchema = createProductSchema.partial();
