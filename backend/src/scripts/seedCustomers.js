"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    await prisma.customer.createMany({
        data: [
            { name: 'John Doe', phone: '+1 555-0100', email: 'john@example.com', address: '123 Main St, NY', creditLimit: 500 },
            { name: 'Sarah Connor', phone: '+1 555-0101', email: 'sarah@example.com', address: '456 Cyber Blvd, CA', creditLimit: 1000 },
            { name: 'Bruce Wayne', phone: '+1 555-0102', email: 'bruce@wayne.com', address: '1007 Mountain Drive, Gotham', creditLimit: 50000 },
            { name: 'Clark Kent', phone: '+1 555-0103', email: 'clark@dailyplanet.com', address: '344 Clinton St, Metropolis', creditLimit: 200 },
            { name: 'Diana Prince', phone: '+1 555-0104', email: 'diana@themyscira.com', address: '1 Paradise Island', creditLimit: 3000 }
        ],
        skipDuplicates: true
    });
    console.log("Dummy customers added!");
}
main().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=seedCustomers.js.map