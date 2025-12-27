import type { Metadata } from 'next';
import './globals.css';
import { ChipiProvider } from '@chipi-stack/nextjs';

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
        <ChipiProvider>
          {children}
        </ChipiProvider>
      </body>
    </html>
  );
}
