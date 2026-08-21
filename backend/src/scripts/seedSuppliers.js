"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    await prisma.supplier.createMany({
        data: [
            { name: 'Acme Corp', company: 'Acme Corporation', phone: '1-800-555-0199', email: 'sales@acme.com', address: '100 Factory Rd', openingBalance: 0 },
            { name: 'Globex', company: 'Globex Inc', phone: '1-800-555-0200', email: 'supply@globex.com', address: '200 Global Way', openingBalance: 1200 },
            { name: 'Initech', company: 'Initech LLC', phone: '1-800-555-0201', email: 'orders@initech.com', address: '300 Tech Park', openingBalance: 500 }
        ],
        skipDuplicates: true
    });
    console.log("Dummy suppliers added!");
}
main().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=seedSuppliers.js.map