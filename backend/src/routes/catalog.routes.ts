import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { BrandController } from '../controllers/brand.controller';
import { ProductController } from '../controllers/product.controller';
import { authenticate, requirePermission } from '../middleware/auth.middleware';

const router = Router();

// Categories
router.get('/categories', authenticate, CategoryController.getAll);
router.get('/categories/:id', authenticate, CategoryController.getById);
router.post('/categories', authenticate, requirePermission('products.create'), CategoryController.create);
router.put('/categories/:id', authenticate, requirePermission('products.update'), CategoryController.update);
router.delete('/categories/:id', authenticate, requirePermission('products.delete'), CategoryController.delete);

// Brands
router.get('/brands', authenticate, BrandController.getAll);
router.get('/brands/:id', authenticate, BrandController.getById);
router.post('/brands', authenticate, requirePermission('products.create'), BrandController.create);
router.put('/brands/:id', authenticate, requirePermission('products.update'), BrandController.update);
router.delete('/brands/:id', authenticate, requirePermission('products.delete'), BrandController.delete);

// Products
router.get('/products', authenticate, requirePermission('products.view'), ProductController.getAll);
router.get('/products/:id', authenticate, requirePermission('products.view'), ProductController.getById);
router.post('/products', authenticate, requirePermission('products.create'), ProductController.create);
router.put('/products/:id', authenticate, requirePermission('products.update'), ProductController.update);
router.delete('/products/:id', authenticate, requirePermission('products.delete'), ProductController.delete);

export default router;
