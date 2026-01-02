# OpenTheDoorz SDK

**OpenTheDoorz SDK** es un SDK serverless de código abierto diseñado para desarrolladores que quieren construir aplicaciones Web3 modernas con infraestructura lista para producción.

## ¿Qué es OpenTheDoorz SDK?

Una solución completa que te permite crear aplicaciones Web3 sin preocuparte por la infraestructura backend. Incluye:

- **🔐 Social Login**: Autenticación sin fricción usando Firebase Auth (email/password, Google, etc.)
- **💾 Almacenamiento Serverless**: Firebase (actual) con roadmap para Supabase y otros providers
- **⛓️ Integración On-Chain**: Servicios blockchain como Vesu (lending protocol) en Starknet
- **💸 Transacciones Gasless**: ChipiPay SDK para experiencia de usuario sin gas fees
- **👛 Wallet Management**: Creación y gestión de wallets con encriptación derivada del usuario

## Características Principales

- **Serverless-first**: Sin servidores que mantener, escalado automático
- **Framework-agnostic**: Usa con Next.js, React, o tu framework preferido
- **Multi-chain ready**: Arquitectura preparada para soportar múltiples blockchains
- **Developer-friendly**: Hooks de React, TypeScript, documentación completa
- **Open Source**: Contribuciones bienvenidas, trunk-based workflow

## Stack Tecnológico Actual

| Componente | Tecnología | Estado |
|------------|------------|--------|
| Auth | Firebase Auth | ✅ Activo |
| Storage | Firebase | ✅ Activo |
| Blockchain | Starknet | ✅ Activo |
| Gasless TX | ChipiPay | ✅ Activo |
| DeFi Protocol | Vesu Lending | ✅ Activo |

## Roadmap

- [ ] Supabase como opción de almacenamiento alternativo
- [ ] Publicación en npm como `@openthedoorz/sdk`
- [ ] Multi-wallet support (gestión de múltiples wallets)
- [ ] Soporte para otros proveedores de auth (Privy, Dynamic, etc.)
- [ ] Integración con más protocolos DeFi

## 🆕 Selector de Red (Nuevo)
Ahora puedes cambiar entre **Mainnet** y **Sepolia Testnet** directamente desde la interfaz:
- El selector de red está en el panel derecho del dashboard
- La configuración se guarda automáticamente en localStorage
- Al cambiar de red, la aplicación se recarga para aplicar la configuración
- **Sepolia**: Para desarrollo y pruebas (usa faucets para obtener tokens gratis)
- **Mainnet**: Red de producción (requiere tokens reales con valor económico)

### Fondos por activo (Starknet)
- **ETH (Sepolia)**: ✅ Tiene faucet → https://starknet-faucet.vercel.app/
- **STRK (Sepolia)**: ✅ Disponible vía faucet → https://starknet-faucet.vercel.app/
- **USDC (Sepolia)**: ⚠️ No hay faucet público estable; usar ETH de faucet o un minter/puente privado.
- **Mainnet (ETH/USDC/STRK)**: No hay faucets. Requiere fondos reales / puente desde L1 o CEX con retiro a Starknet.

### Direcciones de contratos (override por `.env.local`)
El SDK trae defaults para ETH/USDC en Starknet, pero puedes sobreescribirlos sin tocar código:

```bash
# Sepolia
NEXT_PUBLIC_STARKNET_SEPOLIA_ETH=0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
NEXT_PUBLIC_STARKNET_SEPOLIA_USDC=0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8
NEXT_PUBLIC_STARKNET_SEPOLIA_STRK=0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d
NEXT_PUBLIC_STARKNET_SEPOLIA_ETH_VTOKEN=<vToken_eth_testnet>
NEXT_PUBLIC_STARKNET_SEPOLIA_USDC_VTOKEN=<vToken_usdc_testnet>
NEXT_PUBLIC_STARKNET_SEPOLIA_STRK_VTOKEN=<vToken_strk_testnet>

# Mainnet
NEXT_PUBLIC_STARKNET_MAINNET_ETH=0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
NEXT_PUBLIC_STARKNET_MAINNET_USDC=0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8
NEXT_PUBLIC_STARKNET_MAINNET_STRK=0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d
NEXT_PUBLIC_STARKNET_MAINNET_ETH_VTOKEN=<vToken_eth_mainnet>
NEXT_PUBLIC_STARKNET_MAINNET_USDC_VTOKEN=<vToken_usdc_mainnet>
NEXT_PUBLIC_STARKNET_MAINNET_STRK_VTOKEN=<vToken_strk_mainnet>
```

Nota: STRK queda deshabilitado hasta que se definan sus direcciones; las acciones se bloquean si el address es placeholder.

## Quick Start

### 1. Instalación
```bash
npm install
```

### 2. Variables de Entorno
Crea un archivo `.env.local` con tus credenciales:
```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# ChipiPay Configuration
NEXT_PUBLIC_CHIPI_API_KEY=...
```

Ver [`.env.example`](.env.example) para la lista completa.

### 3. Configuración de Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Authentication** → **Sign-in method**
4. Habilita el proveedor **Email/Password**

