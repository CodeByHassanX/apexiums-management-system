import prisma from '../config/db';
import redis from '../config/redis';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';

export class AuthService {
  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true, store: true }
    });

    if (!user || user.status !== 'ACTIVE') {
      throw { statusCode: 401, message: 'Invalid credentials or inactive account' };
    }

    if (user.store && user.store.status === 'INACTIVE') {
      throw { statusCode: 401, message: 'This store has been deactivated. Please contact the administrator.' };
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw { statusCode: 401, message: 'Invalid credentials' };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    const accessToken = generateAccessToken(user.id, user.role.name, user.storeId);
    const refreshToken = generateRefreshToken(user.id);

    // Store refresh token in Redis (7 days TTL)
    await redis.set(`refresh_token:${user.id}`, refreshToken, 'EX', 7 * 24 * 60 * 60);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name
      }
    };
  }

  static async refresh(token: string) {
    try {
      const decoded = verifyRefreshToken(token);
      const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

      if (storedToken !== token) {
        throw new Error('Invalid refresh token');
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { role: true }
      });

      if (!user || user.status !== 'ACTIVE') {
        throw new Error('User not found or inactive');
      }

      const newAccessToken = generateAccessToken(user.id, user.role.name, user.storeId);
      const newRefreshToken = generateRefreshToken(user.id);

      await redis.set(`refresh_token:${user.id}`, newRefreshToken, 'EX', 7 * 24 * 60 * 60);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw { statusCode: 401, message: 'Invalid or expired refresh token' };
    }
  }

  static async logout(userId: string) {
    await redis.del(`refresh_token:${userId}`);
  }

  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: true }
            }
          }
        }
      }
    });

    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }

    const { password, ...userWithoutPassword } = user;
    const permissions = user.role.permissions.map(rp => rp.permission.action);

    return {
      ...userWithoutPassword,
      permissions
    };
  }
}
