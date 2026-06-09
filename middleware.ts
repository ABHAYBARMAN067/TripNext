import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const publicRoutes = ["/", "/login", "/register"];
	if (publicRoutes.includes(pathname)) {
		return NextResponse.next();
	}

	// Custom JWT token
	const token = request.cookies.get("token");

	if (!token) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth).*)"],
};





/*      404 OUTPUT TESTING     */

/*
import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	
	const publicRoutes = ["/", "/login", "/register"];

	
	if (publicRoutes.includes(pathname)) {
		return NextResponse.next();
	}

	
	const protectedRoutes = ["/bookings", "/host"];

	
	const isProtected = protectedRoutes.some((route) =>
		pathname.startsWith(route)
	);

	if (isProtected) {
		const token = request.cookies.get("token");

		if (!token) {
			return NextResponse.redirect(
				new URL("/login", request.url)
			);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
*/