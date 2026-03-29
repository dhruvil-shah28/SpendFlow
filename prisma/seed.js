const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Create Company
    const company = await prisma.company.create({
        data: {
            name: 'Odoo Innovators',
            currency: 'INR'
        }
    });

    // 2. Create Admin
    const admin = await prisma.user.create({
        data: {
            email: 'admin@odoo.com',
            password: hashedPassword,
            name: 'Super Admin',
            role: 'ADMIN',
            companyId: company.id
        }
    });

    // 3. Create Manager
    const manager = await prisma.user.create({
        data: {
            email: 'manager@odoo.com',
            password: hashedPassword,
            name: 'Team Lead',
            role: 'MANAGER',
            companyId: company.id
        }
    });

    // 4. Create Employee
    const employee = await prisma.user.create({
        data: {
            email: 'employee@odoo.com',
            password: hashedPassword,
            name: 'Developer John',
            role: 'EMPLOYEE',
            companyId: company.id,
            managerId: manager.id
        }
    });

    console.log('Seed data created!');
    console.log({
        admin: 'admin@odoo.com / password123',
        manager: 'manager@odoo.com / password123',
        employee: 'employee@odoo.com / password123'
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
