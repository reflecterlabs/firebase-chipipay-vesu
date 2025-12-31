'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import { useFetchWallet } from '@/lib/hooks/useFetchWallet';
import { useNetwork } from '@/lib/hooks/useNetwork.tsx';
import WalletManager, { WalletSession } from '@/app/components/WalletManager';
import FeatureContainer from '@/app/components/FeatureContainer';
import VesuLending from '@/app/components/VesuLending';
import NetworkSelector from '@/app/components/NetworkSelector';

export default function DashboardPage() {
  const { user, loading, signOut } = useFirebaseAuth();
  const { network } = useNetwork();
  const router = useRouter();
  const [walletSession, setWalletSession] = useState<WalletSession | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="text-gray-600 font-medium">Cargando ecosistema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black flex flex-col">
      {/* Header Minimalista - Estilo Prototipo */}
      <nav className="bg-black border-b border-white/10 z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold text-xs rounded">OTD</div>
              <span className="text-xl font-black tracking-tighter">OPENTHEDOORZ</span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-white">{user.email}</p>
                <div className="flex items-center justify-end space-x-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-green-500 font-medium uppercase tracking-widest">Conectado</span>
                </div>
              </div>
              <div className="h-8 w-px bg-white/10"></div>
              <button
                onClick={handleSignOut}
                className="text-sm font-medium text-white hover:text-zinc-300 hover:bg-white/5 px-3 py-1.5 rounded transition-colors uppercase tracking-widest text-[10px]"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Grid Layout - Estilo Prototipo */}
      <main className="flex-grow max-w-7xl mx-auto w-full p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT SIDE: Main Content Area */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Welcome/Feature Section */}
            <div className="border border-white/10 bg-black p-6 rounded-xl shadow-[0_0_100px_rgba(255,255,255,0.05)]">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4">
                <span className="text-white">BIENVENIDO</span>
              </h1>
              <p className="text-lg text-zinc-300 font-light max-w-xl leading-relaxed">
                Accede a tu ecosistema Web3 centralizado. Gestiona wallets, ejecuta transacciones gasless y accede a protocolos DeFi en una única interfaz.
              </p>
            </div>

            {/* Feature Container */}
            <FeatureContainer isActive={!!walletSession}>
              {walletSession ? (
                <div className="h-full animate-fade-in-up">
                  <VesuLending
                    walletInfo={{
                      publicKey: walletSession.publicKey,
                      walletId: walletSession.walletId
                    }}
                    encryptKey={walletSession.encryptKey}
                  />
                </div>
              ) : (
                <div className="border border-white/10 bg-black p-12 rounded-xl flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <p className="text-zinc-400 text-sm uppercase tracking-widest mb-2">Paso 1</p>
                    <p className="text-white font-bold text-lg">Conecta tu Wallet para comenzar</p>
                    <p className="text-zinc-500 text-sm mt-2">Usa el panel de la derecha para crear o restaurar tu wallet</p>
                  </div>
                </div>
              )}
            </FeatureContainer>
          </div>

          {/* RIGHT SIDE: Wallet Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Network Selector */}
            <NetworkSelector />

            {/* Wallet Panel - Estilo Prototipo */}
            <div className="border border-white/10 bg-black rounded-xl shadow-[0_0_100px_rgba(255,255,255,0.05)] overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-1">Billetera Digital</h2>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em]">Gestión de identidad y llaves</p>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(100vh-320px)] custom-scrollbar">
                <WalletManager
                  walletSession={walletSession}
                  onSessionChange={setWalletSession}
                />

                {/* Network Status Footer */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4">Estado del Sistema</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Red</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded uppercase tracking-widest ${
                        network === 'MAINNET' 
                          ? 'text-green-400 border border-green-400/30 bg-green-400/10' 
                          : 'text-orange-400 border border-orange-400/30 bg-orange-400/10'
                      }`}>
                        {network}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Proveedor</span>
                      <span className="text-[10px] text-green-400 font-medium flex items-center gap-1.5 uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                        ChipiPay
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
