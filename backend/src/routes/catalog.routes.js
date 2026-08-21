"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const brand_controller_1 = require("../controllers/brand.controller");
const product_controller_1 = require("../controllers/product.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Categories
router.get('/categories', auth_middleware_1.authenticate, category_controller_1.CategoryController.getAll);
router.get('/categories/:id', auth_middleware_1.authenticate, category_controller_1.CategoryController.getById);
router.post('/categories', auth_middleware_1.authenticate, (0, auth_middleware_1.requirePermission)('products.create'), category_controller_1.CategoryController.create);
router.put('/categories/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.requirePermission)('products.update'), category_controller_1.CategoryController.update);
router.delete('/categories/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.requirePermission)('products.delete'), category_controller_1.CategoryController.delete);
// Brands
router.get('/brands', auth_middleware_1.authenticate, brand_controller_1.BrandController.getAll);
router.get('/brands/:id', auth_middleware_1.authenticate, brand_controller_1.BrandController.getById);
router.post('/brands', auth_middleware_1.authenticate, (0, auth_middleware_1.requirePermission)('products.create'), brand_controller_1.BrandController.create);
router.put('/brands/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.requirePermission)('products.update'), brand_controller_1.BrandController.update);
router.delete('/brands/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.requirePermission)('products.delete'), brand_controller_1.BrandController.delete);
// Products
router.get('/products', auth_middleware_1.authenticate, (0, auth_middleware_1.requirePermission)('products.view'), product_controller_1.ProductController.getAll);
router.get('/products/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.requirePermission)('products.view'), product_controller_1.ProductController.getById);
router.post('/products', auth_middleware_1.authenticate, (0, auth_middleware_1.requirePermission)('products.create'), product_controller_1.ProductController.create);
router.put('/products/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.requirePermission)('products.update'), product_controller_1.ProductController.update);
router.delete('/products/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.requirePermission)('products.delete'), product_controller_1.ProductController.delete);
exports.default = router;
//# sourceMappingURL=catalog.routes.js.map