### 4. Configuración de ChipiPay
Para que ChipiPay acepte los tokens de Firebase:
1. Ve al [Dashboard de ChipiPay](https://dashboard.chipipay.com/)
2. En la configuración de **JWT / Auth**:
   - **JWKS Endpoint**: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/publicKeys`
   - **Issuer**: `https://securetoken.google.com/<TU_PROJECT_ID>`

### 5. Ejecutar
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Arquitectura

### Componentes Principales

```
┌─────────────────────────────────────────────┐
│         Frontend (Next.js + React)          │
│  ┌─────────────────────────────────────┐   │
│  │  UI Components (Wallet, Dashboard)   │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │   React Hooks (Auth, Balance, TX)    │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│            SDK Layer (lib/)                  │
│  • Firebase: Auth + Storage                  │
│  • ChipiPay: Wallet + Gasless TX             │
│  • Vesu: Lending Protocol Integration        │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│          Blockchain (Starknet)               │
│  • Smart Contracts (ERC20, Vesu Pools)       │
│  • Mainnet / Sepolia Testnet                 │
└─────────────────────────────────────────────┘
```

### Hooks Disponibles

- `useFirebaseAuth()` - Gestión de autenticación
- `useFetchWallet()` - Obtener wallet del usuario
- `useNetwork()` - Cambiar entre Mainnet/Testnet
- `useTokenBalance()` - Consultar balances en tiempo real
- `useVesuPosition()` - Posiciones de lending
- `useVesuTransaction()` - Ejecutar transacciones de lending

## Configuración Avanzada

### Network Switching
El SDK soporta cambio dinámico de red (Mainnet ↔ Sepolia):
- **UI**: Selector visual en el dashboard
- **Persistencia**: Configuración guardada en `localStorage`
- **Sin rebuild**: Cambios aplicados con recarga de página

### Wallet Encryption
La aplicación usa **derivación automática de claves** para UX sin fricción:
- Clave de encriptación derivada del UID de Firebase
- Opcional: personaliza el salt con `NEXT_PUBLIC_ENCRYPT_SALT`
- Default: `vesu_default_salt`

Para entornos de alta seguridad, considera implementar PIN/biometría adicional.

### Contract Addresses
Puedes sobreescribir direcciones de contratos vía `.env.local`:
```bash
# Sepolia Testnet
NEXT_PUBLIC_STARKNET_SEPOLIA_ETH=0x049d36...
NEXT_PUBLIC_STARKNET_SEPOLIA_USDC=0x053c91...
NEXT_PUBLIC_STARKNET_SEPOLIA_STRK=0x04718f...

# Mainnet
NEXT_PUBLIC_STARKNET_MAINNET_ETH=0x049d36...
NEXT_PUBLIC_STARKNET_MAINNET_USDC=0x053c91...
```

Ver sección completa de direcciones arriba.

### Testnet Faucets
- **ETH/STRK (Sepolia)**: [starknet-faucet.vercel.app](https://starknet-faucet.vercel.app/)
- **USDC (Sepolia)**: No hay faucet público; usar ETH de faucet o bridge privado

## Contribuir

¡Las contribuciones son bienvenidas! Este proyecto sigue un **trunk-based workflow** con feature flags.

### Primeros Pasos
1. Lee la [Guía de Contribución](contrib/CONTRIBUTING.md)
2. Revisa las [Feature Flags](contrib/feature-flags.yaml) para ver qué se está desarrollando
3. Verifica la [Actividad de Contribuidores](contrib/CONTRIBUTOR_ACTIVITY.yaml) para evitar conflictos

### Flujo de Trabajo
```bash
# 1. Crear rama desde trunk
git checkout trunk
git pull
git checkout -b feat/mi-feature

# 2. Desarrollar detrás de feature flag
# Agregar flag a lib/config/featureFlags.ts y contrib/feature-flags.yaml

# 3. Commit y push
git add .
git commit -m "feat: descripción del cambio"
git push origin feat/mi-feature

# 4. Abrir PR contra trunk
```

Ver [contrib/CONTRIBUTING.md](contrib/CONTRIBUTING.md) para detalles completos.

## Estructura del Proyecto

```
/
├── app/                    # Next.js app router
│   ├── components/        # UI components (Wallet, Dashboard, etc.)
│   ├── dashboard/         # Dashboard page
│   └── login/             # Login page
├── lib/                   # SDK core
│   ├── config/           # Feature flags, configuración
│   ├── firebase/         # Firebase integración
│   ├── hooks/            # React hooks custom
│   ├── services/         # Servicios externos (Gemini AI, etc.)
│   ├── utils/            # Utilidades (derivación de claves, etc.)
│   └── vesu/             # Vesu protocol config
├── contrib/              # Documentación de contribución
│   ├── CONTRIBUTING.md
│   ├── feature-flags.yaml
│   ├── scope-checklist.yaml
│   └── CONTRIBUTOR_ACTIVITY.yaml
└── scripts/              # Scripts de desarrollo
```

## Licencia

[MIT](LICENSE) - OpenTheDoorz SDK

## Soporte

- 📖 [Documentación](contrib/CONTRIBUTING.md)
- 🐛 [Issues](https://github.com/cxto21/supabase-chipipay-vesu-hooks/issues)
- 💬 Discusiones: Abre un issue para preguntas

---

**Hecho con ❤️ por la comunidad OpenTheDoorz**