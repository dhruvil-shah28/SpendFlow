import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePassword, signToken } from '@/lib/auth-utils';
import { cookies } from 'next/headers';

export async function POST(req) {
    try {
        const { email, password } = await req.json();
        console.log(`Login attempt for: ${email}`);

        const user = await prisma.user.findUnique({
            where: { email },
            include: { company: true }
        });

        if (!user) {
            console.log('User not found');
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            console.log('Invalid password');
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        console.log('Login successful, setting cookie...');

        const token = signToken({ id: user.id, email: user.email, role: user.role });

        const response = NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                company: user.company
            }
        });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24,
            path: '/',
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
