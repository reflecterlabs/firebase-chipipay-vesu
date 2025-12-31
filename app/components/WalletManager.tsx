'use client';

import { useState } from 'react';
import { useFetchWallet } from '@/lib/hooks/useFetchWallet';
import { useNetwork } from '@/lib/hooks/useNetwork';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import CreateWallet from '@/app/components/CreateWallet';
import RestoreWallet from '@/app/components/RestoreWallet';

export type WalletSession = {
    publicKey: string;
    walletId: string;
    encryptKey: string;
};

type WalletManagerProps = {
    onSessionChange: (session: WalletSession | null) => void;
    walletSession: WalletSession | null;
};

export default function WalletManager({ onSessionChange, walletSession }: WalletManagerProps) {
    const { wallet: existingWallet, isLoading: walletLoading } = useFetchWallet();
    const { user } = useFirebaseAuth();
    const { isMainnet } = useNetwork();

    const [copied, setCopied] = useState(false);

    const handleRestore = (encryptKey: string) => {
        if (!existingWallet) return;
        onSessionChange({
            publicKey: existingWallet.normalizedPublicKey || existingWallet.publicKey,
            walletId: existingWallet.id || existingWallet.publicKey,
            encryptKey
        });
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    if (walletLoading) {
        return (
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-lg animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col transition-all duration-500">
            {!walletSession ? (
                // 1. No Session: Show Auth Handlers (Restore or Create)
                <div className="transform transition-all duration-500 ease-in-out">
                    {existingWallet ? (
                        <RestoreWallet wallet={existingWallet} userUid={user?.uid} onUnlock={handleRestore} />
                    ) : (
                        <CreateWallet onSuccess={onSessionChange} />
                    )}
                </div>
            ) : (
                // 2. Session Active: Show Wallet Status & Logout
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xl space-y-4">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="relative">
                            <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                        </div>
                        <h3 className="text-gray-900 font-bold text-lg">Billetera Conectada</h3>
                    </div>

                    {/* Deposit Address Section */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-blue-700 uppercase font-bold tracking-wider">Dirección de Depósito</p>
                            <div className="flex items-center space-x-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                <span className="text-[10px] text-blue-600 font-medium">Starknet</span>
                            </div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm p-3 rounded-md border border-blue-100 mb-3">
                            <p className="text-xs font-mono text-gray-800 break-all leading-relaxed">{walletSession.publicKey}</p>
                        </div>
                        <button
                            onClick={() => copyToClipboard(walletSession.publicKey)}
                            className="w-full py-2 bg-blue-600 text-white text-sm font-bold rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                        >
                            {copied ? (
                                <>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>¡Copiado!</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <span>Copiar Dirección</span>
                                </>
                            )}
                        </button>
                        {/* Explorer link to view activity */}
                        <div className="mt-2 text-center">
                            <a
                                href={`${isMainnet ? 'https://starkscan.co' : 'https://sepolia.starkscan.co'}/contract/${walletSession.publicKey}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-[11px] font-semibold text-blue-700 hover:text-blue-800"
                            >
                                <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h4m0 0v4m0-4l-5 5m-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h7a2 2 0 012 2v7a2 2 0 01-2 2z" />
                                </svg>
                                Ver actividad en Starkscan
                            </a>
                        </div>
                        <p className="text-[10px] text-blue-600 mt-2 text-center leading-relaxed">
                            Usa esta dirección para recibir tokens en Starknet
                        </p>
                    </div>

                    <button
                        onClick={() => onSessionChange(null)}
                        className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-lg border border-red-100 hover:bg-red-100 hover:border-red-200 transition-colors flex items-center justify-center space-x-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>Bloquear Billetera</span>
                    </button>
                </div>
            )}

            {/* Footer Status inside Manager */}
            <div className="mt-6 text-center">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold opacity-60">
                    Secured by ChipiPay Enclaves
                </p>
            </div>
        </div>
    );
}
