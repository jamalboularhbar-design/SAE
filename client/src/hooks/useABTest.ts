/**
 * Simple A/B testing hook using localStorage for sticky assignment.
 * Tracks which variant a user sees and fires analytics events on conversion.
 */

export interface ABTestVariant {
  id: string;
  label: string;
  weight?: number; // 0-1, defaults to equal distribution
}

export interface ABTestConfig {
  experimentId: string;
  variants: ABTestVariant[];
}

function getStoredVariant(experimentId: string): string | null {
  try {
    return localStorage.getItem(`ab_test_${experimentId}`);
  } catch {
    return null;
  }
}

function storeVariant(experimentId: string, variantId: string) {
  try {
    localStorage.setItem(`ab_test_${experimentId}`, variantId);
  } catch {
    // localStorage unavailable
  }
}

function selectVariant(variants: ABTestVariant[]): string {
  const rand = Math.random();
  let cumulative = 0;
  const defaultWeight = 1 / variants.length;

  for (const variant of variants) {
    cumulative += variant.weight ?? defaultWeight;
    if (rand <= cumulative) return variant.id;
  }
  return variants[variants.length - 1].id;
}

export function useABTest(config: ABTestConfig) {
  const { experimentId, variants } = config;

  // Get or assign variant (sticky per user)
  let variantId = getStoredVariant(experimentId);
  if (!variantId || !variants.find(v => v.id === variantId)) {
    variantId = selectVariant(variants);
    storeVariant(experimentId, variantId);
  }

  const trackConversion = (action: string = 'click') => {
    // Fire analytics event for conversion tracking
    try {
      // Use the existing analytics endpoint if available
      const analyticsEndpoint = (import.meta as any).env?.VITE_ANALYTICS_ENDPOINT;
      if (analyticsEndpoint) {
        fetch(analyticsEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'event',
            payload: {
              name: `ab_${experimentId}_${action}`,
              data: { variant: variantId },
              website: (import.meta as any).env?.VITE_ANALYTICS_WEBSITE_ID,
            },
          }),
        }).catch(() => {});
      }
      // Also store locally for admin dashboard
      const key = `ab_conversions_${experimentId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '{}');
      existing[variantId!] = (existing[variantId!] || 0) + 1;
      localStorage.setItem(key, JSON.stringify(existing));
    } catch {
      // Non-critical
    }
  };

  return {
    variantId,
    isVariant: (id: string) => variantId === id,
    trackConversion,
  };
}

// Pre-configured experiment for hero CTA
export const HERO_CTA_EXPERIMENT: ABTestConfig = {
  experimentId: 'hero_cta_v1',
  variants: [
    { id: 'start_trial', label: 'Start Free Trial', weight: 0.5 },
    { id: 'see_action', label: 'See It In Action', weight: 0.5 },
  ],
};
