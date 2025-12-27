'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';

/**
 * Hook optimizado para obtener información del usuario usando getClaims()
 * en lugar de getUser(), que es más rápido con JWT asimétricos.
 * 
 * getClaims() utiliza Web Crypto API para verificar tokens localmente,
 * mientras que getUser() hace una llamada al servidor.
 */
export const useSupabaseUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [claims, setClaims] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = createClient();
        
        // Obtener claims del JWT (más rápido que getUser)
        const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
        
        if (claimsError) throw claimsError;
        setClaims(claimsData);

        // Obtener sesión para el usuario
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        setUser(session?.user ?? null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al obtener usuario';
        setError(message);
        console.error('Error en useSupabaseUser:', err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Escuchar cambios de autenticación
    const { data: authListener } = createClient().auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return { user, claims, loading, error };
};

/**
 * Hook para obtener solo los claims del JWT sin hacer llamadas al servidor
 */
export const useSupabaseClaims = () => {
  const [claims, setClaims] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshClaims = useCallback(async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error: claimsError } = await supabase.auth.getClaims();
      
      if (claimsError) throw claimsError;
      setClaims(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener claims';
      setError(message);
      console.error('Error en useSupabaseClaims:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshClaims();
  }, [refreshClaims]);

  return { claims, loading, error, refreshClaims };
};
