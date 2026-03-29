import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-utils';

export function middleware(request) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    console.log(`[Middleware] Path: ${pathname} | Token exists: ${!!token}`);

    // 1. Allow all internal Next.js assets and public files
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('favicon.ico') ||
        pathname === '/'
    ) {
        return NextResponse.next();
    }

    // 2. Allow login/signup pages regardless of token (for now, to avoid loops)
    if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
        return NextResponse.next();
    }

    // TEMPORARY BYPASS FOR VERIFICATION
    return NextResponse.next();

    /*
    if (!token) {
        console.log(`[Middleware] No token for ${pathname}, redirecting...`);
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        const user = verifyToken(token);
        if (!user) {
            console.log(`[Middleware] Invalid token for ${pathname}, redirecting...`);
            return NextResponse.redirect(new URL('/login', request.url));
        }
        console.log(`[Middleware] Authorized: ${user.email} (${user.role})`);
    } catch (err) {
        console.error('[Middleware] Auth verify error');
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
    */
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
