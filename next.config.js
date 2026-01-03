/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Cloudflare Pages compatibility - STATIC EXPORT
  output: 'export',
  images: { unoptimized: true },
  
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  
  // Environment variables - explicitly define for static export
  // These will be inlined at build time
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_CHIPI_API_KEY: process.env.NEXT_PUBLIC_CHIPI_API_KEY,
    CHIPI_SECRET_KEY: process.env.CHIPI_SECRET_KEY,
  },
  
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
};

module.exports = nextConfig;

