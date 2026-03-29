import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth-utils';
import { cookies } from 'next/headers';

export async function POST(req) {
    try {
        const token = cookies().get('token')?.value;
        const decoded = verifyToken(token);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { approvalId, status, comments } = await req.json();

        const approval = await prisma.approval.findUnique({
            where: { id: approvalId },
            include: { expense: true }
        });

        if (!approval || approval.approverId !== decoded.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Update current approval
        await prisma.approval.update({
            where: { id: approvalId },
            data: { status, comments }
        });

        if (status === 'REJECTED') {
            await prisma.expense.update({
                where: { id: approval.expenseId },
                data: { status: 'REJECTED' }
            });
        } else {
            // Check if there are more steps in the sequence
            // For hackathon, let's implement a hardcoded 2-step flow if level 1 is approved
            if (approval.sequence === 1) {
                // Send to Finance (hardcoded role check in this mock logic)
                const financeUser = await prisma.user.findFirst({
                    where: { companyId: approval.expense.companyId, role: 'ADMIN' } // In real, use a specific Finance role
                });

                if (financeUser && financeUser.id !== decoded.id) {
                    await prisma.approval.create({
                        data: {
                            expenseId: approval.expenseId,
                            approverId: financeUser.id,
                            sequence: 2,
                            status: 'PENDING'
                        }
                    });
                } else {
                    // If no further approvers, mark expense as APPROVED
                    await prisma.expense.update({
                        where: { id: approval.expenseId },
                        data: { status: 'APPROVED' }
                    });
                }
            } else {
                // Final step approved
                await prisma.expense.update({
                    where: { id: approval.expenseId },
                    data: { status: 'APPROVED' }
                });
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const token = cookies().get('token')?.value;
        const decoded = verifyToken(token);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const approvals = await prisma.approval.findMany({
            where: { approverId: decoded.id, status: 'PENDING' },
            include: {
                expense: {
                    include: { user: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(approvals);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
