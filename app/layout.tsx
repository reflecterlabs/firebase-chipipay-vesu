'use client';

import './globals.css';
import { ChipiClientProvider } from '@chipi-stack/nextjs';
import { NetworkProvider } from '@/lib/hooks/useNetwork.tsx';
import { useEffect, useState } from 'react';

// CRITICAL: Use hardcoded config for Cloudflare Pages compatibility
import { chipiConfig } from '@/lib/config/env';

const CHIPI_API_KEY = chipiConfig.apiPublicKey;
const CHIPI_ALPHA_URL = chipiConfig.alphaUrl;

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
