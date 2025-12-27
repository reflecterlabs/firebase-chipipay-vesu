# Integración de Supabase - Guía de Configuración

Esta guía explica cómo se ha integrado Supabase con el proyecto Vesu Hooks y cómo usarlo.

## Estructura de Archivos

```
vesu-hooks/
├── app/
│   ├── layout.tsx              # Layout principal
│   ├── globals.css             # Estilos globales con Tailwind
│   ├── page.tsx                # Página de inicio (redirige)
│   ├── login/
│   │   └── page.tsx            # Página de login/registro
│   ├── dashboard/
│   │   └── page.tsx            # Dashboard protegido
│   └── auth/
│       └── callback/
│           └── route.ts         # Callback para OAuth
├── utils/supabase/
│   ├── server.ts               # Cliente Supabase (servidor)
│   ├── client.ts               # Cliente Supabase (cliente)
│   └── middleware.ts           # Middleware de auth (SSR)
├── middleware.ts               # Middleware de Next.js
├── useSupabaseAuth.ts          # Hook de autenticación
├── supabaseClient.ts           # Cliente de Supabase deprecated (usar utils/supabase)
├── .env.example                # Ejemplo de variables de entorno
└── package.json                # Dependencias actualizadas
```

## Configuración Inicial

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xjgdvoswgvyzisdkatxc.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_Cu4kF4iZ4bq08ZFn94gwvw_rhztEdw6
```

### 2. Instalar Dependencias

```bash
npm install
```

Esto instalará todas las dependencias necesarias:
- `@supabase/supabase-js` - Cliente de Supabase
- `@supabase/ssr` - Helpers para SSR
- `@supabase/auth-helpers-nextjs` - Integración con Next.js
- `tailwindcss` - Para los estilos (ya incluido en el proyecto)

### 3. Ejecutar el Servidor de Desarrollo

```bash
npm run dev
```

Accede a `http://localhost:3000` en tu navegador.

## Flujo de Autenticación

### Registro / Login

1. El usuario accede a `/login`
2. Puede registrarse con email/contraseña o usar OAuth (GitHub/Google)
3. Si registra con email/contraseña, recibe un email de confirmación
4. Una vez autenticado, es redirigido a `/dashboard`
5. El dashboard está protegido - si no está autenticado, es redirigido a `/login`

### Funciones de Autenticación en `useSupabaseAuth`

```typescript
const {
  user,              // Usuario autenticado o null
  loading,           // Estado de carga
  error,             // Error si algo falla
  signUp,            // Registrar nuevo usuario
  signIn,            // Login con email/contraseña
  signOut,           // Cerrar sesión
  signInWithOAuth,   // Login con OAuth (github | google)
} = useSupabaseAuth();
```

## Integración con Vesu/ChipiPay

Para integrar completamente con ChipiPay, necesitas:

1. Configurar las variables de ChipiPay en `.env.local`
2. Usar el usuario autenticado de Supabase para identificar transacciones
3. Asociar direcciones de Starknet a usuarios de Supabase

### Ejemplo Futuro

```typescript
'use client';

import { useSupabaseAuth } from '@/useSupabaseAuth';
import { useVesuSponsored } from '@/vesuSponsored';

function VesuIntegration() {
  const { user } = useSupabaseAuth();
  const { deposit, isLoading } = useVesuSponsored();

  const handleDeposit = async () => {
    if (!user) return;

    const sponsorParams = {
      encryptKey: userPin,
      wallet: chipiWallet,
      bearerToken: chipiBearerToken,
      userAddress: userStarknetAddress,
    };

    await deposit(sponsorParams, vTokenAddress, "25.0", 6);
  };

  return <button onClick={handleDeposit}>Depositar</button>;
}
```

## Configurar OAuth en Supabase

Para habilitar GitHub y Google OAuth:

1. Ve a tu proyecto de Supabase
2. Navega a **Authentication > Providers**
3. Habilita **GitHub** y **Google**
4. Configura los Client ID y Secrets según corresponda
5. Asegúrate de que la URL de redirección sea: `https://xjgdvoswgvyzisdkatxc.supabase.co/auth/v1/callback`

## Seguridad

- Las credenciales de Supabase se almacenan en variables de entorno
- El middleware de Supabase verifica la sesión en cada petición
- Las cookies de sesión se manejan automáticamente
- Las contraseñas se almacenan encriptadas en Supabase

## Troubleshooting

### "Missing Supabase credentials"

Asegúrate de que `.env.local` existe y contiene las variables correctas.

### OAuth no funciona

- Verifica que los Client IDs estén configurados en Supabase
- Revisa que la URL de redirección sea correcta
- Comprueba la consola del navegador para ver errores

### La sesión no persiste

El middleware en `middleware.ts` maneja la persistencia de sesión. Asegúrate de que exista y esté correctamente configurado.

## Próximos Pasos

1. Conectar ChipiPay para transacciones gasless
2. Crear tabla de usuarios con direcciones de Starknet asociadas
3. Implementar flujo completo de depósito/retiro con Vesu
4. Agregar validaciones de seguridad adicionales
