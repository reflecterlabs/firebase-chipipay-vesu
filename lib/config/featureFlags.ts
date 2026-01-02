/**
 * Feature Flags (env-based, no Remote Config)
 * 
 * Add new flags here with safe defaults (usually false).
 * Keep in sync with contrib/feature-flags.yaml for documentation.
 * 
 * Workflow:
 * 1. Add flag with default false
 * 2. Develop behind flag
 * 3. Change to true when ready
 * 4. Remove flag after stable (cleanup)
 */

export const FEATURE_FLAGS = {
  // Active UI features
  WALLET_QR_CODE: true,
  TOKEN_SELECTOR_DROPDOWN: true,
  ADDRESS_ACTIVITY_LINK: true,
  
  // Planned/WIP features (keep false until ready)
  MULTI_WALLET_SUPPORT: false,
  ADVANCED_LENDING_UI: false,
  
  // Development aids
  DEBUG_MODE: process.env.NODE_ENV === 'development',
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

/**
 * Check if a feature flag is enabled
 */
export function isEnabled(flag: FeatureFlag): boolean {
  return FEATURE_FLAGS[flag];
}

/**
 * Hook for React components (optional)
 */
export function useFeatureFlag(flag: FeatureFlag): boolean {
  return FEATURE_FLAGS[flag];
}
