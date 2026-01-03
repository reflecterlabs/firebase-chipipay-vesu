/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Cloudflare Pages compatibility - STATIC EXPORT
  output: 'export',
  images: { unoptimized: true },
  
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  
  // CRITICAL: Disable webpack cache in production to avoid 250+ MB cache files
  // Cloudflare Pages has a 25 MiB file limit
  // Cache only helps with local development rebuilds, not needed for CI/CD
  webpack: (config, { dev }) => {
    // Only cache in development
    if (!dev) {
      config.cache = false;
    }
    return config;
  },
  
  // Environment variables validation
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  },
};

module.exports = nextConfig;

