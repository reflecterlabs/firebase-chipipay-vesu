// Simple deterministic derivation of encryptKey based on user UID and a public salt.
// Note: This is for UX convenience. For production-strength security, consider
// using a user-provided secret (PIN/biometrics) or a hardware-backed key.

export async function deriveEncryptKey(userUid: string): Promise<string> {
  const salt = process.env.NEXT_PUBLIC_ENCRYPT_SALT || 'vesu_default_salt';
  const msg = `${userUid}:${salt}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(msg);

  // Use Web Crypto API to compute SHA-256 digest
  const digest = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(digest);

  // Convert to hex string
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }

  // Return 64-char hex as encryptKey
  return hex;
}
