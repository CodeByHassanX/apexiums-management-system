import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function reset() {
  const email = process.argv[2] || 'admin@example.com';
  const newPassword = process.argv[3] || 'admin123';

  console.log('Resetting password for: ' + email);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error('User not found!');
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword }
  });

  console.log('Successfully reset password to: ' + newPassword);
  process.exit(0);
}

reset().catch(console.error);
