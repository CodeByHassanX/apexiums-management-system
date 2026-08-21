// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';
import { createCategorySchema, updateCategorySchema } from '../validators/catalog.validator';

export class CategoryController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await CategoryService.getAll();
      res.json({ success: true, data: categories });
    } catch (error) { next(error); }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await CategoryService.getById(req.params.id);
      res.json({ success: true, data: category });
    } catch (error) { next(error); }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createCategorySchema.parse(req.body);
      const category = await CategoryService.create(data);
      res.status(201).json({ success: true, data: category });
    } catch (error) { next(error); }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateCategorySchema.parse(req.body);
      const category = await CategoryService.update(req.params.id, data);
      res.json({ success: true, data: category });
    } catch (error) { next(error); }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await CategoryService.delete(req.params.id);
      res.json({ success: true, message: 'Category deleted' });
    } catch (error) { next(error); }
  }
}

