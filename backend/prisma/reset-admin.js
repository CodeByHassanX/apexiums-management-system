"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function reset() {
    const email = process.argv[2] || 'admin@example.com';
    const newPassword = process.argv[3] || 'admin123';
    console.log('Resetting password for: ' + email);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        console.error('User not found!');
        process.exit(1);
    }
    const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
    await prisma.user.update({
        where: { email },
        data: { password: hashedPassword }
    });
    console.log('Successfully reset password to: ' + newPassword);
    process.exit(0);
}
reset().catch(console.error);
//# sourceMappingURL=reset-admin.js.map