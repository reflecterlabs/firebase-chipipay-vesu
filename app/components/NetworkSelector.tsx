'use client';

import { useNetwork, NetworkType } from '@/lib/hooks/useNetwork.tsx';

export default function NetworkSelector() {
  const { network, setNetwork } = useNetwork();

  const handleNetworkChange = (newNetwork: NetworkType) => {
    if (newNetwork !== network) {
      const confirmed = window.confirm(
        `¿Cambiar a ${newNetwork === 'MAINNET' ? 'Mainnet' : 'Sepolia Testnet'}?\n\nLa página se recargará para aplicar los cambios.`
      );
      if (confirmed) {
        setNetwork(newNetwork);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-sm font-bold text-gray-800 mb-1">Red Blockchain</h3>
        <p className="text-xs text-gray-500">Selecciona la red de Starknet</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* Sepolia Testnet */}
        <button
          onClick={() => handleNetworkChange('SEPOLIA')}
          className={`
            relative p-3 rounded-lg border-2 transition-all duration-200 text-left
            ${network === 'SEPOLIA'
              ? 'border-orange-500 bg-orange-50 shadow-md'
              : 'border-gray-200 bg-gray-50 hover:border-orange-300 hover:bg-orange-50/50'
            }
          `}
        >
          {network === 'SEPOLIA' && (
            <div className="absolute top-2 right-2">
              <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5">
              <div className={`w-2 h-2 rounded-full ${network === 'SEPOLIA' ? 'bg-orange-500' : 'bg-gray-400'}`}></div>
              <p className={`text-sm font-bold ${network === 'SEPOLIA' ? 'text-orange-700' : 'text-gray-700'}`}>
                Sepolia
              </p>
            </div>
            <p className="text-[10px] text-gray-500 font-medium">Testnet</p>
          </div>
        </button>

        {/* Mainnet */}
        <button
          onClick={() => handleNetworkChange('MAINNET')}
          className={`
            relative p-3 rounded-lg border-2 transition-all duration-200 text-left
            ${network === 'MAINNET'
              ? 'border-green-500 bg-green-50 shadow-md'
              : 'border-gray-200 bg-gray-50 hover:border-green-300 hover:bg-green-50/50'
            }
          `}
        >
          {network === 'MAINNET' && (
            <div className="absolute top-2 right-2">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5">
              <div className={`w-2 h-2 rounded-full ${network === 'MAINNET' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <p className={`text-sm font-bold ${network === 'MAINNET' ? 'text-green-700' : 'text-gray-700'}`}>
                Mainnet
              </p>
            </div>
            <p className="text-[10px] text-gray-500 font-medium">Producción</p>
          </div>
        </button>
      </div>

      {/* Network Info */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-start space-x-2 text-xs">
          <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600 leading-relaxed">
            {network === 'SEPOLIA' ? (
              <>
                <span className="font-semibold">Testnet:</span> Usa tokens de prueba. Obtén ETH gratis en{' '}
                <a href="https://starknet-faucet.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">
                  faucets
                </a>
              </>
            ) : (
              <>
                <span className="font-semibold text-red-600">⚠️ Mainnet:</span> Red real. Requiere tokens reales con valor económico.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
