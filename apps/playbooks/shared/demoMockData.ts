/**
 * Demo mock data — real Riad & Routes provider partners + generic fallbacks.
 */
export const DEMO_PROVIDERS = {
  riadYasmine: "Riad Yasmine",
  riadKniza: "Riad Kniza",
  riad72: "Riad 72",
  darAnika: "Dar Anika",
  royalMansour: "Royal Mansour",
  laMamounia: "La Mamounia",
  selmanMarrakech: "Selman Marrakech",
  kasbahTamadot: "Kasbah Tamadot",
} as const;

/** Generic labels when anonymizing exports */
export const DEMO_PROVIDER_ALIASES: Record<string, string> = {
  "Riad Yasmine": DEMO_PROVIDERS.riadYasmine,
  "Riad Kniza": DEMO_PROVIDERS.riadKniza,
  "Riad 72": DEMO_PROVIDERS.riad72,
  "Riad Dar Anika": DEMO_PROVIDERS.darAnika,
  "Dar Anika": DEMO_PROVIDERS.darAnika,
  "Royal Mansour": DEMO_PROVIDERS.royalMansour,
  "La Mamounia": DEMO_PROVIDERS.laMamounia,
  "Selman Marrakech": DEMO_PROVIDERS.selmanMarrakech,
  "Kasbah Tamadot": DEMO_PROVIDERS.kasbahTamadot,
};
