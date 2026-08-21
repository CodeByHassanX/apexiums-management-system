import { Request, Response, NextFunction, Router } from 'express';
import prisma from '../config/db';
import bcrypt from 'bcryptjs';

const router = Router();

// Get all stores
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const storesData = await prisma.store.findMany({
      include: {
        users: {
          where: { role: { name: 'ADMIN' } }
        }
      },
      orderBy: { name: 'asc' }
    });

    const stores = storesData.map(s => ({
      id: s.id,
      name: s.name,
      owner: s.users[0]?.name || 'N/A',
      email: s.users[0]?.email || 'N/A',
      contactDetails: s.contactDetails || 'N/A',
      monthlyRent: s.monthlyRent || 0,
      status: s.status
    }));

    res.json({ success: true, data: stores });
  } catch (error) { next(error); }
});

// Create a new store (creates an ADMIN user)
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { name, owner, email, password, contactDetails, monthlyRent } = req.body;
    name = name?.trim();
    owner = owner?.trim();
    email = email?.trim().toLowerCase();
    password = password?.trim();
    
    let adminRole = await prisma.role.findFirst({ where: { name: 'ADMIN' } });
    
    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a store record
    const store = await prisma.store.create({
      data: { 
        name,
        contactDetails,
        monthlyRent: monthlyRent ? parseFloat(monthlyRent) : null
      }
    });

    const user = await prisma.user.create({
      data: {
        name: owner,
        email,
        password: hashedPassword,
        roleId: adminRole!.id,
        storeId: store.id
      }
    });

    res.status(201).json({ 
      success: true, 
      data: {
        id: store.id,
        name,
        owner: user.name,
        email: user.email,
        contactDetails: store.contactDetails,
        monthlyRent: store.monthlyRent,
        status: store.status
      } 
    });
  } catch (error) { next(error); }
});

// Toggle store status
router.put('/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedStore = await prisma.store.update({
      where: { id },
      data: { status }
    });
    res.json({ success: true, data: updatedStore });
  } catch (error) { next(error); }
});

export default router;