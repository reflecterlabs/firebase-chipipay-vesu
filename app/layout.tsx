'use client';

import './globals.css';
import { ChipiClientProvider } from '@chipi-stack/nextjs';
import { NetworkProvider } from '@/lib/hooks/useNetwork.tsx';
import { useEffect, useState } from 'react';

// CRITICAL: Read env vars at module level for static export
// Next.js inlines NEXT_PUBLIC_* during build
const CHIPI_API_KEY = process.env.NEXT_PUBLIC_CHIPI_API_KEY || '';
const CHIPI_ALPHA_URL = process.env.NEXT_PUBLIC_CHIPI_ALPHA_URL;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent SSR/build-time rendering
  if (!mounted) {
    return (
      <html lang="es">
        <body>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            Loading...
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="es">
      <body>
        <ChipiClientProvider
          apiPublicKey={CHIPI_API_KEY}
          alphaUrl={CHIPI_ALPHA_URL}
        >
          <NetworkProvider>
            {children}
          </NetworkProvider>
        </ChipiClientProvider>
      </body>
    </html>
  );
}
