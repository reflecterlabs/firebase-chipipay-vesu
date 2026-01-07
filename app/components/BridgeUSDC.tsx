'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    ArrowLeft,
    Shield,
    Loader2
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

export const BridgeUSDC: React.FC<BridgeUSDCProps> = ({ onBack, walletAddress }) => {
    const [isWidgetLoading, setIsWidgetLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initializing dependencies for the Layerswap Widget
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                refetchOnWindowFocus: false,
            },
        },
    }));

    // Memoize config to prevent unnecessary re-renders
    const layerswapConfig = useMemo(() => ({
        initialValues: {
            to: 'STARKNET_MAINNET',
            destAddress: walletAddress || '',
            asset: 'USDC',
            amount: '100'
        },
        appearance: {
            theme: 'dark' as const,
        },
        walletConnectors: [StarknetProvider]
    }), [walletAddress]);

    // Enhanced Loading Detection
    useEffect(() => {
        if (!containerRef.current) return;

        // Fallback timeout in case the observer fails (5 seconds)
        const fallbackTimer = setTimeout(() => {
            setIsWidgetLoading(false);
        }, 5000);

        // Observer to detect when the widget state is no longer in "skeleton" mode
        // We look for common elements that appear once loaded (like 'Send from' or inputs)
        const observer = new MutationObserver(() => {
            const hasInputs = containerRef.current?.innerText.includes('Send from') ||
                containerRef.current?.innerText.includes('From');

            // If we detect the actual form fields, we hide our loading screen
            if (hasInputs) {
                // Short extra delay for final UI polish
                setTimeout(() => {
                    setIsWidgetLoading(false);
                }, 200);
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
    }, []);

    return (
        <div className="flex flex-col h-full bg-[#0a0a0a] text-white animate-in slide-in-from-right duration-300 overflow-hidden font-sans">
            {/* Minimalist Sub-Header */}
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

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col relative">
                <div className="p-6 pb-2 text-center shrink-0">
                    <h2 className="text-xl font-bold uppercase italic tracking-tighter text-white">Bridge Assets</h2>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1 font-bold">Smart Wallet Native Gateway</p>
                </div>

                <div className="flex-1 flex justify-center px-4 relative">
                    {/* OUR Loading State - Persistent until widget is fully ready */}
                    {isWidgetLoading && (
                        <div className="absolute inset-0 z-[100] bg-[#0a0a0a] flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-300">
                            <div className="relative">
                                <div className="w-14 h-14 border-4 border-emerald-500/10 rounded-full"></div>
                                <Loader2 className="absolute top-0 left-0 w-14 h-14 text-emerald-500 animate-spin stroke-[3px]" />
                            </div>
                            <div className="text-center">
                                <p className="text-[11px] font-bold text-white uppercase tracking-[0.4em] animate-pulse">Estableciendo Conexión</p>
                                <p className="text-[9px] text-zinc-600 uppercase tracking-widest mt-1 font-bold">Sincronizando con Layerswap Node...</p>
                            </div>
                        </div>
                    )}

                    {/* Widget Container - Managed by MutationObserver */}
                    <div
                        ref={containerRef}
                        className={`w-full max-w-[360px] overflow-y-auto custom-scrollbar transition-all duration-700 ${isWidgetLoading ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}
                    >
                        <QueryClientProvider client={queryClient}>
                            <LayerswapProvider config={layerswapConfig}>
                                <div className="layerswap-container">
                                    <Swap />
                                </div>
                            </LayerswapProvider>
                        </QueryClientProvider>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                /* Hide widget's internal background to match our theme */
                .ls-widget-container {
                    background: transparent !important;
                    box-shadow: none !important;
                    border: none !important;
                    padding: 0 !important;
                    margin: 0 auto !important;
                    width: 100% !important;
                }
                
                .ls-widget-card {
                    background: transparent !important;
                    border: none !important;
                    padding: 0 !important;
                    box-shadow: none !important;
                }

                .ls-widget-button {
                    background: #10b981 !important;
                    color: black !important;
                    font-weight: 900 !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.1em !important;
                    border-radius: 14px !important;
                }

                /* Scrollbar optimization */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 0px; /* Hidden for even cleaner look since widget handles its own or is small */
                }
                
                /* Reset possible global conflicts with widget text */
                .ls-widget-container * {
                    transition: none !important; /* Prevent double transitions during initial load */
                }
            `}</style>
        </div>
    );
};
