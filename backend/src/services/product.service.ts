import prisma from '../config/db';

export class ProductService {
  static async getAll(params: any = {}) {
    const { search, categoryId, brandId, status, page = 1, limit = 10 } = params;
    
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (categoryId) where.categoryId = categoryId;
    if (brandId) where.brandId = brandId;
    if (status) where.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, brand: true, inventory: true },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
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

  static async getById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, brand: true, inventory: { include: { branch: true } } }
    });
    if (!product) throw { statusCode: 404, message: 'Product not found' };
    return product;
  }

  static async create(data: any) {
    // Check SKU uniqueness
    const existingSku = await prisma.product.findUnique({ where: { sku: data.sku } });
    if (existingSku) throw { statusCode: 400, message: 'SKU already exists' };

    return await prisma.product.create({ data });
  }

  static async update(id: string, data: any) {
    if (data.sku) {
      const existingSku = await prisma.product.findFirst({ where: { sku: data.sku, NOT: { id } } });
      if (existingSku) throw { statusCode: 400, message: 'SKU already exists' };
    }
    return await prisma.product.update({
      where: { id },
      data
    });
  }

  static async delete(id: string) {
    // Should verify if product is used in Sales or Purchases before deleting, or just mark inactive
    const salesCount = await prisma.saleItem.count({ where: { productId: id } });
    if (salesCount > 0) {
      // Soft delete instead
      return await prisma.product.update({
        where: { id },
        data: { status: 'INACTIVE' }
      });
    }
    return await prisma.product.delete({ where: { id } });
  }
}
