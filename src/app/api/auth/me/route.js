import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-utils';
import prisma from '@/lib/prisma';

export async function GET(req) {
    try {
        const token = req.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            include: { company: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            company: user.company.name
        });
    } catch (error) {
        console.error('Auth Me Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
