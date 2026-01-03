'use client';

import './globals.css';
import { ChipiClientProvider } from '@chipi-stack/nextjs';
import { NetworkProvider } from '@/lib/hooks/useNetwork.tsx';
import { useEffect, useState } from 'react';

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

  const apiKey = process.env.NEXT_PUBLIC_CHIPI_API_KEY || '';

  return (
    <html lang="es">
      <body>
        <ChipiClientProvider
          apiPublicKey={apiKey}
          alphaUrl={process.env.NEXT_PUBLIC_CHIPI_ALPHA_URL}
        >
          <NetworkProvider>
            {children}
          </NetworkProvider>
        </ChipiClientProvider>
      </body>
    </html>
  );
}
