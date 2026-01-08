import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import { useStakeVesuUsdc as useStakeVesuUsdcSDK } from '@chipi-stack/nextjs';
import { useCallback } from 'react';

/**
 * Hook to manage USDC staking in Vesu protocol via Chipi SDK.
 * Wraps the base SDK hook to automatically handle authentication tokens.
 */
export function useStakeVesuUsdc() {
    const { getToken } = useFirebaseAuth();

    const {
        stakeVesuUsdc: stakeSDK,
        stakeVesuUsdcAsync: stakeAsyncSDK,
        data,
        isLoading,
        isError,
        error,
        isSuccess,
        reset
    } = useStakeVesuUsdcSDK();

    /**
     * Promise-based staking function.
     * @param params Staking parameters (encryptKey, wallet, amount, receiverWallet)
     */
    const stakeVesuUsdcAsync = useCallback(async (params: any) => {
        const bearerToken = await getToken();
        if (!bearerToken) throw new Error('Authentication token not available');

        return await stakeAsyncSDK({
            params,
            bearerToken
        });
    }, [getToken, stakeAsyncSDK]);

    /**
     * Execute staking operation and update internal state.
     * @param params Staking parameters (encryptKey, wallet, amount, receiverWallet)
     */
    const stakeVesuUsdc = useCallback(async (params: any) => {
        const bearerToken = await getToken();
        if (!bearerToken) throw new Error('Authentication token not available');

        return stakeSDK({
            params,
            bearerToken
        });
    }, [getToken, stakeSDK]);

    return {
        stakeVesuUsdc,
        stakeVesuUsdcAsync,
        data,
        isLoading,
        isError,
        error,
        isSuccess,
        reset
    };
}
