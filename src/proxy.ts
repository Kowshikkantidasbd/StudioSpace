import { NextRequest, NextResponse } from 'next/server';

// The Express backend (backend/index.js). Locally it runs on port 5000.
// In production set BACKEND_URL to your deployed backend address.
const BACKEND_URL = (process.env.BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '');

// Forwards API calls and uploaded files to the backend, so the browser only ever talks to this site
// (the login cookie stays on this site).
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  return NextResponse.rewrite(new URL(`${pathname}${search}`, BACKEND_URL));
}

export const config = {
  matcher: ['/api/:path*', '/uploads/:path*'],
};
