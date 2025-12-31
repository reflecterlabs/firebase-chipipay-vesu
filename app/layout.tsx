import type { Metadata } from 'next';
import './globals.css';
import { ChipiClientProvider } from '@chipi-stack/nextjs';
import { NetworkProvider } from '@/lib/hooks/useNetwork.tsx';

export const metadata: Metadata = {
  title: 'Vesu Hooks - Gasless Transactions',
  description: 'A React hook library for gasless interactions with Vesu vTokens',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <ChipiClientProvider
          apiPublicKey={process.env.NEXT_PUBLIC_CHIPI_API_KEY as string}
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
