import { NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  // Only protect admin routes
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const adminAuthCookie = request.cookies.get('admin_auth');
  
  // If this is the admin login page, allow access
  if (request.nextUrl.pathname === '/admin/login') {
    // If already logged in, redirect to admin dashboard
    if (adminAuthCookie) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }
  
  // If not logged in, redirect to login page
  if (!adminAuthCookie) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  
  // User is authenticated, proceed to the admin page
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*'],
};