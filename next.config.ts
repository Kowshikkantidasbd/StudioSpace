import type { NextConfig } from 'next';

// The Express backend (backend/index.js). Locally it runs on port 5000.
// In production set BACKEND_URL to your deployed backend address.
const BACKEND_URL = (process.env.BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '');

const nextConfig: NextConfig = {
  // The browser always talks to this site; Next forwards API calls and uploads to the backend.
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${BACKEND_URL}/api/:path*` },
      { source: '/uploads/:path*', destination: `${BACKEND_URL}/uploads/:path*` },
    ];
  },
};

export default nextConfig;