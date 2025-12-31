
import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  LogOut, 
  ArrowUpRight, 
  ChevronLeft, 
  Database, 
  TrendingUp, 
  Layers, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  Copy, 
  CheckCircle2,
  Lock,
  KeyRound,
  Globe,
  Settings,
  ExternalLink,
  User,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { WalletState, TokenBalance } from '../types';

const MOCK_TOKENS: TokenBalance[] = [
  { symbol: 'ETH', name: 'Ethereum', balance: '1.2450', valueUsd: '4,210.50', icon: 'Ξ' },
  { symbol: 'STRK', name: 'Starknet', balance: '520.00', valueUsd: '1,040.00', icon: 'S' },
  { symbol: 'USDC', name: 'USD Coin', balance: '102.10', valueUsd: '102.10', icon: '$' },
];

type AuthView = 'login' | 'register' | 'forgot';
type WalletView = 'dashboard' | 'send' | 'receive';

const ADDRESSES = {
  mainnet: {
    short: '0x0471...952a',
    full: '0x047182a5712f695989a1c0d9045966755ca4b6301962300ee7369930f305952a'
  },
  testnet: {
    short: '0x053c...1234',
    full: '0x053c61234567890abcdef1234567890abcdef1234567890abcdef1234567890'
  }
};

// Deterministic QR Pattern
const QR_PATTERN = [
  1, 1, 1, 1, 0, 0, 1, 1,
  1, 0, 0, 1, 1, 0, 0, 1,
  1, 0, 0, 1, 0, 1, 0, 1,
  1, 1, 1, 1, 1, 0, 1, 1,
  0, 0, 0, 0, 1, 1, 0, 0,
  1, 0, 1, 1, 0, 0, 1, 0,
  1, 1, 0, 0, 1, 1, 1, 0,
  0, 0, 1, 0, 0, 1, 0, 1,
];

interface WalletPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletPopup: React.FC<WalletPopupProps> = ({ isOpen, onClose }) => {
  const [state, setState] = useState<WalletState>(WalletState.DISCONNECTED);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [walletView, setWalletView] = useState<WalletView>('dashboard');
  const [network, setNetwork] = useState<'mainnet' | 'testnet'>('mainnet');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenBalance>(MOCK_TOKENS[0]);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [sendAddress, setSendAddress] = useState('');

