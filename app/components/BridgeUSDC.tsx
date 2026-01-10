'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    ArrowLeft,
    Shield,
    Loader2,
    CheckCircle2
} from 'lucide-react';
import { LayerswapProvider, Swap } from '@layerswap/widget';
import { StarknetProvider } from '@layerswap/wallet-starknet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// IMPORTANT: Missing CSS was causing the broken UI
import '@layerswap/widget/index.css';

interface BridgeUSDCProps {
    onBack: () => void;
    walletAddress: string;
}

/**
 * BridgeUSDC Component
 * Integrates Layerswap Widget for cross-chain and CEX fundings.
 */
export const BridgeUSDC: React.FC<BridgeUSDCProps> = ({ onBack, walletAddress }) => {
    const [isWidgetLoading, setIsWidgetLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initializing React Query client for Layerswap's internal state management
    const queryClient = useMemo(() => new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                refetchOnWindowFocus: false,
                staleTime: 60000,
            },
        },
    }), []);

    // Configuration for the Layerswap Widget
    const layerswapConfig = useMemo(() => {
        const config: any = {
            initialValues: {
                to: 'STARKNET_MAINNET',
                destAddress: walletAddress,
                amount: '100',
                lockTo: true,
            },
            appearance: {
                theme: 'dark',
            },
            // We include StarknetProvider, but we should also include others for external wallets
            walletConnectors: [StarknetProvider]
        };

        // If we have a walletAddress, we lock it to ensure security and native experience
        if (walletAddress) {
            config.initialValues.lockAddress = true;
        }

        return config;
    }, [walletAddress]);

    // Handle initial client-side mount to prevent hydration errors
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Intelligent loading detection to replace skeleton states with our brand experience
    useEffect(() => {
        if (!isMounted || !containerRef.current) return;

        const fallbackTimer = setTimeout(() => {
            setIsWidgetLoading(false);
        }, 8000);

        const observer = new MutationObserver(() => {
            // Wait for real input elements or interactive labels to appear
            const hasRealContent = containerRef.current?.querySelector('input') ||
                containerRef.current?.innerText.includes('Select token') ||
                containerRef.current?.innerText.includes('Receive at') ||
                containerRef.current?.innerText.includes('Send from');

            if (hasRealContent) {
                setTimeout(() => {
                    setIsWidgetLoading(false);
                }, 800);
                observer.disconnect();
                clearTimeout(fallbackTimer);
            }
        });

        observer.observe(containerRef.current, {
            childList: true,
            subtree: true,
            characterData: true
        });

        return () => {
            observer.disconnect();
            clearTimeout(fallbackTimer);
        };
    }, [isMounted]);

    return (
        <div className="flex flex-col h-full bg-[#0a0a0a] text-white animate-in slide-in-from-right duration-300 overflow-hidden font-sans">
            {/* Header / Navigation */}
            <div className="shrink-0 p-4 flex items-center justify-between bg-zinc-950/40 border-b border-white/5">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/5 group"
                >
                    <ArrowLeft size={12} className="text-zinc-500 group-hover:text-white transition-colors" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white">Volver</span>
                </button>
                <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <Shield size={10} className="text-emerald-500" />
                    <span className="text-[8px] font-black uppercase tracking-wider text-emerald-500">Secure Node</span>
                </div>
            </div>

            {/* Main view container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col relative bg-[#0a0a0a]">
                <div className="p-6 pb-2 text-center shrink-0">
                    <h2 className="text-xl font-bold uppercase italic tracking-tighter text-white">Bridge Assets</h2>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1 font-bold">Smart Wallet Native Gateway</p>
                </div>

                {/* Connection verification for User Confidence */}
                {walletAddress && !isWidgetLoading && (
                    <div className="mx-6 mb-4 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-500">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={12} className="text-emerald-500" />
                            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Smart Wallet Connected</span>
                        </div>
                        <span className="text-[9px] font-mono text-zinc-500">
                            {walletAddress.slice(0, 10)}...{walletAddress.slice(-6)}
                        </span>
                    </div>
                )}

                <div className="flex-1 flex justify-center px-4 pb-12 relative">
                    {/* Custom Loading State */}
                    {isWidgetLoading && (
                        <div className="absolute inset-0 z-[100] bg-[#0a0a0a] flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-300">
                            <div className="relative">
                                <div className="w-14 h-14 border-4 border-emerald-500/10 rounded-full"></div>
                                <Loader2 className="absolute top-0 left-0 w-14 h-14 text-emerald-500 animate-spin stroke-[3px]" />
                            </div>
                            <div className="text-center px-8">
                                <p className="text-[11px] font-bold text-white uppercase tracking-[0.4em] animate-pulse">Sincronizando</p>
                                <p className="text-[9px] text-zinc-600 uppercase tracking-widest mt-1 font-bold">Iniciando Puente Nativo Starknet...</p>
                            </div>
                        </div>
                    )}

                    {/* Widget Wrapper */}
                    <div
                        ref={containerRef}
                        className={`w-full max-w-[440px] transition-all duration-700 ${isWidgetLoading ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}
                    >
                        {isMounted && (
                            <div suppressHydrationWarning>
                                <QueryClientProvider client={queryClient}>
                                    <LayerswapProvider config={layerswapConfig}>
                                        <div className="layerswap-wrapper pb-10">
                                            <Swap />
                                        </div>
                                    </LayerswapProvider>
                                </QueryClientProvider>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                /* General Widget Overrides */
                .ls-widget-container {
                    background: transparent !important;
                    box-shadow: none !important;
                    border: none !important;
                    padding: 0 !important;
                    width: 100% !important;
                    min-height: 580px !important;
                }
                
                .ls-widget-card {
                    background: transparent !important;
                    border: none !important;
                    padding: 0 !important;
                    box-shadow: none !important;
                }

                /* Ensure wallet connection button is visible and active */
                .ls-header__wallet-button,
                button[aria-label="Connect wallet"],
                button[aria-label="Wallet"],
                .ls-header__wallet-button * {
                    display: flex !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    pointer-events: auto !important;
                }

                /* Premium styling for the primary action button */
                .ls-widget-button {
                    background: #10b981 !important;
                    color: black !important;
                    font-weight: 900 !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.1em !important;
                    border-radius: 12px !important;
                    transition: all 0.2s ease !important;
                }
                .ls-widget-button:hover {
                    background: #34d399 !important;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
                }

                /* Scrollbar aesthetics */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(16, 185, 129, 0.2);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};
