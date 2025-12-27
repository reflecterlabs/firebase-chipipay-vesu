'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useCreateWallet } from '@chipi-stack/nextjs';
import { jwtVerify, createRemoteJWKSet } from 'jose';

/**
 * Componente para crear una billetera de ChipiPay
 * Integra Supabase Auth con ChipiPay para crear billeteras
 * encriptadas y asociadas a usuarios.
 */
export default function CreateWallet() {
  const supabaseClient = createClient();
  const { createWalletAsync, isLoading } = useCreateWallet();
  
  const [encryptKey, setEncryptKey] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [walletData, setWalletData] = useState<any>(null);
  const [jwtInfo, setJwtInfo] = useState<{ alg?: string; kid?: string; iss?: string; aud?: string; exp?: number } | null>(null);
  const [rawJwt, setRawJwt] = useState('');
  const chipiApiKey = process.env.NEXT_PUBLIC_CHIPI_API_KEY || '';

  // Logger de red para solicitudes a ChipiPay (solo dev)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : (input as URL)?.toString?.() || '';
      const method = init?.method || 'GET';
      let apiKeyHeader: string | null = null;
      let authHeader: string | null = null;
      try {
        const headers = init?.headers as HeadersInit | undefined;
        if (headers instanceof Headers) {
          apiKeyHeader = headers.get('x-chipi-api-key') || headers.get('X-CHIPI-API-KEY');
          authHeader = headers.get('authorization') || headers.get('Authorization');
        } else if (Array.isArray(headers)) {
          const lower = headers.map(([k, v]) => [String(k).toLowerCase(), v]);
          apiKeyHeader = (lower.find(([k]) => k === 'x-chipi-api-key')?.[1] as string) || null;
          authHeader = (lower.find(([k]) => k === 'authorization')?.[1] as string) || null;
        } else if (headers && typeof headers === 'object') {
          const hObj = headers as Record<string, string>;
          apiKeyHeader = hObj['x-chipi-api-key'] || hObj['X-CHIPI-API-KEY'] || null;
          authHeader = hObj['authorization'] || hObj['Authorization'] || null;
        }
      } catch {}

      const isChipi = url.includes('chipi-wallets') || url.includes('chipipay') || url.includes('celebrated-vision');
      if (isChipi) {
        console.log('ChipiPay request', {
          method,
          url,
          apiKeyPrefix: (apiKeyHeader || chipiApiKey).slice(0, 8),
          hasAuthorization: !!authHeader,
          authHeaderStartsBearer: authHeader ? /^Bearer\s+/.test(authHeader) : false,
          authHeaderLen: authHeader ? authHeader.length : 0,
        });
      }

      const res = await originalFetch(input, init);
      if (isChipi) {
        try {
          const clone = res.clone();
          const text = await clone.text();
          console.log('ChipiPay response', {
            status: res.status,
            url,
            bodySnippet: text?.slice(0, 240) || '(empty)',
          });
        } catch {}
      }
      return res;
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, [chipiApiKey]);

  async function verifySupabaseJwt(token: string) {
    try {
      const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!SUPABASE_URL) {
        return { ok: false, reason: 'Falta NEXT_PUBLIC_SUPABASE_URL en el entorno' };
      }
      const jwksUrl = new URL('/auth/v1/.well-known/jwks.json', SUPABASE_URL);
      const JWKS = createRemoteJWKSet(jwksUrl);
      const issuer = new URL('/auth/v1', SUPABASE_URL).toString();
      const { payload, protectedHeader } = await jwtVerify(token, JWKS, {
        issuer,
        algorithms: ['ES256'],
      });
      return { ok: true, payload, header: protectedHeader } as const;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error desconocido al verificar JWT';
      return { ok: false, reason: message } as const;
    }
  }

  const handleCreateWallet = async () => {
    if (!encryptKey) {
      setError('Por favor ingresa una clave de encriptación');
      return;
    }

    if (encryptKey.length < 8) {
      setError('La clave debe tener al menos 8 caracteres');
      return;
    }

    try {
      setError('');
      setSuccess('');
      setWalletData(null);

      // Obtener sesión y datos del usuario de Supabase (refrescar si es necesario)
      let { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();
      if (sessionError) throw new Error(`Error de sesión: ${sessionError.message}`);

      if (!sessionData?.session) {
        const { data: refreshed, error: refreshError } = await supabaseClient.auth.refreshSession();
        if (refreshError) throw new Error(`No se pudo refrescar la sesión: ${refreshError.message}`);
        sessionData = refreshed;
      }

      const session = sessionData?.session;
      const bearerToken = session?.access_token;
      const user = session?.user;

      if (!user || !bearerToken) {
        setError('No hay usuario autenticado. Por favor inicia sesión primero.');
        return;
      }

      // Verificar y decodificar JWT para diagnóstico
      try {
        const result = await verifySupabaseJwt(bearerToken);
        if (result.ok) {
          setRawJwt(bearerToken);
          setJwtInfo({
            alg: result.header?.alg,
            kid: result.header?.kid,
            iss: String(result.payload?.iss),
            aud: Array.isArray(result.payload?.aud) ? String(result.payload?.aud[0]) : String(result.payload?.aud),
            exp: typeof result.payload?.exp === 'number' ? result.payload?.exp : undefined,
          });
        } else {
          setError(`JWT inválido localmente: ${result.reason}`);
          return;
        }
      } catch {}

      // Crear billetera con ChipiPay
      const response = await createWalletAsync({
        params: {
          encryptKey,
          externalUserId: user.id,
        },
        bearerToken,
      });

      // Guardar información de la billetera
      setWalletData({
        publicKey: response.wallet.publicKey,
        walletId: response.wallet.id,
        userId: user.id,
        email: user.email,
      });

      setSuccess(`¡Billetera creada exitosamente! Clave pública: ${response.wallet.publicKey}`);
      setEncryptKey('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear billetera';
      setError(errorMessage);
      console.error('Error creando billetera:', error);
    }
  };

  return (
    <div className="space-y-4 p-6 border border-gray-300 rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">Crear Billetera ChipiPay</h2>
      <p className="text-sm text-gray-600">
        Crea una billetera encriptada para realizar transacciones gasless en Vesu.
      </p>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-red-800 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4 text-green-800 text-sm">
          {success}
        </div>
      )}

      {jwtInfo && (
        <div className="rounded-md bg-yellow-50 p-4 space-y-1 text-xs">
          <p className="font-semibold text-yellow-900">JWT detectado</p>
          <p className="text-yellow-800">alg: {jwtInfo.alg} | kid: {jwtInfo.kid}</p>
          <p className="text-yellow-800">iss: {jwtInfo.iss} | aud: {String(jwtInfo.aud)}</p>
          <p className="text-yellow-800">exp: {jwtInfo.exp ? new Date(jwtInfo.exp * 1000).toLocaleString('es-ES') : 'N/A'}</p>
          <p className="text-yellow-800">apiKey: {(chipiApiKey || '').startsWith('pk_') ? (chipiApiKey?.split('_')[1]?.slice(0, 6) + '…') : 'N/A'}</p>
          {rawJwt && (
            <div className="space-y-1 pt-2">
              <p className="text-yellow-800">JWT completo (cópialo para configurar JWKS en ChipiPay):</p>
              <textarea
                readOnly
                className="w-full text-[10px] font-mono border border-yellow-200 rounded p-2 bg-white text-yellow-900"
                rows={4}
                value={rawJwt}
                onFocus={(e) => e.currentTarget.select()}
              />
            </div>
          )}
        </div>
      )}

      {walletData && (
        <div className="rounded-md bg-blue-50 p-4 space-y-2 text-sm">
          <div>
            <span className="font-semibold text-blue-900">Usuario:</span>
            <p className="text-blue-800">{walletData.email}</p>
          </div>
          <div>
            <span className="font-semibold text-blue-900">Clave Pública:</span>
            <p className="text-blue-800 break-all font-mono text-xs">{walletData.publicKey}</p>
          </div>
          <div>
            <span className="font-semibold text-blue-900">ID de Billetera:</span>
            <p className="text-blue-800 break-all font-mono text-xs">{walletData.walletId}</p>
          </div>
        </div>
      )}

      <form
        className="space-y-3"
        method="post"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void handleCreateWallet();
        }}
      >
        <div>
          <label htmlFor="encryptKey" className="block text-sm font-medium text-gray-700 mb-2">
            Clave de Encriptación
          </label>
          <input
            id="encryptKey"
            name="encryptKey"
            type="password"
            autoComplete="new-password"
            placeholder="Ingresa tu clave de encriptación (mín. 8 caracteres)"
            value={encryptKey}
            onChange={(e) => setEncryptKey(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                     focus:border-blue-500 focus:outline-none focus:ring-blue-500 
                     disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500">
            Esta clave encriptará tu billetera. Guárdala en un lugar seguro.
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading || !encryptKey}
          className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md 
                   hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600
                   transition-colors"
        >
          {isLoading ? 'Creando billetera...' : 'Crear Billetera'}
        </button>
      </form>

      <div className="pt-4 border-t border-gray-200 text-xs text-gray-500 space-y-1">
        <p>• Tu billetera será encriptada y almacenada de forma segura</p>
        <p>• Solo tú tienes acceso a tu billetera con tu clave de encriptación</p>
        <p>• Puedes usar esta billetera para transacciones gasless con Vesu</p>
      </div>
    </div>
  );
}
