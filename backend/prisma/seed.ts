import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const defaultPermissions = [
  'products.view', 'products.create', 'products.update', 'products.delete',
  'inventory.view', 'inventory.adjust', 'inventory.transfer',
  'sales.view', 'sales.create', 'sales.update', 'sales.delete', 'sales.refund',
  'purchases.view', 'purchases.create', 'purchases.update', 'purchases.delete',
  'staff.view', 'staff.create', 'staff.update', 'staff.delete',
  'finance.view', 'finance.create', 'finance.update', 'finance.delete',
  'reports.view'
];

async function main() {
  console.log('Seeding database...');

  // 1. Create Permissions
  const createdPermissions = await Promise.all(
    defaultPermissions.map(action =>
      prisma.permission.upsert({
        where: { action },
        update: {},
        create: { action },
      })
    )
  );

  // 2. Create Roles
  const roles = [
    { name: 'SUPER_ADMIN', desc: 'Full system access' },
    { name: 'ADMIN', desc: 'Almost full access' },
    { name: 'MANAGER', desc: 'Managerial access' },
    { name: 'CASHIER', desc: 'POS operations' },
    { name: 'INVENTORY_MANAGER', desc: 'Inventory operations' },
    { name: 'ACCOUNTANT', desc: 'Finance operations' }
  ];

  for (const r of roles) {
    await prisma.role.upsert({
      where: { name: r.name },
      update: {},
      create: { name: r.name, description: r.desc }
    });
  }

  // 3. Assign Permissions
  const managerRole = await prisma.role.findUnique({ where: { name: 'MANAGER' } });
  if (managerRole) {
    const managerPerms = ['products.view', 'sales.view', 'reports.view'];
    for (const p of managerPerms) {
      const perm = createdPermissions.find(cp => cp.action === p);
      if (perm) {
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: managerRole.id, permissionId: perm.id } },
          update: {},
          create: { roleId: managerRole.id, permissionId: perm.id }
        });
      }
    }
  }

  const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
  if (adminRole) {
    for (const perm of createdPermissions) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: adminRole.id, permissionId: perm.id } },
        update: {},
        create: { roleId: adminRole.id, permissionId: perm.id }
      });
    }
  }

  // 4. Create Default Users
  const superAdminRole = await prisma.role.findUnique({ where: { name: 'SUPER_ADMIN' } });
  if (superAdminRole) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        name: 'Super Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        roleId: superAdminRole.id
      }
    });

    const hashedManagerPwd = await bcrypt.hash('manager123', 10);
    await prisma.user.upsert({
      where: { email: 'manager@example.com' },
      update: {},
      create: {
        name: 'Store Manager',
        email: 'manager@example.com',
        password: hashedManagerPwd,
        roleId: managerRole!.id
      }
    });
  }

  // 5. Create Default Store and Branch
  let store = await prisma.store.findFirst();
  if (!store) {
    store = await prisma.store.create({
      data: { name: 'Main Retail Store' }
    });
  }

  let branch = await prisma.branch.findFirst();
  if (!branch) {
    branch = await prisma.branch.create({
      data: {
        name: 'Headquarters',
        address: '123 Main St',
        storeId: store.id
      }
    });
  }

  // 6. Dummy Categories
  const catNames = ['Electronics', 'Clothing', 'Groceries', 'Home & Kitchen'];
  const categories: any[] = [];
  for (const name of catNames) {
    let cat = await prisma.category.findFirst({ where: { name } });
    if (!cat) {
      cat = await prisma.category.create({ data: { name, description: `All ${name} items` } });
    }
    categories.push(cat);
  }

  // 7. Dummy Brands
  const brandNames = ['Sony', 'Nike', 'Nestle', 'Philips', 'Apple'];
  const brands: any[] = [];
  for (const name of brandNames) {
    let brand = await prisma.brand.findFirst({ where: { name } });
    if (!brand) {
      brand = await prisma.brand.create({ data: { name } });
    }
    brands.push(brand);
  }

  // 8. Dummy Products
  const dummyProducts = [
    { sku: 'SKU-001', name: 'PlayStation 5', catIndex: 0, brandIndex: 0, cost: 400, sell: 499.99, minStock: 5 },
    { sku: 'SKU-002', name: 'MacBook Pro 16"', catIndex: 0, brandIndex: 4, cost: 2000, sell: 2499.00, minStock: 2 },
    { sku: 'SKU-003', name: 'Air Force 1', catIndex: 1, brandIndex: 1, cost: 50, sell: 110.00, minStock: 15 },
    { sku: 'SKU-004', name: 'KitKat 4-Finger', catIndex: 2, brandIndex: 2, cost: 0.50, sell: 1.20, minStock: 50 },
    { sku: 'SKU-005', name: 'Air Fryer XXL', catIndex: 3, brandIndex: 3, cost: 80, sell: 150.00, minStock: 10 },
  ];

  for (const p of dummyProducts) {
    let prod = await prisma.product.findUnique({ where: { sku: p.sku } });
    if (!prod) {
      prod = await prisma.product.create({
        data: {
          sku: p.sku,
          name: p.name,
          categoryId: categories[p.catIndex].id,
          brandId: brands[p.brandIndex].id,
          costPrice: p.cost,
          sellingPrice: p.sell,
          minimumStock: p.minStock,
          image: `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=random`
        }
      });

      // 9. Initial Inventory for the new product
      if (branch) {
        await prisma.inventory.create({
          data: {
            productId: prod.id,
            branchId: branch.id,
            quantity: 50
          }
        });

        // The admin user made this
        const admin = await prisma.user.findFirst({ where: { email: 'admin@example.com' } });
        if (admin) {
          await prisma.inventoryTransaction.create({
            data: {
              productId: prod.id,
              type: 'INITIAL_STOCK',
              quantity: 50,
              reason: 'Initial system seed',
              userId: admin.id
            }
          });
        }
      }
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
