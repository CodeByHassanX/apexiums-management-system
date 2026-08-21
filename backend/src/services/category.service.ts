import prisma from '../config/db';

export class CategoryService {
  static async getAll() {
    return await prisma.category.findMany({
      include: { parent: true, children: true }
    });
  }

  static async getById(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { children: true }
    });
    if (!category) throw { statusCode: 404, message: 'Category not found' };
    return category;
  }

  static async create(data: any) {
    return await prisma.category.create({ data });
  }

  static async update(id: string, data: any) {
    return await prisma.category.update({
      where: { id },
      data
    });
  }

  static async delete(id: string) {
    // Basic check if it has products before deleting
    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      throw { statusCode: 400, message: 'Cannot delete category with associated products' };
    }
    return await prisma.category.delete({ where: { id } });
  }
}
