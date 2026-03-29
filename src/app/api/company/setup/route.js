import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth-utils';
import { cookies } from 'next/headers';

export async function POST(req) {
    try {
        const token = cookies().get('token')?.value;
        const decoded = verifyToken(token);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { currency } = await req.json();

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            include: { company: true }
        });

        await prisma.company.update({
            where: { id: user.companyId },
            data: { currency }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
