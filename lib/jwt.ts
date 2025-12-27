import { createRemoteJWKSet, jwtVerify } from 'jose';

// Configuración del JWT asimétrico de Supabase
const SUPABASE_JWT_ISSUER = process.env.NEXT_PUBLIC_SUPABASE_JWT_ISSUER || 
  'https://xjgdvoswgvyzisdkatxc.supabase.co/auth/v1';

const SUPABASE_JWT_KEYS_URL = process.env.NEXT_PUBLIC_SUPABASE_JWT_KEYS_URL ||
  'https://xjgdvoswgvyzisdkatxc.supabase.co/auth/v1/.well-known/jwks.json';

// Cache de las claves públicas para mejorar performance
let cachedJWKSet: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJWKSet() {
  if (!cachedJWKSet) {
    cachedJWKSet = createRemoteJWKSet(new URL(SUPABASE_JWT_KEYS_URL));
  }
  return cachedJWKSet;
}

/**
 * Verifica un JWT de Supabase usando las claves públicas asimétricas.
 * Esta función utiliza Web Crypto API para validar tokens localmente,
 * lo que es más rápido que hacer una llamada al servidor.
 * 
 * @param token - JWT token a verificar
 * @returns Payload decodificado del JWT
 * @throws Error si el token es inválido
 */
export async function verifySupabaseJWT(token: string) {
  try {
    const verified = await jwtVerify(token, getJWKSet(), {
      issuer: SUPABASE_JWT_ISSUER,
    });
    return verified.payload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    throw new Error('Invalid JWT token');
  }
}

/**
 * Extrae el payload de un JWT sin verificarlo.
 * SOLO PARA DESARROLLO - No usar en producción sin verificar primero.
 * 
 * @param token - JWT token
 * @returns Payload decodificado
 */
export function decodeJWT(token: string) {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format');
  }

  try {
    const decoded = JSON.parse(
      Buffer.from(parts[1], 'base64').toString('utf-8')
    );
    return decoded;
  } catch (error) {
    throw new Error('Failed to decode JWT');
  }
}

/**
 * Información sobre las JWT Keys actuales de Supabase
 */
export const JWT_KEY_INFO = {
  currentKeyId: '1b2e7762-b162-4986-adb9-6ae4275319b1',
  standbyKeyId: 'f7d699bd-f7e7-4ebf-aa26-23228f108982',
  rotatedAt: new Date('2025-12-19'),
  algorithm: 'ES256', // ECDSA con P-256
  issuer: SUPABASE_JWT_ISSUER,
} as const;
