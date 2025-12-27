# Integración con ChipiPay + Supabase

Esta guía explica cómo integrar completamente Supabase, Vesu y ChipiPay.

## Flujo de Autenticación Completo

```
1. Usuario accede a la app
2. Inicia sesión con Supabase (email/contraseña o OAuth)
3. Usuario es autenticado y redirigido a /dashboard
4. En el dashboard, puede realizar depósitos en Vesu
5. ChipiPay maneja la transacción gasless
```

## Configuración de Variables de Entorno

Actualiza tu `.env.local` con estas variables:

```env
# Supabase (ya configurado)
NEXT_PUBLIC_SUPABASE_URL=https://xjgdvoswgvyzisdkatxc.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_Cu4kF4iZ4bq08ZFn94gwvw_rhztEdw6

# ChipiPay (agregar cuando tengas las credenciales)
NEXT_PUBLIC_CHIPI_PROJECT_ID=your_chipi_project_id
NEXT_PUBLIC_CHIPI_API_KEY=your_chipi_api_key
```

## Estructura de Datos en Supabase

Recomendamos crear una tabla `user_profiles` para asociar usuarios de Supabase con direcciones de Starknet:

### Tabla: `user_profiles`

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  starknet_address TEXT,
  chipi_wallet_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Componente Integrado

Aquí hay un ejemplo completo que integra todo:

```typescript
'use client';

import { useSupabaseAuth } from '@/useSupabaseAuth';
import { useVesuSponsored, CONFIG } from '@/vesuSponsored';
import { useEffect, useState } from 'react';

export function CompleteVesuIntegration() {
  const { user } = useSupabaseAuth();
  const { deposit, isLoading: txLoading } = useVesuSponsored();
  
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Cargar perfil del usuario desde Supabase
  useEffect(() => {
    if (user) {
      loadUserProfile(user.id);
    }
  }, [user]);

  const loadUserProfile = async (userId: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setUserProfile(data);
    } catch (err) {
      console.error('Error cargando perfil:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (amount: string, tokenKey: string) => {
    if (!userProfile?.starknet_address) {
      alert('Necesitas vincular tu dirección de Starknet primero');
      return;
    }

    if (!userProfile?.chipi_wallet_id) {
      alert('Necesitas configurar tu billetera de ChipiPay');
      return;
    }

    try {
      const token = CONFIG.tokens[tokenKey as keyof typeof CONFIG.tokens];
      const vToken = CONFIG.vTokens[`${tokenKey}_BRAAVOS` as keyof typeof CONFIG.vTokens];

      const sponsorParams = {
        encryptKey: '****', // Del usuario
        wallet: userProfile.chipi_wallet_id,
        bearerToken: '****', // De la sesión de ChipiPay
        userAddress: userProfile.starknet_address,
      };

      await deposit(sponsorParams, vToken, amount, token.decimals);
      
      alert('¡Depósito realizado exitosamente!');
    } catch (err) {
      console.error('Error en depósito:', err);
      alert('Error en la transacción');
    }
  };

  if (loading) return <div>Cargando perfil...</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          <strong>Usuario:</strong> {user?.email}
        </p>
        <p className="text-sm text-blue-800">
          <strong>Dirección Starknet:</strong> {userProfile?.starknet_address || 'No vinculada'}
        </p>
      </div>

      {/* Formulario de depósito */}
      <DepositForm onDeposit={handleDeposit} loading={txLoading} />
    </div>
  );
}
```

## Pasos de Implementación

### Paso 1: Vincular Dirección de Starknet

```typescript
async function linkStarknetAddress(userId: string, address: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('user_profiles')
    .upsert({
      id: userId,
      starknet_address: address,
    });

  if (error) throw error;
}
```

### Paso 2: Guardar Billetera de ChipiPay

```typescript
async function saveChipiWallet(userId: string, walletId: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('user_profiles')
    .update({ chipi_wallet_id: walletId })
    .eq('id', userId);

  if (error) throw error;
}
```

### Paso 3: Realizar Depósito

```typescript
async function depositToVesu(
  userId: string,
  amount: string,
  tokenKey: string
) {
  // 1. Obtener datos del usuario
  const userProfile = await getUserProfile(userId);

  // 2. Crear parámetros de ChipiPay
  const sponsorParams = {
    encryptKey: userPin,
    wallet: userProfile.chipi_wallet_id,
    bearerToken: chipiBearerToken,
    userAddress: userProfile.starknet_address,
  };

  // 3. Ejecutar transacción
  await deposit(
    sponsorParams,
    vTokenAddress,
    amount,
    decimals
  );

  // 4. Registrar en Supabase (opcional)
  await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      type: 'deposit',
      token: tokenKey,
      amount: amount,
      status: 'completed',
    });
}
```

## Seguridad y Mejores Prácticas

1. **Nunca almacenes claves privadas en Supabase**
   - Usa ChipiPay para gestionar billeteras encriptadas

2. **Valida direcciones de Starknet**
   - Verifica que sean direcciones válidas antes de guardar

3. **Usa Row Level Security (RLS) en Supabase**
   ```sql
   ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Users can only access their own profile"
   ON user_profiles FOR ALL
   USING (auth.uid() = id);
   ```

4. **Registra transacciones para auditoría**
   - Mantén un registro de todas las transacciones gasless

5. **Implementa rate limiting**
   - Limita transacciones por usuario para prevenir abuso

## Testing

Para testear la integración:

1. Registra un usuario en `/login`
2. Accede al dashboard
3. Vincula tu dirección de Starknet
4. Intenta realizar un depósito pequeño

## Troubleshooting

### "Transacción rechazada"
- Verifica que la dirección de Starknet sea correcta
- Asegúrate que el token tenga suficientes fondos
- Comprueba que vToken esté configurado correctamente

### "Usuario no autenticado"
- Verifica que las cookies estén habilitadas
- Revisa el middleware en `middleware.ts`
- Comprueba la sesión en el navegador

### "ChipiPay error"
- Verifica las variables de entorno
- Comprueba que el bearerToken sea válido
- Revisa los logs de ChipiPay

## Recursos

- [ChipiPay Documentation](https://docs.chipipay.com/)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Next.js SSR Guide](https://nextjs.org/docs/app)
- [Vesu Documentation](https://docs.vesu.xyz/)
