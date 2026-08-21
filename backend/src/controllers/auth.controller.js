"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const express_1 = require("express");
const auth_service_1 = require("../services/auth.service");
const auth_validator_1 = require("../validators/auth.validator");
const auth_middleware_1 = require("../middleware/auth.middleware");
class AuthController {
    static async login(req, res, next) {
        try {
            const data = auth_validator_1.loginSchema.parse(req.body);
            const result = await auth_service_1.AuthService.login(data.email, data.password);
            res.json({
                success: true,
                message: 'Login successful',
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async refresh(req, res, next) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(400).json({ success: false, message: 'Refresh token is required' });
            }
            const result = await auth_service_1.AuthService.refresh(refreshToken);
            res.json({
                success: true,
                message: 'Token refreshed',
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async logout(req, res, next) {
        try {
            if (req.user) {
                await auth_service_1.AuthService.logout(req.user.userId);
            }
            res.json({ success: true, message: 'Logged out successfully' });
        }
        catch (error) {
            next(error);
        }
    }
    static async me(req, res, next) {
        try {
            if (!req.user)
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            const profile = await auth_service_1.AuthService.getProfile(req.user.userId);
            res.json({ success: true, data: profile });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map