"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../config/db"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = (0, express_1.Router)();
// Get all staff (users)
router.get('/', auth_middleware_1.authenticate, (0, auth_middleware_1.requirePermission)('staff.view'), async (req, res, next) => {
    try {
        const whereClause = {};
        if (req.user?.role !== 'SUPER_ADMIN' && req.user?.storeId) {
            whereClause.storeId = req.user.storeId;
        }
        const staff = await db_1.default.user.findMany({
            where: whereClause,
            select: { id: true, name: true, email: true, status: true, role: { select: { id: true, name: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: staff });
    }
    catch (error) {
        next(error);
    }
});
// Create new staff
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.requirePermission)('staff.create'), async (req, res, next) => {
    try {
        const { name, email, password, roleId } = req.body;
        const existing = await db_1.default.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const user = await db_1.default.user.create({
            data: {
                name, email, password: hashedPassword, roleId,
                storeId: req.user?.role !== 'SUPER_ADMIN' ? req.user?.storeId : undefined
            },
            select: { id: true, name: true, email: true }
        });
        res.status(201).json({ success: true, data: user });
    }
    catch (error) {
        next(error);
    }
});
// Get all roles and permissions
router.get('/roles', auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        const roles = await db_1.default.role.findMany({
            include: { permissions: { include: { permission: true } } }
        });
        res.json({ success: true, data: roles });
    }
    catch (error) {
        next(error);
    }
});
// Get all available permissions
router.get('/permissions', auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        const permissions = await db_1.default.permission.findMany();
        res.json({ success: true, data: permissions });
    }
    catch (error) {
        next(error);
    }
});
// Update role permissions
router.put('/roles/:id', auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        const { permissionIds } = req.body;
        const roleId = req.params.id;
        if (req.user?.role !== 'SUPER_ADMIN' && req.user?.role !== 'ADMIN') {
            return res.status(403).json({ success: false, message: 'Only Admins can edit roles' });
        }
        await db_1.default.rolePermission.deleteMany({ where: { roleId } });
        if (permissionIds && permissionIds.length > 0) {
            const inserts = permissionIds.map((pid) => ({ roleId, permissionId: pid }));
            await db_1.default.rolePermission.createMany({ data: inserts });
        }
        res.json({ success: true, message: 'Role permissions updated successfully' });
    }
    catch (error) {
        next(error);
    }
});
// Update staff password
router.put('/:id/password', auth_middleware_1.authenticate, (0, auth_middleware_1.requirePermission)('staff.update'), async (req, res, next) => {
    try {
        const { password } = req.body;
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const userToUpdate = await db_1.default.user.findUnique({
            where: { id: req.params.id }, include: { role: true }
        });
        if (!userToUpdate)
            return res.status(404).json({ success: false, message: 'User not found' });
        if (req.user?.role === 'SUPER_ADMIN') {
            if (userToUpdate.role.name !== 'ADMIN')
                return res.status(403).json({ success: false, message: 'Super Admin can only update Store Admin passwords' });
        }
        else {
            if (userToUpdate.storeId !== req.user?.storeId)
                return res.status(403).json({ success: false, message: 'Forbidden' });
            if (userToUpdate.role.name === 'SUPER_ADMIN')
                return res.status(403).json({ success: false, message: 'Forbidden' });
        }
        await db_1.default.user.update({
            where: { id: req.params.id },
            data: { password: hashedPassword }
        });
        res.json({ success: true, message: 'Password updated successfully' });
    }
    catch (error) {
        next(error);
    }
});
// Update staff details
router.put('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.requirePermission)('staff.update'), async (req, res, next) => {
    try {
        const { name, email, roleId, status } = req.body;
        const userToUpdate = await db_1.default.user.findUnique({ where: { id: req.params.id }, include: { role: true } });
        if (!userToUpdate || (req.user?.role !== 'SUPER_ADMIN' && userToUpdate.storeId !== req.user?.storeId)) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }
        if (req.user?.role === 'SUPER_ADMIN' && userToUpdate.role.name !== 'ADMIN') {
            return res.status(403).json({ success: false, message: 'Super Admin can only update Store Admins' });
        }
        if (req.user?.role !== 'SUPER_ADMIN' && userToUpdate.role.name === 'SUPER_ADMIN') {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }
        const updatedUser = await db_1.default.user.update({
            where: { id: req.params.id },
            data: { name, email, roleId, status }
        });
        res.json({ success: true, message: 'Staff updated successfully', data: updatedUser });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=staff.routes.js.map