import { constants } from "starknet";
import { getCurrentNetwork } from "@/lib/hooks/useNetwork.tsx";

export type TokenConfig = {
    address: string;
    decimals: number;
    faucet?: { url: string; label: string } | null;
    note?: string;
    /** If false, we block actions for this asset on this network */
    available?: boolean;
    displayName?: string;
};

export type NetworkConfig = {
    network: string;
    vTokens: {
        USDC: string;
        ETH: string;
        STRK: string;
    };
    tokens: {
        USDC: TokenConfig;
        ETH: TokenConfig;
        STRK: TokenConfig;
    };
    explorer: string;
};

const envAddress = (key: string, fallback: string) => {
    const value = process.env[key];
    return value && value.trim() !== '' ? value.trim() : fallback;
};

const isConfigured = (address: string) => {
    if (!address) return false;
    const lower = address.toLowerCase();
    return !(lower.startsWith('0x0...') || lower.includes('placeholder'));
};

// Starknet Sepolia Verification
// USDC (Circle): 0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8 (Standard Testnet USDC)
// ETH: 0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7 (Standard Starknet ETH)

const SEPOLIA_CONFIG: NetworkConfig = {
    network: constants.NetworkName.SN_SEPOLIA,
    vTokens: {
        // Placeholders for Vesu vTokens (as public addresses aren't indexed yet)
        // User might need to replace these if they have specific deployments
        USDC: envAddress('NEXT_PUBLIC_STARKNET_SEPOLIA_USDC_VTOKEN', "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"),
        ETH: envAddress('NEXT_PUBLIC_STARKNET_SEPOLIA_ETH_VTOKEN', "0x0abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789"),
        STRK: envAddress('NEXT_PUBLIC_STARKNET_SEPOLIA_STRK_VTOKEN', "0x0strkplaceholder000000000000000000000000000000000000000000000000"),
    },
    tokens: {
        // Real Starknet Sepolia Addresses
        USDC: {
            address: envAddress('NEXT_PUBLIC_STARKNET_SEPOLIA_USDC', "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8"),
            decimals: 6,
            faucet: null,
            note: "Sin faucet público estable para USDC testnet; usar ETH de faucet o minter privado",
        },
        ETH: {
            address: envAddress('NEXT_PUBLIC_STARKNET_SEPOLIA_ETH', "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"),
            decimals: 18,
            faucet: {
                url: "https://starknet-faucet.vercel.app/",
                label: "Faucet ETH (Starknet Sepolia)",
            },
            note: "ETH de prueba vía faucet (Sepolia Starknet)",
        },
        STRK: {
            address: envAddress('NEXT_PUBLIC_STARKNET_SEPOLIA_STRK', "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d"),
            decimals: 18,
            faucet: {
                url: "https://starknet-faucet.vercel.app/",
                label: "Faucet STRK (Starknet Sepolia)",
            },
            note: "Token nativo de Starknet para fees y staking",
        },
    },
    explorer: "https://sepolia.starkscan.co",
};

const MAINNET_CONFIG: NetworkConfig = {
    network: constants.NetworkName.SN_MAIN,
    vTokens: {
        USDC: envAddress('NEXT_PUBLIC_STARKNET_MAINNET_USDC_VTOKEN', "0x0..."),
        ETH: envAddress('NEXT_PUBLIC_STARKNET_MAINNET_ETH_VTOKEN', "0x0..."),
        STRK: envAddress('NEXT_PUBLIC_STARKNET_MAINNET_STRK_VTOKEN', "0x0..."),
    },
    tokens: {
        USDC: {
            address: envAddress('NEXT_PUBLIC_STARKNET_MAINNET_USDC', "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8"), // Validar contra address oficial
            decimals: 6,
            faucet: null,
            note: "Mainnet: requiere USDC real; sin faucet",
        },
        ETH: {
            address: envAddress('NEXT_PUBLIC_STARKNET_MAINNET_ETH', "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"),
            decimals: 18,
            faucet: null,
            note: "Mainnet: requiere ETH real (sin faucet)",
        },
        STRK: {
            address: envAddress('NEXT_PUBLIC_STARKNET_MAINNET_STRK', "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d"),
            decimals: 18,
            faucet: null,
            note: "Token nativo de Starknet para fees y staking en Mainnet",
        },
    },
    explorer: "https://starkscan.co",
};

// Función para obtener la configuración actual basada en la red seleccionada
export function getVesuConfig(): NetworkConfig {
    const network = getCurrentNetwork();
    const base = network === 'MAINNET' ? MAINNET_CONFIG : SEPOLIA_CONFIG;

    // Derive availability from configured addresses
    const tokens = Object.fromEntries(Object.entries(base.tokens).map(([k, v]) => {
        const available = v.available !== false && isConfigured(v.address);
        return [k, { ...v, available }];
    })) as NetworkConfig['tokens'];

    const vTokens = Object.fromEntries(Object.entries(base.vTokens).map(([k, v]) => [k, envAddress(`NEXT_PUBLIC_STARKNET_${network}_${k}_VTOKEN`, v)])) as NetworkConfig['vTokens'];

    return { ...base, tokens, vTokens };
}

// Export por defecto para compatibilidad (usa la función dinámica)
export const VESU_CONFIG = getVesuConfig();
