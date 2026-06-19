/**
 * Generic demo mock data for operational UI pages.
 * Keeps docs-seed blueprint unchanged; only sanitizes in-app demo fixtures.
 */
export const DEMO_PROVIDERS = {
  cedarBoutique: "Cedar Boutique Hotel",
  harborView: "Harbor View Lodge",
  summitInn: "Summit Inn",
  gardenCourt: "Garden Court Hotel",
  grandPalace: "Grand Palace Hotel",
  riversideLuxury: "Riverside Luxury Hotel",
  vistaResort: "Vista Resort",
  highlandRetreat: "Highland Retreat",
} as const;

/** Legacy demo names → generic replacements (for bulk migration) */
export const DEMO_PROVIDER_ALIASES: Record<string, string> = {
  "Riad Yasmine": DEMO_PROVIDERS.cedarBoutique,
  "Riad Kniza": DEMO_PROVIDERS.harborView,
  "Riad 72": DEMO_PROVIDERS.summitInn,
  "Riad Dar Anika": DEMO_PROVIDERS.gardenCourt,
  "Dar Anika": DEMO_PROVIDERS.gardenCourt,
  "Royal Mansour": DEMO_PROVIDERS.grandPalace,
  "La Mamounia": DEMO_PROVIDERS.riversideLuxury,
  "Selman Marrakech": DEMO_PROVIDERS.vistaResort,
  "Kasbah Tamadot": DEMO_PROVIDERS.highlandRetreat,
};
