'use client';

import React from 'react';
import { TrendingUp, Zap } from 'lucide-react';

export default function VesuLending({ walletInfo, encryptKey }: { walletInfo: any, encryptKey: string }) {
    return (
        <div className="bg-zinc-950 border border-white/10 text-white rounded-xl shadow-2xl w-full max-w-2xl mx-auto overflow-hidden min-h-[400px] flex flex-col justify-center items-center p-8 text-center space-y-8">
            <div className="space-y-4">
                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(255,255,255,0.05)]">
                    <TrendingUp size={40} className="text-white" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tighter uppercase italic">Vesu Lending</h2>
                    <p className="text-zinc-500 text-sm font-medium uppercase tracking-[0.2em]">Institutional Grade Yield</p>
                </div>
                <p className="text-zinc-400 max-w-md mx-auto text-sm leading-relaxed font-light">
                    Access the most secure lending markets on Starknet. Connect your wallet to a pool to start earning yield immediately.
                </p>
            </div>

            <div className="w-full max-w-xs pt-4">
                <button
                    className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(255,255,255,0.1)] group"
                >
                    <Zap size={16} className="group-hover:fill-black transition-all" />
                    Connect Pool
                </button>
            </div>

            <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Protocol Active</span>
                </div>
                <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Gasless Enabled</span>
            </div>
        </div>
    );
}
