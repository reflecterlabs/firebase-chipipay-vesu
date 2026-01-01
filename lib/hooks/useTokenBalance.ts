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

    // Helper: safely convert a decimal string/number to base units as BigInt
    function parseAmountToBigInt(balance: string | number | bigint, decimals: number): bigint {
        if (typeof balance === 'bigint') return balance;
    
        const scale = BigInt(10) ** BigInt(decimals);
        const str = typeof balance === 'number' ? balance.toString() : (balance ?? '0').toString();
    
        if (str.includes('.')) {
            const [whole, frac = ''] = str.split('.');
            const wholeBig = BigInt(whole || '0') * scale;
            const fracPadded = (frac + '0'.repeat(decimals)).slice(0, decimals);
            const fracBig = BigInt(fracPadded || '0');
            return wholeBig + fracBig;
        }
        return BigInt(str || '0');
    }

    // Format balance to human-readable string
    const formatBalance = (balance: string, decimals: number): string => {
        if (!balance || balance === '0') return '0.00';
        
        try {
            // FIX: handle decimal strings and use BigInt-only math
            const num = parseAmountToBigInt(balance, decimals);
            const divisor = BigInt(10) ** BigInt(decimals);
    
            const wholePart = num / divisor;
            const fracPart = num % divisor;
    
            const fracStr = fracPart.toString().padStart(decimals, '0').replace(/0+$/, '');
            return fracStr ? `${wholePart.toString()}.${fracStr}` : wholePart.toString();
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
