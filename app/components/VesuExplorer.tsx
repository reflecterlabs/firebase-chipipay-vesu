'use client';

import React from 'react';
import {
    ChevronLeft,
    TrendingUp,
    Zap
} from 'lucide-react';

interface VesuExplorerProps {
    onBack: () => void;
}

export const VesuExplorer: React.FC<VesuExplorerProps> = ({ onBack }) => {
    return (
        <div className="flex flex-col h-full p-6 animate-in fade-in duration-300">
            <div className="shrink-0">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors mb-6"
                >
                    <ChevronLeft size={14} /> Back to Assets
                </button>

                <div className="flex items-center gap-4 border-b border-white/10 mb-6 pb-2">
                    <button
                        className="text-xs font-bold uppercase tracking-widest pb-2 transition-all relative text-white"
                    >
                        Earn
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-sm space-y-8 text-center">
                    <div className="space-y-3">
                        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/10">
                            <TrendingUp size={32} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Lending Markets</h2>
                        <p className="text-sm text-zinc-500 leading-relaxed font-light">
                            Access curated lending pools to earn yield on your Starknet assets with institutional-grade security.
                        </p>
                    </div>

                    <div className="pt-4">
                        <button
                            className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/5 group"
                        >
                            <Zap size={14} className="group-hover:fill-black transition-all" />
                            Connect Pool
                        </button>
                        <p className="mt-4 text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-bold">
                            Powered by Vesu Protocol
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
};
