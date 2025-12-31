
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Wallet } from 'lucide-react';

interface HeaderProps {
  onOpenWallet: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenWallet }) => {
  const location = useLocation();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
            OPENTHEDOORZ
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className={`text-xs uppercase tracking-[0.2em] transition-colors ${location.pathname === '/' ? 'text-white font-bold' : 'text-zinc-500 hover:text-white'}`}
            >
              Home
            </Link>
            <Link 
              to="/docs" 
              className={`text-xs uppercase tracking-[0.2em] transition-colors ${location.pathname === '/docs' ? 'text-white font-bold' : 'text-zinc-500 hover:text-white'}`}
            >
              Docs
            </Link>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <a 
            href="https://starknet.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1 text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors mr-4"
          >
            Starknet <ArrowUpRight size={12} />
          </a>
          <button 
            onClick={onOpenWallet}
            className="px-6 py-2 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all flex items-center gap-2"
          >
            <Wallet size={14} /> Access
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
