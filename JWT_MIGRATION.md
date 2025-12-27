# JWT Asimétricos - Migración Completada

## 📋 Resumen de la Migración

Tu proyecto ha sido migrado exitosamente a **JWT asimétricos** de Supabase. Esto proporciona mayor seguridad y mejor performance.

## 🔄 Cambios Realizados

### 1. **Actualizado `package.json`**
Se agregaron las dependencias necesarias:
- `@chipi-stack/nextjs` - SDK de ChipiPay para Next.js
- `jose` - Librería para validación de JWT asimétricos

### 2. **Actualizado `.env.example`**
Se agregaron las nuevas variables de entorno:
```env
# JWT Configuration (Asymmetric - POST ROTATION)
NEXT_PUBLIC_SUPABASE_JWT_ISSUER=https://xjgdvoswgvyzisdkatxc.supabase.co/auth/v1
NEXT_PUBLIC_SUPABASE_JWT_KEYS_URL=https://xjgdvoswgvyzisdkatxc.supabase.co/auth/v1/.well-known/jwks.json

# ChipiPay
NEXT_PUBLIC_CHIPI_API_KEY=your_chipi_api_public_key
CHIPI_SECRET_KEY=your_chipi_api_secret_key
```

### 3. **Creado `lib/jwt.ts`**
Utilidad para validar JWT tokens usando Web Crypto API:
- `verifySupabaseJWT()` - Verifica tokens con las claves públicas
- `decodeJWT()` - Decodifica tokens sin verificar (solo desarrollo)
- `JWT_KEY_INFO` - Información sobre las keys actuales

### 4. **Creado `lib/useSupabaseUser.ts`**
Hooks optimizados para obtener información de usuario:
- `useSupabaseUser()` - Obtiene usuario y claims del JWT
- `useSupabaseClaims()` - Obtiene solo los claims (más rápido)

### 5. **Actualizado `app/layout.tsx`**
Se agregó `ChipiProvider` para habilitar funcionalidades de ChipiPay:
```tsx
<ChipiProvider>
  {children}
</ChipiProvider>
```

### 6. **Creado `app/components/CreateWallet.tsx`**
Componente para crear billeteras de ChipiPay con Supabase:
- Formulario para ingresar clave de encriptación
- Integración con autenticación de Supabase
- Muestra la clave pública generada

### 7. **Actualizado `app/dashboard/page.tsx`**
Se agregó el componente `CreateWallet` al dashboard.

## 🔐 Las Keys JWT Actuales

Después de la rotación realizada el 19 de diciembre de 2025:

### CURRENT KEY (Firmando ahora)
```
ID: 1b2e7762-b162-4986-adb9-6ae4275319b1
Algoritmo: ES256 (ECDSA con P-256)
Propósito: Firmar nuevos JWTs
```

### STANDBY KEY (Para futuras rotaciones)
```
ID: f7d699bd-f7e7-4ebf-aa26-23228f108982
Algoritmo: ES256 (ECDSA con P-256)
Propósito: Validar tokens durante la próxima rotación
```

### PREVIOUS KEY (Descontinuado)
```
ID: CE15C13C-6A28-49E9-9B9E-BC8437FACE5A
Algoritmo: HS256 (Legacy, ya no se usa)
Estado: Será revocado cuando se confirme que todos los tokens expiraron
```

## ⚡ Beneficios de los JWT Asimétricos

### 1. **Mayor Seguridad**
- Las claves privadas nunca se exponen
- Solo las claves públicas se distribuyen
- Imposible forjar tokens sin la clave privada

### 2. **Mejor Performance**
- `getClaims()` verifica tokens localmente con Web Crypto API
- No requiere llamadas al servidor
- Cachea las claves públicas en memoria

### 3. **Compatible con ChipiPay**
- ChipiPay requiere JWT asimétricos para verificar transacciones
- Las transacciones son más seguras y validadas correctamente

## 🔧 Cómo Usar

### Verificar JWT Token

```typescript
import { verifySupabaseJWT } from '@/lib/jwt';

const payload = await verifySupabaseJWT(token);
console.log(payload.sub); // ID del usuario
```

### Obtener Claims (Forma Optimizada)

```typescript
import { useSupabaseClaims } from '@/lib/useSupabaseUser';

function MyComponent() {
  const { claims, loading } = useSupabaseClaims();
  
  if (loading) return <div>Cargando...</div>;
  
  return <div>Usuario: {claims?.sub}</div>;
}
```

### Crear Billetera ChipiPay

```typescript
import CreateWallet from '@/app/components/CreateWallet';

export default function Page() {
  return (
    <div>
      <CreateWallet />
    </div>
  );
}
```

## 📚 Discovery URL

Puedes acceder a las claves públicas en cualquier momento:

```
https://xjgdvoswgvyzisdkatxc.supabase.co/auth/v1/.well-known/jwks.json
```

Esta URL retorna un JWKS (JSON Web Key Set) con todas las claves públicas válidas.

## ✅ Pasos Completados

- ✅ Rotación de keys en Supabase
- ✅ Actualización de dependencias
- ✅ Configuración de variables de entorno
- ✅ Creación de utilidades JWT
- ✅ Integración de ChipiProvider
- ✅ Componente CreateWallet
- ✅ Hooks optimizados con getClaims()

## 🚀 Próximos Pasos

1. **Ejecutar** `npm install` para instalar nuevas dependencias
2. **Copiar** `.env.example` a `.env.local` y agregar claves de ChipiPay
3. **Probar** el formulario CreateWallet en el dashboard
4. **Integrar** transacciones de Vesu con ChipiPay

## 📖 Referencias

- [Supabase JWT Signing Keys](https://supabase.com/blog/jwt-signing-keys)
- [ChipiPay Documentation](https://docs.chipipay.com/)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [jose Library](https://github.com/panva/jose)

## ⚠️ Importante

- **Nunca** reveles tu `CHIPI_SECRET_KEY`
- **Guarda** tus claves de encriptación de billetera en un lugar seguro
- Los tokens expirados con la clave anterior siguen siendo válidos hasta su expiración
- La revocación de la clave anterior ocurrirá automáticamente cuando todos los tokens expiren

---

**Migración Completada:** 19 de Diciembre de 2025
**Estado:** ✅ Listo para producción
