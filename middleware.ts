import { NextResponse, NextRequest } from 'next/server';
export const runtime = "nodejs";

import { auth } from './lib/auth-config';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Public routes
    const publicRoutes = ['/', '/login', '/register', '/api/auth/login', '/api/auth/register'];
    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

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
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};