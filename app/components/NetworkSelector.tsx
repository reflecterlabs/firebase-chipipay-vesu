'use client';

import { useNetwork } from '@/lib/hooks/useNetwork.tsx';
import { Globe, AlertCircle } from 'lucide-react';

export default function NetworkSelector() {
  const { network } = useNetwork();

  return (
    <div className="border border-white/10 bg-black rounded-xl shadow-[0_0_100px_rgba(255,255,255,0.05)] p-4">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Globe size={14} className="text-white" />
          <h3 className="text-xs font-bold text-white uppercase tracking-widest">Blockchain Network</h3>
        </div>
        <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Starknet</p>
      </div>

      {/* Mainnet Only Display */}
      <div className="mb-4">
        <div className="relative p-3 rounded-lg border border-green-400/50 bg-green-400/10 text-left">
          <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-green-400">
              Mainnet
            </p>
            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Production Network</p>
          </div>
        </div>
      </div>

      {/* Network Info */}
      <div className="pt-3 border-t border-white/10">
        <div className="flex items-start gap-2 text-[10px]">
          <AlertCircle size={14} className="flex-shrink-0 mt-0.5 text-orange-400" />
          <p className="text-zinc-400 leading-relaxed uppercase tracking-widest font-bold">
            ⚠️ Real network. Requires tokens with economic value
          </p>
        </div>
      </div>
    </div>
  );
}
