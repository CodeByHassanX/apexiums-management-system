// @ts-nocheck
import { Request, Response, NextFunction, Router } from 'express';
import prisma from '../config/db';
import { authenticate, AuthRequest, requirePermission } from '../middleware/auth.middleware';
import bcrypt from 'bcryptjs';

const router = Router();

// Get all staff (users)
router.get('/', authenticate, requirePermission('staff.view'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const whereClause: any = {};
    if (req.user?.role !== 'SUPER_ADMIN' && req.user?.storeId) {
      whereClause.storeId = req.user.storeId;
    }

    const staff = await prisma.user.findMany({
      where: whereClause,
      select: { id: true, name: true, email: true, status: true, role: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: staff });
  } catch (error) { next(error); }
});

// Create new staff
router.post('/', authenticate, requirePermission('staff.create'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, roleId } = req.body;
    
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name, email, password: hashedPassword, roleId,
        storeId: req.user?.role !== 'SUPER_ADMIN' ? req.user?.storeId : undefined
      },
      select: { id: true, name: true, email: true }
    });
    res.status(201).json({ success: true, data: user });
  } catch (error) { next(error); }
});

// Get all roles and permissions
router.get('/roles', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roles = await prisma.role.findMany({
      include: { permissions: { include: { permission: true } } }
    });
    res.json({ success: true, data: roles });
  } catch (error) { next(error); }
});

// Get all available permissions
router.get('/permissions', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const permissions = await prisma.permission.findMany();
    res.json({ success: true, data: permissions });
  } catch (error) { next(error); }
});

// Update role permissions
router.put('/roles/:id', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { permissionIds } = req.body; 
    const roleId = req.params.id;

    if (req.user?.role !== 'SUPER_ADMIN' && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Only Admins can edit roles' });
    }

    await prisma.rolePermission.deleteMany({ where: { roleId } });
    
    if (permissionIds && permissionIds.length > 0) {
      const inserts = permissionIds.map((pid: string) => ({ roleId, permissionId: pid }));
      await prisma.rolePermission.createMany({ data: inserts });
    }
    res.json({ success: true, message: 'Role permissions updated successfully' });
  } catch (error) { next(error); }
});

// Update staff password
router.put('/:id/password', authenticate, requirePermission('staff.update'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const userToUpdate = await prisma.user.findUnique({ 
      where: { id: req.params.id }, include: { role: true }
    });
    
    if (!userToUpdate) return res.status(404).json({ success: false, message: 'User not found' });

    if (req.user?.role === 'SUPER_ADMIN') {
      if (userToUpdate.role.name !== 'ADMIN') return res.status(403).json({ success: false, message: 'Super Admin can only update Store Admin passwords' });
    } else {
      if (userToUpdate.storeId !== req.user?.storeId) return res.status(403).json({ success: false, message: 'Forbidden' });
      if (userToUpdate.role.name === 'SUPER_ADMIN') return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    await prisma.user.update({
      where: { id: req.params.id },
      data: { password: hashedPassword }
    });
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) { next(error); }
});

// Update staff details
router.put('/:id', authenticate, requirePermission('staff.update'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, email, roleId, status } = req.body;
    
    const userToUpdate = await prisma.user.findUnique({ where: { id: req.params.id }, include: { role: true } });
    if (!userToUpdate || (req.user?.role !== 'SUPER_ADMIN' && userToUpdate.storeId !== req.user?.storeId)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    if (req.user?.role === 'SUPER_ADMIN' && userToUpdate.role.name !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Super Admin can only update Store Admins' });
    }
    if (req.user?.role !== 'SUPER_ADMIN' && userToUpdate.role.name === 'SUPER_ADMIN') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: { name, email, roleId, status }
    });
    res.json({ success: true, message: 'Staff updated successfully', data: updatedUser });
  } catch (error) { next(error); }
});

export default router;

