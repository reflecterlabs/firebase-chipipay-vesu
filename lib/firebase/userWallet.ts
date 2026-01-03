import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from './config';

/**
 * User wallet data stored in Firestore
 * Collection: users/{userId}/wallet
 */
export type UserWalletData = {
    encryptKey: string; // PIN for wallet encryption
    publicKey: string; // Starknet address
    createdAt: number;
    updatedAt: number;
};

/**
 * Save user's wallet PIN to Firestore
 */
export async function saveUserWalletPin(userId: string, encryptKey: string, publicKey: string): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');
    
    const walletRef = doc(db, 'users', userId, 'wallet', 'chipiPay');
    
    await setDoc(walletRef, {
        encryptKey,
        publicKey,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    });
}

/**
 * Get user's wallet PIN from Firestore
 */
export async function getUserWalletPin(userId: string): Promise<string | null> {
    if (!db) throw new Error('Firebase not initialized');
    
    const walletRef = doc(db, 'users', userId, 'wallet', 'chipiPay');
    const walletSnap = await getDoc(walletRef);
    
    if (!walletSnap.exists()) {
        return null;
    }
    
    const data = walletSnap.data() as UserWalletData;
    return data.encryptKey || null;
}

/**
 * Delete user's wallet data from Firestore
 */
export async function deleteUserWallet(userId: string): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');
    
    const walletRef = doc(db, 'users', userId, 'wallet', 'chipiPay');
    await deleteDoc(walletRef);
}
