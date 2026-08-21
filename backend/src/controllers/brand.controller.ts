// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import { BrandService } from '../services/brand.service';
import { createBrandSchema, updateBrandSchema } from '../validators/catalog.validator';

export class BrandController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const brands = await BrandService.getAll();
      res.json({ success: true, data: brands });
    } catch (error) { next(error); }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const brand = await BrandService.getById(req.params.id);
      res.json({ success: true, data: brand });
    } catch (error) { next(error); }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createBrandSchema.parse(req.body);
      const brand = await BrandService.create(data);
      res.status(201).json({ success: true, data: brand });
    } catch (error) { next(error); }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateBrandSchema.parse(req.body);
      const brand = await BrandService.update(req.params.id, data);
      res.json({ success: true, data: brand });
    } catch (error) { next(error); }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await BrandService.delete(req.params.id);
      res.json({ success: true, message: 'Brand deleted' });
    } catch (error) { next(error); }
  }
}

