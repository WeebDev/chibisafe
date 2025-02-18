import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
	const currentUser = request.cookies.get('token')?.value;

	if (request.nextUrl.pathname.startsWith('/dashboard') && !currentUser) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	if (request.nextUrl.pathname.startsWith('/login') && currentUser) {
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	return NextResponse.next();
}

// TODO: I think it would be a good idea to have this
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico).*)'
	]
};
