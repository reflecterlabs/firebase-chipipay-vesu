'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import CreateWallet from '@/app/components/CreateWallet';
import type { User } from '@supabase/supabase-js';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          router.push('/login');
        } else {
          setUser(session.user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, supabase.auth]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // El router.push redirecciona
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">Bienvenido, {user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900">Información de sesión</h2>
            <dl className="mt-4 space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-600">Email</dt>
                <dd className="text-sm text-gray-900">{user.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-600">ID de usuario</dt>
                <dd className="text-sm text-gray-900">{user.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-600">Fecha de creación</dt>
                <dd className="text-sm text-gray-900">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString('es-ES') : 'N/A'}
                </dd>
              </div>
            </dl>
          </div>

          <CreateWallet />
        </div>

        <div className="mt-6 rounded-lg bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-gray-900">Próximos pasos</h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-gray-600">
            <li>✅ Autenticación con Supabase completada</li>
            <li>✅ JWT asimétricos configurados</li>
            <li>✅ ChipiProvider integrado</li>
            <li>⏳ Crear una billetera ChipiPay (arriba)</li>
            <li>⏳ Conectar con Vesu para depósitos en vTokens</li>
            <li>⏳ Realizar transacciones gasless</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
