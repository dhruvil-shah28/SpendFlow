import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth-utils';
import { cookies } from 'next/headers';

export async function POST(req) {
    try {
        const token = cookies().get('token')?.value;
        const decoded = verifyToken(token);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { amount, currency, category, description, date } = await req.json();

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            include: { manager: true }
        });

        const expense = await prisma.expense.create({
            data: {
                amount: parseFloat(amount),
                currency,
                category,
                description,
                date: new Date(date),
                userId: decoded.id,
                companyId: user.companyId,
                status: 'PENDING'
            }
        });

        // Strategy: If user has a manager, create first approval record for manager
        if (user.managerId) {
            await prisma.approval.create({
                data: {
                    expenseId: expense.id,
                    approverId: user.managerId,
                    sequence: 1,
                    status: 'PENDING'
                }
            });
        } else {
            // If no manager (e.g. Admin), auto-approve or send to Finance/Admin pool
            // For hackathon simplicity, let's assume it goes to a default admin approver if no manager
            const adminUser = await prisma.user.findFirst({
                where: { companyId: user.companyId, role: 'ADMIN' }
            });
            if (adminUser) {
                await prisma.approval.create({
                    data: {
                        expenseId: expense.id,
                        approverId: adminUser.id,
                        sequence: 1,
                        status: 'PENDING'
                    }
                });
            }
        }

        return NextResponse.json(expense);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const token = cookies().get('token')?.value;
        const decoded = verifyToken(token);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const expenses = await prisma.expense.findMany({
            where: { userId: decoded.id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(expenses);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
