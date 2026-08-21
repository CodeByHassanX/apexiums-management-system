import prisma from '../config/db';

export class BrandService {
  static async getAll() {
    return await prisma.brand.findMany();
  }

  static async getById(id: string) {
    const brand = await prisma.brand.findUnique({ where: { id } });
    if (!brand) throw { statusCode: 404, message: 'Brand not found' };
    return brand;
  }

  static async create(data: { name: string }) {
    return await prisma.brand.create({ data });
  }

  static async update(id: string, data: { name?: string }) {
    return await prisma.brand.update({
      where: { id },
      data
    });
  }

  static async delete(id: string) {
    const productCount = await prisma.product.count({ where: { brandId: id } });
    if (productCount > 0) {
      throw { statusCode: 400, message: 'Cannot delete brand with associated products' };
    }
    return await prisma.brand.delete({ where: { id } });
  }
}
