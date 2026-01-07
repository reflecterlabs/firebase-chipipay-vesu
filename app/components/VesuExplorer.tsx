'use client';

import React, { useState } from 'react';
import {
    ChevronLeft,
    TrendingUp,
    Zap,
    Lock,
    Wallet,
    ArrowUpCircle,
    ArrowDownCircle
} from 'lucide-react';

import { useStakeVesuUsdc } from '@/lib/hooks/useStakeVesuUsdc';
import { useWithdrawVesuUsdc } from '@/lib/hooks/useWithdrawVesuUsdc';
import WalletManager, { WalletSession } from './WalletManager';
import { useFetchWallet } from '@/lib/hooks/useFetchWallet';
import { useTokenBalance } from '@/lib/hooks/useTokenBalance';

interface VesuExplorerProps {
    onBack: () => void;
    walletSession: WalletSession | null;
    onSessionChange: (session: WalletSession | null) => void;
}

export const VesuExplorer: React.FC<VesuExplorerProps> = ({ onBack, walletSession, onSessionChange }) => {
    const {
        stakeVesuUsdcAsync,
        isLoading: isStaking,
        isSuccess: stakeSuccess,
        data: stakeTxId,
        error: stakeError
    } = useStakeVesuUsdc();

    const {
        withdrawVesuUsdcAsync,
        isLoading: isWithdrawing,
        isSuccess: withdrawSuccess,
        data: withdrawTxId,
        error: withdrawError
    } = useWithdrawVesuUsdc();

    const { wallet } = useFetchWallet();
    const { balance: usdcBalance, isLoading: balanceLoading } = useTokenBalance('USDC', wallet?.publicKey);

    const [amount, setAmount] = useState<string>('1');
    const [activeTab, setActiveTab] = useState<'stake' | 'withdraw'>('stake');

    const isLoading = isStaking || isWithdrawing;
    const isSuccess = stakeSuccess || withdrawSuccess;
    const txId = stakeTxId || withdrawTxId;
    const error = stakeError || withdrawError;

    const handleAction = async () => {
        if (!walletSession || !wallet) return;

        const numAmount = parseFloat(amount);

        if (isNaN(numAmount) || numAmount <= 0) {
            alert('Please enter a valid amount.');
            return;
        }

        if (activeTab === 'stake') {
            const balance = parseFloat(usdcBalance || '0');
            if (numAmount > balance) {
                alert(`Insufficient USDC balance. You have ${usdcBalance} USDC.`);
                return;
            }

            try {
                await stakeVesuUsdcAsync({
                    encryptKey: walletSession.encryptKey,
                    wallet: {
                        publicKey: wallet.publicKey,
                        encryptedPrivateKey: wallet.encryptedPrivateKey
                    },
                    amount: numAmount,
                    receiverWallet: wallet.publicKey,
                });
            } catch (err) {
                console.error('Staking failed:', err);
            }
        } else {
            try {
                await withdrawVesuUsdcAsync({
                    encryptKey: walletSession.encryptKey,
                    wallet: {
                        publicKey: wallet.publicKey,
                        encryptedPrivateKey: wallet.encryptedPrivateKey
                    },
                    amount: numAmount,
                    recipient: wallet.publicKey,
                });
            } catch (err) {
                console.error('Withdrawal failed:', err);
            }
        }
    };

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
                        onClick={() => setActiveTab('stake')}
                        className={`text-xs font-bold uppercase tracking-widest pb-2 transition-all relative ${activeTab === 'stake' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        Stake
                        {activeTab === 'stake' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('withdraw')}
                        className={`text-xs font-bold uppercase tracking-widest pb-2 transition-all relative ${activeTab === 'withdraw' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        Withdraw
                        {activeTab === 'withdraw' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>}
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-sm space-y-8 text-center">
                    <div className="space-y-3">
                        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/10 text-white">
                            {activeTab === 'stake' ? <ArrowUpCircle size={32} /> : <ArrowDownCircle size={32} />}
                        </div>
                        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">
                            {activeTab === 'stake' ? 'Lending Deposit' : 'Lending Withdrawal'}
                        </h2>
                        <p className="text-sm text-zinc-500 leading-relaxed font-light">
                            {activeTab === 'stake'
                                ? 'Deposit your USDC into Vesu pools to start earning institutional-grade yield.'
                                : 'Withdraw your staked USDC assets from Vesu protocol back to your wallet.'}
                        </p>
                    </div>

                    <div className="pt-4 space-y-4">
                        {!walletSession ? (
                            <div className="bg-zinc-900/50 border border-amber-500/20 p-6 rounded-2xl space-y-4 animate-in fade-in zoom-in-95 duration-500">
                                <div className="flex flex-col items-center text-center space-y-2">
                                    <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mb-2">
                                        <Lock size={20} className="text-amber-500" />
                                    </div>
                                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Vault Locked</h3>
                                    <p className="text-[10px] text-zinc-500 leading-relaxed uppercase tracking-wider">
                                        Please unlock your security vault (PIN) <br />
                                        to enable lending operations.
                                    </p>
                                </div>
                                <div className="pt-2">
                                    <WalletManager
                                        onSessionChange={onSessionChange}
                                        walletSession={walletSession}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Balance Display Card (Only for Stake) */}
                                {activeTab === 'stake' && (
                                    <div className="bg-zinc-900/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                                                <Wallet size={16} className="text-blue-400" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.1em]">Available Balance</p>
                                                <p className="text-sm font-mono font-bold text-white">
                                                    {balanceLoading ? '---' : usdcBalance} <span className="text-zinc-500">USDC</span>
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setAmount(usdcBalance || '0')}
                                            className="text-[9px] font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors bg-blue-400/5 px-2 py-1 rounded border border-blue-400/10"
                                        >
                                            Use Max
                                        </button>
                                    </div>
                                )}

                                {/* Amount Input */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                            {activeTab === 'stake' ? 'Amount to Stake' : 'Amount to Withdraw'}
                                        </label>
                                        <span className="text-[10px] font-bold text-zinc-500 uppercase">USDC</span>
                                    </div>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-4 py-4 text-white font-mono text-lg focus:outline-none focus:border-white/20 transition-all text-center"
                                    />
                                </div>

                                <button
                                    onClick={handleAction}
                                    disabled={isLoading}
                                    className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/5 group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="w-3 h-3 border-2 border-black border-t-transparent animate-spin rounded-full"></div>
                                    ) : (
                                        <Zap size={14} className="group-hover:fill-black transition-all" />
                                    )}
                                    {isLoading
                                        ? (activeTab === 'stake' ? 'Staking...' : 'Withdrawing...')
                                        : (activeTab === 'stake' ? 'Connect Pool' : 'Withdraw from Pool')}
                                </button>

                                {isSuccess && txId && (
                                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[10px] text-emerald-400 font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
                                        {activeTab === 'stake' ? 'Staking Successful!' : 'Withdrawal Successful!'} <br />
                                        <span className="font-mono text-zinc-500">{txId.slice(0, 20)}...</span>
                                    </div>
                                )}

                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-[10px] text-red-400 font-bold uppercase tracking-widest">
                                        {error.message || 'Error occurred'}
                                    </div>
                                )}
                            </div>
                        )}

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
