'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { constants } from 'starknet';

export type NetworkType = 'SEPOLIA' | 'MAINNET';

type NetworkContextType = {
  network: NetworkType;
  setNetwork: (network: NetworkType) => void;
  toggleNetwork: () => void;
  isMainnet: boolean;
  isSepolia: boolean;
};

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [network, setNetworkState] = useState<NetworkType>('MAINNET');

  // Cargar red guardada del localStorage al montar
  useEffect(() => {
    const savedNetwork = localStorage.getItem('starknet_network') as NetworkType;
    if (savedNetwork === 'MAINNET') {
      setNetworkState('MAINNET');
    } else {
      setNetworkState('MAINNET');
      localStorage.setItem('starknet_network', 'MAINNET');
    }
  }, []);

  const setNetwork = (newNetwork: NetworkType) => {
    const enforcedNetwork: NetworkType = 'MAINNET';
    setNetworkState(enforcedNetwork);
    localStorage.setItem('starknet_network', enforcedNetwork);
    // Recargar la página para aplicar cambios de configuración
    window.location.reload();
  };

  const toggleNetwork = () => {
    setNetwork('MAINNET');
  };

  const value = {
    network,
    setNetwork,
    toggleNetwork,
    isMainnet: network === 'MAINNET',
    isSepolia: false,
  };

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork debe usarse dentro de un NetworkProvider');
  }
  return context;
}

// Hook simple para obtener la red actual sin contexto (para uso en configs)
export function getCurrentNetwork(): NetworkType {
  if (typeof window === 'undefined') {
    return 'MAINNET'; // Default en SSR
  }
  const saved = localStorage.getItem('starknet_network') as NetworkType;
  return saved === 'MAINNET' ? 'MAINNET' : 'MAINNET';
}
