/**
 * Environment configuration
 * For Cloudflare Pages static export, we hardcode public env vars
 * These are safe to commit as they're client-side public values
 */

export const firebaseConfig = {
  apiKey: "AIzaSyDmim1zBUBINENezKugFFhPekYXMpbqTFo",
  authDomain: "chipi-972f1.firebaseapp.com",
  projectId: "chipi-972f1",
  storageBucket: "chipi-972f1.firebasestorage.app",
  messagingSenderId: "81280849256",
  appId: "1:81280849256:web:e64e816be35024459032dd"
};

export const chipiConfig = {
  apiPublicKey: "pk_dev_1377c4314c005d393ccc22c376eed781",
  alphaUrl: undefined as string | undefined
};
