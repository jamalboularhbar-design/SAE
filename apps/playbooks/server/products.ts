/**
 * ARG-Builder Pricing Products — Bootstrap Positioning (June 2026)
 *
 * One plan, two billing periods:
 *  - Membership: $39/month
 *  - Founding Member: $290/year (~38% off, price locked, first 100 seats)
 *
 * Stripe Dashboard setup:
 *  - Product "ARG-Builder Membership" with two prices:
 *    $39.00 USD recurring monthly  → env STRIPE_PRICE_MEMBERSHIP_MONTHLY
 *    $290.00 USD recurring yearly  → env STRIPE_PRICE_MEMBERSHIP_ANNUAL
 *
 * Founding cap: enforced manually — when 100 Founding (annual) subscriptions
 * exist, archive the $290 yearly price in Stripe and create the post-founding
 * yearly price. Existing subscribers keep $290 permanently (Stripe keeps
 * legacy prices on active subscriptions).
 */

export interface ProductTier {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number; // in cents
  annualPrice: number; // in cents (per month, billed annually)
  features: string[];
  targetTeamSize: string;
  stripePriceIdMonthly: string | null;
  stripePriceIdAnnual: string | null;
}

/** Founding Member annual total, in cents — $290/year, price locked permanently. */
export const FOUNDING_ANNUAL_TOTAL = 29000;

/** Founding seats cap — a real commitment. When reached, retire the price in Stripe. */
export const FOUNDING_SEAT_CAP = 100;

export const PRODUCTS: Record<string, ProductTier> = {
  membership: {
    id: "membership",
    name: "Membership",
    description: "Full access to the complete operating reference",
    monthlyPrice: 3900, // $39/month
    annualPrice: 2417, // $290/year ≈ $24.17/month equivalent (Founding Member)
    features: [
      "All operating documents",
      "Full-text search across the library",
      "Collections & reading paths",
      "Annotations & bookmarks",
      "Version history & freshness status",
      "PDF, DOCX & zip export",
      "Every update as the library grows",
      "Founding (annual): price locked at $290 permanently",
      "Founding (annual): direct line to the founder",
      "Cancel anytime",
    ],
    targetTeamSize: "Solo founders, teams of 1–20, fractional operators",
    stripePriceIdMonthly: process.env.STRIPE_PRICE_MEMBERSHIP_MONTHLY || null,
    stripePriceIdAnnual: process.env.STRIPE_PRICE_MEMBERSHIP_ANNUAL || null,
  },
};

/**
 * No implementation fees in the bootstrap model — white-label and teams are
 * conversations, not SKUs, until demand proves otherwise. Keys are kept so
 * stripeRouter's createImplementationCheckout fails with a clear "not
 * configured" error instead of a crash if ever called.
 */
export const IMPLEMENTATION_FEES = {
  standard: {
    name: "Standard Implementation (retired)",
    price: 0,
    description: "Not offered in the bootstrap model",
    stripePriceId: null as string | null,
  },
  custom: {
    name: "Custom Implementation (retired)",
    price: 0,
    description: "Not offered in the bootstrap model",
    stripePriceId: null as string | null,
  },
};

/**
 * Get a product tier by ID
 */
export function getProduct(tierId: string): ProductTier | undefined {
  return PRODUCTS[tierId];
}

/**
 * Get all product tiers as an array
 */
export function getAllProducts(): ProductTier[] {
  return Object.values(PRODUCTS);
}
