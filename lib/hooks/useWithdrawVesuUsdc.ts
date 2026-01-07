import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import { useWithdrawVesuUsdc as useWithdrawVesuUsdcSDK } from '@chipi-stack/nextjs';
import { useCallback } from 'react';

/**
 * Hook to manage USDC withdrawal from Vesu protocol via Chipi SDK.
 * Wraps the base SDK hook to automatically handle authentication tokens.
 */
export function useWithdrawVesuUsdc() {
    const { getToken } = useFirebaseAuth();

    const {
        withdrawVesuUsdc: withdrawSDK,
        withdrawVesuUsdcAsync: withdrawAsyncSDK,
        data,
        isLoading,
        isError,
        error,
        isSuccess,
        reset
    } = useWithdrawVesuUsdcSDK();

    /**
     * Promise-based withdrawal function.
     * @param params Withdrawal parameters (encryptKey, wallet, amount, recipient)
     */
    const withdrawVesuUsdcAsync = useCallback(async (params: any) => {
        const bearerToken = await getToken();
        if (!bearerToken) throw new Error('Authentication token not available');

        return await withdrawAsyncSDK({
            params,
            bearerToken
        });
    }, [getToken, withdrawAsyncSDK]);

    /**
     * Execute withdrawal operation and update internal state.
     * @param params Withdrawal parameters (encryptKey, wallet, amount, recipient)
     */
    const withdrawVesuUsdc = useCallback(async (params: any) => {
        const bearerToken = await getToken();
        if (!bearerToken) throw new Error('Authentication token not available');

        return withdrawSDK({
            params,
            bearerToken
        });
    }, [getToken, withdrawSDK]);

    return {
        withdrawVesuUsdc,
        withdrawVesuUsdcAsync,
        data,
        isLoading,
        isError,
        error,
        isSuccess,
        reset
    };
}
