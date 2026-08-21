"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../config/db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = (0, express_1.Router)();
// Get all stores
router.get('/', async (req, res, next) => {
    try {
        const storesData = await db_1.default.store.findMany({
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
            status: s.users[0]?.status || 'ACTIVE'
        }));
        res.json({ success: true, data: stores });
    }
    catch (error) {
        next(error);
    }
});
// Create a new store (creates an ADMIN user)
router.post('/', async (req, res, next) => {
    try {
        let { name, owner, email, password } = req.body;
        name = name?.trim();
        owner = owner?.trim();
        email = email?.trim().toLowerCase();
        password = password?.trim();
        let adminRole = await db_1.default.role.findFirst({ where: { name: 'ADMIN' } });
        // Check if user exists
        const existing = await db_1.default.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        // Create a store record
        const store = await db_1.default.store.create({
            data: { name }
        });
        const user = await db_1.default.user.create({
            data: {
                name: owner,
                email,
                password: hashedPassword,
                roleId: adminRole.id,
                storeId: store.id
            }
        });
        res.status(201).json({
            success: true,
            data: {
                id: user.id,
                name,
                owner: user.name,
                email: user.email,
                status: user.status
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=tenant.routes.js.map