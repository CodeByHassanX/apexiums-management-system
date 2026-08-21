// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { createProductSchema, updateProductSchema } from '../validators/catalog.validator';

export class ProductController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProductService.getAll(req.query);
      res.json({ success: true, ...result });
    } catch (error) { next(error); }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.getById(req.params.id);
      res.json({ success: true, data: product });
    } catch (error) { next(error); }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createProductSchema.parse(req.body);
      const product = await ProductService.create(data);
      res.status(201).json({ success: true, data: product });
    } catch (error) { next(error); }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateProductSchema.parse(req.body);
      const product = await ProductService.update(req.params.id, data);
      res.json({ success: true, data: product });
    } catch (error) { next(error); }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await ProductService.delete(req.params.id);
      res.json({ success: true, message: 'Product deleted' });
    } catch (error) { next(error); }
  }
}

