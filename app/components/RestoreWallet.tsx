'use client';

import { useEffect } from 'react';
import { deriveEncryptKey } from '@/lib/utils/deriveEncryptKey';

type WalletProps = {
    wallet: {
        publicKey: string;
        id: string; // Ensure we handle whatever the SDK returns
    };
    userUid?: string;
    onUnlock: (encryptKey: string) => void;
};

export default function RestoreWallet({ wallet, userUid, onUnlock }: WalletProps) {
    useEffect(() => {
        const autoUnlock = async () => {
            if (!userUid) return;
            const encryptKey = await deriveEncryptKey(userUid);
            onUnlock(encryptKey);
        };
        void autoUnlock();
    }, [userUid, onUnlock]);

    return (
        <div className="bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden max-w-md w-full mx-auto relative group hover:shadow-2xl transition-shadow duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-teal-500"></div>

            <div className="p-8">
                <div className="text-center mb-8">
                    <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-green-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Desbloqueando tu billetera…</h2>
                    <p className="text-gray-500 text-sm mt-2">
                        Usando tu sesión para acceder sin PIN.
                    </p>
                </div>

                <div className="mb-6">
                    <div className="flex items-center justify-center space-x-2 bg-gray-50 py-2 px-3 rounded-lg border border-gray-200">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-mono text-gray-600 truncate max-w-[200px]">{wallet.publicKey}</span>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-center space-x-2 bg-gray-50 py-2 px-3 rounded-lg border border-gray-200">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-mono text-gray-600 truncate max-w-[200px]">{wallet.publicKey}</span>
                    </div>
                </div>

                {/* UX sin PIN: no hay sección de recuperación porque el encryptKey se deriva del UID */}
            </div>
        </div>
    );
}
