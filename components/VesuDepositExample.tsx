'use client';

import { useSupabaseAuth } from '@/useSupabaseAuth';
import { useVesuSponsored, CONFIG } from '@/vesuSponsored';
import { useState } from 'react';

/**
 * Ejemplo de componente que integra:
 * 1. Autenticación con Supabase
 * 2. Transacciones gasless con Vesu mediante ChipiPay
 */
export default function VesuDepositExample() {
  const { user, loading: authLoading, error: authError } = useSupabaseAuth();
  const { deposit, isLoading: txLoading, error: txError } = useVesuSponsored();

  const [amount, setAmount] = useState('25.0');
  const [selectedToken, setSelectedToken] = useState('USDC');

  // Datos de ejemplo (en producción estos vendrían de un formulario/API)
  const sponsorParams = {
    encryptKey: 'USER_PIN_HERE', // El PIN del usuario
    wallet: 'CHIPI_WALLET_HERE',
    bearerToken: 'CHIPI_BEARER_TOKEN_HERE',
    userAddress: 'USER_STARKNET_ADDRESS_HERE',
  };

  const handleDeposit = async () => {
    if (!user) {
      alert('Debes estar autenticado para depositar');
      return;
    }

    try {
      const token = CONFIG.tokens[selectedToken as keyof typeof CONFIG.tokens];
      const vToken = CONFIG.vTokens[`${selectedToken}_BRAAVOS` as keyof typeof CONFIG.vTokens];

      if (!vToken.includes('__')) {
        console.log(`Depositando ${amount} de ${selectedToken}...`);
        // await deposit(sponsorParams, vToken, amount, token.decimals);
      } else {
        alert('vToken no configurado para este activo');
      }
    } catch (err) {
      console.error('Error en depósito:', err);
    }
  };

  if (authLoading) return <div>Cargando autenticación...</div>;

  if (!user) {
    return <div>Por favor, inicia sesión primero.</div>;
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="text-2xl font-bold text-gray-900">Depositar en Vesu</h2>

      <div className="mt-6 space-y-4">
        <div>
          <p className="text-sm text-gray-600">Usuario autenticado: {user.email}</p>
        </div>

        <div>
          <label htmlFor="token" className="block text-sm font-medium text-gray-700">
            Selecciona Token
          </label>
          <select
            id="token"
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="USDC">USDC</option>
            <option value="WBTC">WBTC</option>
            <option value="TBTC">tBTC</option>
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Cantidad
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="25.0"
          />
        </div>

        {txError && <div className="rounded-md bg-red-50 p-4 text-red-800">{txError}</div>}

        <button
          onClick={handleDeposit}
          disabled={txLoading}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {txLoading ? 'Procesando...' : `Depositar ${amount} ${selectedToken}`}
        </button>
      </div>
    </div>
  );
}
