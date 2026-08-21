"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const db_1 = __importDefault(require("../config/db"));
const redis_1 = __importDefault(require("../config/redis"));
const hash_1 = require("../utils/hash");
const jwt_1 = require("../utils/jwt");
class AuthService {
    static async login(email, password) {
        const user = await db_1.default.user.findUnique({
            where: { email },
            include: { role: true }
        });
        if (!user || user.status !== 'ACTIVE') {
            throw { statusCode: 401, message: 'Invalid credentials or inactive account' };
        }
        const isMatch = await (0, hash_1.comparePassword)(password, user.password);
        if (!isMatch) {
            throw { statusCode: 401, message: 'Invalid credentials' };
        }
        await db_1.default.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });
        const accessToken = (0, jwt_1.generateAccessToken)(user.id, user.role.name, user.storeId);
        const refreshToken = (0, jwt_1.generateRefreshToken)(user.id);
        // Store refresh token in Redis (7 days TTL)
        await redis_1.default.set(`refresh_token:${user.id}`, refreshToken, 'EX', 7 * 24 * 60 * 60);
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
    static async refresh(token) {
        try {
            const decoded = (0, jwt_1.verifyRefreshToken)(token);
            const storedToken = await redis_1.default.get(`refresh_token:${decoded.userId}`);
            if (storedToken !== token) {
                throw new Error('Invalid refresh token');
            }
            const user = await db_1.default.user.findUnique({
                where: { id: decoded.userId },
                include: { role: true }
            });
            if (!user || user.status !== 'ACTIVE') {
                throw new Error('User not found or inactive');
            }
            const newAccessToken = (0, jwt_1.generateAccessToken)(user.id, user.role.name, user.storeId);
            const newRefreshToken = (0, jwt_1.generateRefreshToken)(user.id);
            await redis_1.default.set(`refresh_token:${user.id}`, newRefreshToken, 'EX', 7 * 24 * 60 * 60);
            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        }
        catch (error) {
            throw { statusCode: 401, message: 'Invalid or expired refresh token' };
        }
    }
    static async logout(userId) {
        await redis_1.default.del(`refresh_token:${userId}`);
    }
    static async getProfile(userId) {
        const user = await db_1.default.user.findUnique({
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
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map