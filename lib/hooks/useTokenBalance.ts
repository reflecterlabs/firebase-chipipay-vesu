import { useGetTokenBalance } from '@chipi-stack/nextjs';
import { useFirebaseAuth } from './useFirebaseAuth';
import type { ChainToken } from '@chipi-stack/types';

/**
 * Hook to get token balance for a specific wallet and token
 * Uses ChipiPay's useGetTokenBalance under the hood
 * 
 * IMPORTANT: ChipiPay uses externalUserId (Firebase UID) to identify wallets,
 * not the wallet public key directly.
 */
export function useTokenBalance(chainToken: ChainToken, walletPublicKey?: string) {
    const { user, getToken } = useFirebaseAuth();

    const { data: balanceData, isLoading, error, refetch } = useGetTokenBalance({
        getBearerToken: getToken,
        params: user ? {
            externalUserId: user.uid, // Use Firebase UID to identify the wallet (ChipiPay requirement)
            // Note: Only one of walletPublicKey or externalUserId is allowed by ChipiPay API
            chainToken,
            chain: 'STARKNET',
        } : undefined,
    });

    // Debug logging
    if (error) {
        console.error(`[useTokenBalance] Error fetching ${chainToken} balance:`, error);
    }
    
    if (balanceData) {
        console.log(`[useTokenBalance] ${chainToken} balance fetched:`, {
            balance: balanceData.balance,
            decimals: balanceData.decimals,
            externalUserId: user?.uid,
        });
    }

    // Format balance to human-readable string
    const formatBalance = (balance: string, decimals: number): string => {
        if (!balance || balance === '0') return '0.00';
        
        try {
            const num = BigInt(balance);
            const divisor = BigInt(10 ** decimals);
            const wholePart = num / divisor;
            const fracPart = num % divisor;
            
            // Pad fractional part with leading zeros
            const fracStr = fracPart.toString().padStart(decimals, '0');
            // Take first 2 decimal places
            const displayFrac = fracStr.slice(0, 2);
            
            return `${wholePart}.${displayFrac}`;
        } catch (e) {
            console.error('Error formatting balance:', e);
            return '0.00';
        }
    };

    const formattedBalance = balanceData 
        ? formatBalance(balanceData.balance, balanceData.decimals)
        : '0.00';

    return {
        balance: formattedBalance,
        rawBalance: balanceData?.balance || '0',
        decimals: balanceData?.decimals || 18,
        isLoading,
        error,
        refetch,
    };
}
