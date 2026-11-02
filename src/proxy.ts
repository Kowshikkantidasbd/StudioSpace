import { NextRequest, NextResponse } from 'next/server';

// The Express backend (backend/index.js). Locally it runs on port 5000.
const BACKEND_URL = (process.env.BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '');

// Change this to the cookie name you found in DevTools.
const COOKIE_NAME = 'token';

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // API calls and uploaded files go to the backend.
  if (pathname.startsWith('/api/') || pathname.startsWith('/uploads/')) {
    return NextResponse.rewrite(new URL(`${pathname}${search}`, BACKEND_URL));
  }

  // Private pages: no login cookie means go to /login.
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