/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Cloudflare Pages compatibility
  // For static export, uncomment the following:
  // output: 'export',
  // images: { unoptimized: true },
  
  // For SSR with Cloudflare Workers, keep default settings
  // and use @cloudflare/next-on-pages adapter
  
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  
  // Environment variables validation
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  },
};

module.exports = nextConfig;
