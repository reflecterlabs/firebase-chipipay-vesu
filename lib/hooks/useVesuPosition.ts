import { useState, useEffect } from 'react';
import { getVesuConfig } from '@/lib/vesu/config';

export type VesuPosition = {
    asset: string;
    supplyBalance: string;
    debtBalance: string;
    apy: string;
    walletBalance: string; // This will be fetched separately by VesuLending component
};

export function useVesuPosition(userAddress?: string) {
    const [positions, setPositions] = useState<VesuPosition[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const config = getVesuConfig();

    const fetchPositions = async () => {
        if (!userAddress) return;
        setLoading(true);
        setError(null);
        try {
            const defaults: Record<string, string> = {
                USDC: '5.4%',
                ETH: '3.1%',
                STRK: '2.5%',
            };

            // Only show available tokens (filter out disabled ones)
            const availableTokens = Object.entries(config.tokens)
                .filter(([_, tokenConfig]) => tokenConfig.available !== false)
                .map(([symbol]) => symbol);

            // Note: walletBalance will be '...' as placeholder
            // The VesuLending component will fetch individual balances using useTokenBalance
            const entries = availableTokens.map(asset => ({
                asset,
                supplyBalance: '0.00', // TODO: Read from Vesu vToken contract
                debtBalance: '0.00',   // TODO: Read from Vesu debt tracking
                apy: defaults[asset] || '3.0%',
                walletBalance: '...', // Placeholder - fetched by parent component
            }));

            setPositions(entries);

        } catch (err) {
            console.error(err);
            setError('Failed to fetch Vesu positions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchPositions();
    }, [userAddress, config.network]);

    return { positions, loading, error, refetch: fetchPositions };
}