  const currentAddress = ADDRESSES[network];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleAuthAction = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setState(WalletState.CONNECTED);
    }, 1500);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setWalletView('dashboard');
      alert(`Transaction Sent: ${sendAmount} ${selectedToken.symbol} to ${sendAddress} on ${network.toUpperCase()}`);
    }, 2000);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(currentAddress.full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSettingsView = () => {
    setState(state === WalletState.SETTINGS ? WalletState.CONNECTED : WalletState.SETTINGS);
  };

  const switchNetwork = () => {
    setNetwork(prev => prev === 'mainnet' ? 'testnet' : 'mainnet');
  };

  const setMaxAmount = () => {
    setSendAmount(selectedToken.balance);
  };

  const selectToken = (token: TokenBalance) => {
    setSelectedToken(token);
    setIsTokenSelectorOpen(false);
    setSendAmount(''); // Clear amount when switching tokens
  };

  return (
    <>
      <div 
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[110] w-full max-w-[380px] h-[600px] bg-black border border-white/20 shadow-[0_0_100px_rgba(255,255,255,0.1)] flex flex-col transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold text-xs">OTD</div>
            <span className="text-xs font-bold uppercase tracking-widest text-white">Open The Doorz</span>
          </div>
          <div className="flex items-center gap-1">
            {(state === WalletState.CONNECTED || state === WalletState.SETTINGS) && (
              <>
                <button 
                  onClick={switchNetwork}
                  className={`px-2 py-0.5 border text-[8px] font-bold uppercase tracking-widest transition-all ${
                    network === 'mainnet' 
                      ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10' 
                      : 'border-amber-500/50 text-amber-500 bg-amber-500/5 hover:bg-amber-500/10'
                  }`}
                  title="Quick Network Switch"
                >
                  {network}
                </button>
                <button 
                  onClick={toggleSettingsView}
                  className={`p-2 transition-colors ${state === WalletState.SETTINGS ? 'text-white' : 'text-zinc-300 hover:text-white'}`}
                >
                  <Settings size={18} />
                </button>
              </>
            )}
            <button 
              onClick={onClose}
              className="p-2 text-zinc-300 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative bg-black">
          {state === WalletState.DISCONNECTED && (
            <div className="p-8 flex flex-col h-full animate-in fade-in duration-500">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 border border-white/10 rounded-full flex items-center justify-center mb-6 text-zinc-300">
                  {authView === 'forgot' ? <KeyRound size={32} /> : authView === 'register' ? <Sparkles size={32} /> : <Lock size={32} />}
                </div>
                <h3 className="text-xl font-bold mb-2 uppercase tracking-tight text-white">
                  {authView === 'login' ? 'Welcome Back' : authView === 'register' ? 'Join the Bridge' : 'Recovery'}
                </h3>
                <p className="text-sm text-zinc-300 font-light">
                  {authView === 'login' ? 'Access your Starknet assets' : authView === 'register' ? 'Create a secure non-custodial account' : 'Reset your bridge credentials'}
                </p>
              </div>

              <form onSubmit={handleAuthAction} className="space-y-4 flex-1">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-300 font-bold ml-1">Email</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-zinc-950 border border-white/10 p-4 text-sm focus:border-white focus:outline-none transition-colors placeholder:text-zinc-400"
                  />
                </div>
                {authView !== 'forgot' && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-300 font-bold">Password</label>
                      {authView === 'login' && (
                        <button type="button" onClick={() => setAuthView('forgot')} className="text-[10px] uppercase tracking-widest text-zinc-300 hover:text-white transition-colors">Forgot?</button>
                      )}
                    </div>
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-zinc-950 border border-white/10 p-4 text-sm focus:border-white focus:outline-none transition-colors placeholder:text-zinc-400"
                    />
                  </div>
                )}
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4 bg-white text-black hover:bg-zinc-200"
                >
                  {isLoading ? <div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin rounded-full"></div> : authView === 'login' ? 'Sign In' : authView === 'register' ? 'Create Account' : 'Send Instructions'}
                </button>
              </form>
              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                {authView === 'login' ? (
                  <p className="text-xs text-zinc-300 font-light">New to OpenTheDoorz? <button onClick={() => setAuthView('register')} className="text-white font-bold hover:underline">Register</button></p>
                ) : (
                  <button onClick={() => setAuthView('login')} className="flex items-center justify-center gap-2 text-xs text-zinc-300 hover:text-white transition-colors mx-auto"><ChevronLeft size={14} /> Back to Sign In</button>
                )}
              </div>
            </div>
          )}

          {state === WalletState.CONNECTED && walletView === 'dashboard' && (
            <div className="p-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-zinc-900/40 border border-white/10 mb-6 relative overflow-hidden group flex flex-col">
                <div className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex flex-col">
                      <div className="text-[9px] uppercase text-zinc-300 font-bold tracking-widest">Total Value</div>
                      <div className="text-3xl font-extrabold tracking-tighter leading-none text-white">$5,352.60</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] uppercase text-zinc-300 font-bold tracking-widest mb-1 font-mono">{currentAddress.short}</div>
                      <div className="text-[9px] text-green-400 font-bold">+2.4%</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 border-t border-white/10 bg-white/5">
                  <button onClick={() => setWalletView('send')} className="flex items-center justify-center gap-2 py-3.5 hover:bg-white/10 transition-colors border-r border-white/10 text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-300">
                    <ArrowUp size={14} className="text-zinc-300" /> Send
                  </button>
                  <button onClick={() => setWalletView('receive')} className="flex items-center justify-center gap-2 py-3.5 hover:bg-white/10 transition-colors text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-300">
                    <ArrowDown size={14} className="text-zinc-300" /> Receive
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-8">
                <ActionButton 
                  icon={<Database size={18} />} 
                  label="Storage" 
                  onClick={() => window.open('https://firebase.google.com/docs', '_blank')}
                />
                <ActionButton 
                  icon={<TrendingUp size={18} />} 
                  label="Lending" 
                  onClick={() => window.open('https://docs.vesu.xyz/', '_blank')}
                />
                <ActionButton 
                  icon={<Layers size={18} />} 
                  label="Staging" 
                  onClick={() => window.open('https://docs.vesu.xyz/', '_blank')}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-zinc-300 font-bold">
                  <span>Your Assets</span>
                  <button className="hover:text-white transition-colors text-zinc-300">See all</button>
                </div>
                <div className="space-y-px bg-white/5 border border-white/5">
                  {MOCK_TOKENS.map((token) => (
                    <div key={token.symbol} className="flex items-center justify-between p-3 bg-black hover:bg-zinc-900/50 transition-colors cursor-pointer border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 border border-white/10 flex items-center justify-center font-bold text-sm bg-zinc-950 text-white">{token.icon}</div>
                        <div>
                          <div className="font-bold text-sm tracking-tight text-white">{token.name}</div>
                          <div className="text-[10px] text-zinc-300 uppercase tracking-tighter">{token.balance} {token.symbol}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold tracking-tighter text-white">${token.valueUsd}</div>
                        <div className="text-[10px] text-green-400">+1.2%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {state === WalletState.CONNECTED && walletView === 'send' && (
            <div className="p-6 animate-in slide-in-from-right-4 duration-300">
              <button onClick={() => setWalletView('dashboard')} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-300 hover:text-white mb-8 transition-colors">
                <ChevronLeft size={14} /> Back to Assets
              </button>
              <h3 className="text-xl font-bold mb-6 uppercase tracking-tight text-white">Send Assets</h3>
              <form onSubmit={handleSend} className="space-y-6">
                <div className="space-y-1 relative">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-300 font-bold">Token</label>
                  <button 
                    type="button"
                    onClick={() => setIsTokenSelectorOpen(!isTokenSelectorOpen)}
                    className="w-full p-4 bg-zinc-950 border border-white/10 text-sm flex justify-between items-center hover:bg-white/5 transition-colors group"
                  >
                    <span className="flex items-center gap-2 text-white">
                      <span className="w-5 h-5 bg-white text-black text-[10px] flex items-center justify-center font-bold">{selectedToken.icon}</span> 
                      {selectedToken.symbol}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-300 text-[10px] uppercase tracking-widest font-bold">Balance: {selectedToken.balance}</span>
                      <ChevronDown size={14} className={`text-zinc-300 group-hover:text-white transition-transform ${isTokenSelectorOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {/* Token Dropdown */}
                  {isTokenSelectorOpen && (
                    <div className="absolute top-full left-0 right-0 z-[120] mt-1 bg-black border border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-2">
                      {MOCK_TOKENS.map((token) => (
                        <button
                          key={token.symbol}
                          type="button"
                          onClick={() => selectToken(token)}
                          className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 bg-zinc-800 text-white text-[10px] flex items-center justify-center font-bold">{token.icon}</span>
                            <div className="text-left">
                              <div className="text-sm font-bold tracking-tight text-white">{token.symbol}</div>
                              <div className="text-[9px] text-zinc-300 uppercase tracking-widest">{token.name}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-bold text-zinc-300">{token.balance}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-300 font-bold">To Address</label>
                  <input 
                    type="text" 
                    required
                    value={sendAddress}
                    onChange={(e) => setSendAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full bg-zinc-950 border border-white/10 p-4 text-sm focus:border-white focus:outline-none transition-colors text-white placeholder:text-zinc-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-300 font-bold">Amount</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      step="0.0001"
                      required
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-zinc-950 border border-white/10 p-4 text-sm focus:border-white focus:outline-none transition-colors pr-16 text-white placeholder:text-zinc-400"
                    />
                    <button 
                      type="button" 
                      onClick={setMaxAmount}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] uppercase font-bold text-zinc-300 hover:text-white transition-colors"
                    >
                      Max
                    </button>
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : 'Confirm Send'}
                </button>
              </form>
            </div>
          )}

          {state === WalletState.CONNECTED && walletView === 'receive' && (
            <div className="p-6 animate-in slide-in-from-left-4 duration-300 flex flex-col items-center">
              <button onClick={() => setWalletView('dashboard')} className="w-full flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-300 hover:text-white mb-8 transition-colors">
                <ChevronLeft size={14} /> Back to Assets
              </button>
              <h3 className="text-xl font-bold mb-8 uppercase tracking-tight text-white">Receive Assets</h3>
              <div className="w-48 h-48 bg-white p-4 mb-8 flex flex-wrap gap-1 items-center justify-center overflow-hidden">
                {/* Deterministic QR Pattern */}
                {QR_PATTERN.map((bit, i) => (
                  <div key={i} className={`w-4 h-4 ${bit === 1 ? 'bg-black' : 'bg-white'}`} />
                ))}
              </div>
              <div className="w-full space-y-4">
                <div className="text-[10px] uppercase tracking-widest text-zinc-300 font-bold text-center">Your {network === 'mainnet' ? 'Starknet' : 'Sepolia'} Address</div>
                <div className="p-4 bg-zinc-950 border border-white/10 rounded flex items-center justify-between gap-4">
                  <span className="text-[10px] font-mono text-zinc-300 break-all leading-relaxed">{currentAddress.full}</span>
                  <button onClick={copyAddress} className="p-2 hover:bg-white/10 transition-colors text-zinc-300 hover:text-white shrink-0">
                    {copied ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Copy size={18} />}
                  </button>
                </div>
                <button 
                  onClick={() => window.open('https://starknet-faucet.vercel.app/', '_blank')}
                  className="w-full py-3 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest border border-white/10 hover:bg-white/5 transition-all text-zinc-300 hover:text-white"
                >
                  Get Testnet Tokens <ExternalLink size={12} />
                </button>
              </div>
            </div>
          )}

          {state === WalletState.SETTINGS && (
            <div className="p-6 animate-in slide-in-from-right-4 duration-300">
              <button onClick={() => setState(WalletState.CONNECTED)} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-300 hover:text-white mb-10 transition-colors">
                <ChevronLeft size={14} /> Back to Dashboard
              </button>
              
              <div className="space-y-6">
                {/* Minimal Network Section */}
                <div className="space-y-3">
                  <div className="text-[10px] uppercase tracking-widest text-zinc-300 font-bold px-1">Network</div>
                  <div className="p-4 bg-zinc-950 border border-white/10 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${network === 'mainnet' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
                      <span className="text-xs font-bold uppercase tracking-tight text-white">{network === 'mainnet' ? 'Starknet Mainnet' : 'Starknet Sepolia'}</span>
                    </div>
                    <button 
                      onClick={switchNetwork}
                      className="text-[9px] uppercase font-bold text-zinc-300 hover:text-white transition-colors"
                    >
                      Switch
                    </button>
                  </div>
                </div>

                {/* Account Section */}
                <div className="space-y-3">
                  <div className="text-[10px] uppercase tracking-widest text-zinc-300 font-bold px-1">Active Session</div>
                  <div className="p-4 bg-zinc-950 border border-white/10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-300">
                      <User size={16} />
                    </div>
                    <div className="flex flex-col">
                      <div className="text-xs font-bold text-zinc-200 truncate max-w-[200px]">{email || 'anonymous@reflecterlabs.xyz'}</div>
                      <div className="text-[8px] uppercase tracking-widest text-zinc-400">Connected via OTD SDK</div>
                    </div>
                  </div>
                </div>

                {/* Sign Out Action */}
                <div className="pt-10">
                  <button 
                    onClick={() => { setState(WalletState.DISCONNECTED); setAuthView('login'); setWalletView('dashboard'); onClose(); }}
                    className="w-full p-4 border border-red-900/30 bg-red-950/5 text-red-500 text-[10px] uppercase tracking-widest hover:bg-red-950/20 transition-all flex items-center justify-between font-bold"
                  >
                    Terminate Session <LogOut size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-950 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-300 uppercase tracking-widest font-bold">
          <div className="flex items-center gap-2">Open Source product from ReflecterLabs.xyz</div>
          <div>V0.0.1</div>
        </div>
      </div>
      <div 
        onClick={onClose}
        className={`fixed inset-0 bg-black/80 backdrop-blur-2xl z-[90] transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      ></div>
    </>
  );
};

const ActionButton: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void }> = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-2 p-4 border border-white/10 hover:bg-white/5 transition-all bg-zinc-950/50 group"
  >
    <div className="text-zinc-300 group-hover:text-white transition-colors">{icon}</div>
    <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-300 group-hover:text-zinc-100 transition-colors">{label}</span>
  </button>
);

export default WalletPopup;
