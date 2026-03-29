import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth-utils';
import { cookies } from 'next/headers';

export async function POST(req) {
    try {
        const { email, password, name, companyName } = await req.json();

        if (!email || !password || !companyName) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        // Create Company and Admin User in a transaction
        const result = await prisma.$transaction(async (tx) => {
            const company = await tx.company.create({
                data: { name: companyName }
            });

            const user = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role: 'ADMIN',
                    companyId: company.id
                }
            });

            return { user, company };
        });

        const token = signToken({ id: result.user.id, email: result.user.email, role: 'ADMIN' });

        const response = NextResponse.json({
            user: {
                id: result.user.id,
                email: result.user.email,
                role: 'ADMIN'
            }
        });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
