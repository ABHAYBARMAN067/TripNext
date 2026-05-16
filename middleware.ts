import { NextResponse, NextRequest } from 'next/server';
export const runtime = "nodejs";

import { auth } from './lib/auth-config';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Public routes - don't require authentication
    const publicRoutes = ['/', '/login', '/register'];
    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    try {
        // Get session using NextAuth
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Role-based access
        if (pathname.startsWith('/host') && session.user.role !== 'host') {
            console.log('Access denied: User role is', session.user.role, 'but host access required');
            return NextResponse.redirect(new URL('/', request.url));
        }

        if (pathname.startsWith('/guest') && session.user.role !== 'guest') {
            console.log('Access denied: User role is', session.user.role, 'but guest access required');
            return NextResponse.redirect(new URL('/', request.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error('Middleware auth error:', error);
        // On error, redirect to login
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
};