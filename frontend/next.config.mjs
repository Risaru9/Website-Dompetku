/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // Artinya: Kalau frontend minta ke /api/...,
        // Next.js akan meneruskannya ke http://localhost:5000/api/...
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },
};

export default nextConfig;