# OpenTheDoorz SDK

**OpenTheDoorz SDK** is an open-source serverless SDK designed for developers who want to build modern Web3 applications with production-ready infrastructure.

## What is OpenTheDoorz SDK?

A complete solution that lets you create Web3 applications without worrying about backend infrastructure. Includes:

- **🔐 Social Login**: Frictionless authentication using Firebase Auth (email/password, Google, etc.)
- **💾 Serverless Storage**: Firebase (current) with roadmap for Supabase and other providers
- **⛓️ On-Chain Integration**: Blockchain services like Vesu (lending protocol) on Starknet
- **💸 Gasless Transactions**: ChipiPay SDK for user experience without gas fees
- **👛 Wallet Management**: Wallet creation and management with user-derived encryption

## Key Features

- **Serverless-first**: No servers to maintain, automatic scaling
- **Framework-agnostic**: Use with Next.js, React, or your preferred framework
- **Multi-chain ready**: Architecture prepared to support multiple blockchains
- **Developer-friendly**: React hooks, TypeScript, complete documentation
- **Open Source**: Contributions welcome, trunk-based workflow

## Current Tech Stack

| Component | Technology | Status |
|-----------|------------|--------|
| Auth | Firebase Auth | ✅ Active |
| Storage | Firebase | ✅ Active |
| Blockchain | Starknet | ✅ Active |
| Gasless TX | ChipiPay | ✅ Active |
| DeFi Protocol | Vesu Lending | ✅ Active |

## Roadmap

- [ ] Supabase as alternative storage option
- [ ] Publish to npm as `@openthedoorz/sdk`
- [ ] Multi-wallet support (multiple wallet management)
- [ ] Support for other auth providers (Privy, Dynamic, etc.)
- [ ] Integration with more DeFi protocols

## 🆕 Network Selector
Current build is **Mainnet-only** (Sepolia disabled) for production readiness:
- Network selector is in the dashboard's right panel
- Configuration is automatically saved to localStorage
- When changing networks, the application reloads to apply settings
- **Sepolia**: (Disabled in this build)
- **Mainnet**: Production network (requires real tokens with economic value)

### Funds by Asset (Starknet)
- **ETH (Sepolia)**: ✅ Has faucet → https://starknet-faucet.vercel.app/
- **STRK (Sepolia)**: ✅ Available via faucet → https://starknet-faucet.vercel.app/
- **USDC (Sepolia)**: ⚠️ No stable public faucet; use ETH from faucet or a private minter/bridge.
- **Mainnet (ETH/USDC/STRK)**: No faucets. Requires real funds / bridge from L1 or CEX withdrawal to Starknet.

### Contract Addresses (override via `.env.local`)
The SDK comes with defaults for ETH/USDC on Starknet, but you can override them without touching code:

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

Note: STRK remains disabled until addresses are defined; actions are blocked if the address is a placeholder.

## Quick Start

### 1. Installation
```bash
npm install
```

### 2. Environment Variables
Create a `.env.local` file with your credentials:
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

See [`.env.example`](.env.example) for the complete list.

### 3. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** → **Sign-in method**
4. Enable the **Email/Password** provider

### 4. ChipiPay Setup
For ChipiPay to accept Firebase tokens:
1. Go to [ChipiPay Dashboard](https://dashboard.chipipay.com/)
2. In **JWT / Auth** configuration:
   - **JWKS Endpoint**: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/publicKeys`
   - **Issuer**: `https://securetoken.google.com/<YOUR_PROJECT_ID>`

### 5. Run
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

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

### Available Hooks

- `useFirebaseAuth()` - Authentication management
- `useFetchWallet()` - Get user wallet
- `useNetwork()` - Switch between Mainnet/Testnet
- `useTokenBalance()` - Query real-time balances
- `useVesuPosition()` - Lending positions
- `useVesuTransaction()` - Execute lending transactions

## Advanced Configuration

### Network Switching
The SDK supports dynamic network switching (Mainnet ↔ Sepolia):
- **UI**: Visual selector in the dashboard
- **Persistence**: Configuration saved to `localStorage`
- **No rebuild**: Changes applied with page reload

### Wallet Encryption
The application uses **automatic key derivation** for frictionless UX:
- Encryption key derived from Firebase UID
- Optional: customize the salt with `NEXT_PUBLIC_ENCRYPT_SALT`
- Default: `vesu_default_salt`

For high-security environments, consider implementing additional PIN/biometrics.

### Contract Addresses
You can override contract addresses via `.env.local`:
```bash
# Sepolia Testnet
NEXT_PUBLIC_STARKNET_SEPOLIA_ETH=0x049d36...
NEXT_PUBLIC_STARKNET_SEPOLIA_USDC=0x053c91...
NEXT_PUBLIC_STARKNET_SEPOLIA_STRK=0x04718f...

# Mainnet
NEXT_PUBLIC_STARKNET_MAINNET_ETH=0x049d36...
NEXT_PUBLIC_STARKNET_MAINNET_USDC=0x053c91...
```

See complete address section above.

### Testnet Faucets
- **ETH/STRK (Sepolia)**: [starknet-faucet.vercel.app](https://starknet-faucet.vercel.app/)
- **USDC (Sepolia)**: No public faucet; use ETH from faucet or private bridge

## Contributing

Contributions are welcome! This project follows a **trunk-based workflow** with feature flags.

### Getting Started
1. Read the [Contributing Guide](contrib/CONTRIBUTING.md)
2. Review [Feature Flags](contrib/feature-flags.yaml) to see what's being developed
3. Check [Contributor Activity](contrib/CONTRIBUTOR_ACTIVITY.yaml) to avoid conflicts

### Workflow
```bash
# 1. Create branch from trunk
git checkout trunk
git pull
git checkout -b feat/my-feature

# 2. Develop behind feature flag
# Add flag to lib/config/featureFlags.ts and contrib/feature-flags.yaml

# 3. Commit and push
git add .
git commit -m "feat: change description"
git push origin feat/my-feature

# 4. Open PR against trunk
```

See [contrib/CONTRIBUTING.md](contrib/CONTRIBUTING.md) for complete details.

## Project Structure

```
/
├── app/                    # Next.js app router
│   ├── components/        # UI components (Wallet, Dashboard, etc.)
│   ├── dashboard/         # Dashboard page
│   └── login/             # Login page
├── lib/                   # SDK core
│   ├── config/           # Feature flags, configuration
│   ├── firebase/         # Firebase integration
│   ├── hooks/            # Custom React hooks
│   ├── services/         # External services (Gemini AI, etc.)
│   ├── utils/            # Utilities (key derivation, etc.)
│   └── vesu/             # Vesu protocol config
├── contrib/              # Contribution documentation
│   ├── CONTRIBUTING.md
│   ├── feature-flags.yaml
│   ├── scope-checklist.yaml
│   └── CONTRIBUTOR_ACTIVITY.yaml
└── scripts/              # Development scripts
```

## License

[MIT](LICENSE) - OpenTheDoorz SDK

## Support

- 📖 [Documentation](contrib/CONTRIBUTING.md)
- 🐛 [Issues](https://github.com/cxto21/supabase-chipipay-vesu-hooks/issues)
- 💬 Discussions: Open an issue for questions

---

**Built with ❤️ by the OpenTheDoorz community**