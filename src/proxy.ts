import { NextRequest, NextResponse } from 'next/server';


const BACKEND_URL = (process.env.BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '');


const COOKIE_NAME = 'token';

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  
  if (pathname.startsWith('/api/') || pathname.startsWith('/uploads/')) {
    return NextResponse.rewrite(new URL(`${pathname}${search}`, BACKEND_URL));
  }

  
  if (!request.cookies.has(COOKIE_NAME)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/uploads/:path*',
    '/add-studio',
    '/my-bookings',
    '/my-listings',
    '/saved-studios',
    '/studios/edit/:path*',
  ],
};