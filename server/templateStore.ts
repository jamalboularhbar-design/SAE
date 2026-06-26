/**
 * Gumroad / Lemon Squeezy checkout URLs from environment (server-side).
 */
import type { TemplateBundleId } from "@shared/templateBundles";

const ENV_KEYS: Record<TemplateBundleId, string> = {
  starter: "GUMROAD_URL_STARTER",
  agency: "GUMROAD_URL_AGENCY",
  "travel-ops": "GUMROAD_URL_TRAVEL_OPS",
  "creative-studio": "GUMROAD_URL_CREATIVE_STUDIO",
  complete: "GUMROAD_URL_COMPLETE",
};

const CLUB_KEY = "GUMROAD_URL_TEMPLATE_CLUB";

export function getTemplateCheckoutUrls(): Record<TemplateBundleId, string | null> {
  const out = {} as Record<TemplateBundleId, string | null>;
  for (const [id, envKey] of Object.entries(ENV_KEYS) as [TemplateBundleId, string][]) {
    const url = process.env[envKey]?.trim();
    out[id] = url && url.startsWith("http") ? url : null;
  }
  return out;
}

export function getTemplateClubCheckoutUrl(): string | null {
  const url = process.env[CLUB_KEY]?.trim();
  return url && url.startsWith("http") ? url : null;
}

export function isTemplateStoreLive(): boolean {
  return Object.values(getTemplateCheckoutUrls()).some(Boolean);
}
