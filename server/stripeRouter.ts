import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getStripe } from "./stripeWebhook";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { PRODUCTS, getAllProducts, IMPLEMENTATION_FEES } from "./products";

export const stripeRouter = router({
  /**
   * Get all available products/pricing tiers
   */
  getProducts: publicProcedure.query(() => {
    return {
      tiers: getAllProducts(),
      implementation: IMPLEMENTATION_FEES,
    };
  }),

  /**
   * Create a Stripe Checkout Session for a subscription
   */
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        tierId: z.enum(["membership"]),
        billingPeriod: z.enum(["monthly", "annual"]).default("monthly"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const stripe = getStripe();
      if (!stripe) {
        throw new Error("Stripe is not configured. Please add your Stripe API keys in Settings → Payment.");
      }

      const product = PRODUCTS[input.tierId];
      if (!product) {
        throw new Error(`Invalid tier: ${input.tierId}`);
      }

      const priceId =
        input.billingPeriod === "annual"
          ? product.stripePriceIdAnnual
          : product.stripePriceIdMonthly;

      if (!priceId) {
        throw new Error(
          `Stripe Price ID not configured for ${product.name} (${input.billingPeriod}). ` +
          `Please create the product in Stripe Dashboard and set the STRIPE_PRICE_* environment variables.`
        );
      }

      const origin = ctx.req.headers.origin || "http://localhost:3000";

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        customer_email: ctx.user.email || undefined,
        client_reference_id: ctx.user.id.toString(),
        metadata: {
          user_id: ctx.user.id.toString(),
          customer_email: ctx.user.email || "",
          customer_name: ctx.user.name || "",
          tier: input.tierId,
          billing_period: input.billingPeriod,
        },
        allow_promotion_codes: true,
        success_url: `${origin}/billing?session_id={CHECKOUT_SESSION_ID}&status=success`,
        cancel_url: `${origin}/product?status=canceled`,
      });

      return { checkoutUrl: session.url };
    }),

  /**
   * Create a Stripe Checkout Session for one-time implementation fee
   */
  createImplementationCheckout: protectedProcedure
    .input(
      z.object({
        type: z.enum(["standard", "custom"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const stripe = getStripe();
      if (!stripe) {
        throw new Error("Stripe is not configured. Please add your Stripe API keys in Settings → Payment.");
      }

      const impl = IMPLEMENTATION_FEES[input.type];
      if (!impl.stripePriceId) {
        throw new Error(
          `Stripe Price ID not configured for ${impl.name}. ` +
          `Please create the product in Stripe Dashboard and set the STRIPE_PRICE_IMPL_* environment variables.`
        );
      }

      const origin = ctx.req.headers.origin || "http://localhost:3000";

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [{ price: impl.stripePriceId, quantity: 1 }],
        customer_email: ctx.user.email || undefined,
        client_reference_id: ctx.user.id.toString(),
        metadata: {
          user_id: ctx.user.id.toString(),
          customer_email: ctx.user.email || "",
          customer_name: ctx.user.name || "",
          type: `implementation_${input.type}`,
        },
        allow_promotion_codes: true,
        success_url: `${origin}/billing?status=success&type=implementation`,
        cancel_url: `${origin}/product?status=canceled`,
      });

      return { checkoutUrl: session.url };
    }),

  /**
   * Get current user's subscription status
   */
  getSubscriptionStatus: protectedProcedure.query(async ({ ctx }) => {
    const stripe = getStripe();
    const db = await getDb();
    if (!db) return { status: "no_subscription" as const, subscription: null };

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, ctx.user.id))
      .limit(1);

    if (!user?.stripeSubscriptionId || !stripe) {
      return { status: "no_subscription" as const, subscription: null };
    }

    try {
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId) as any;
      return {
        status: subscription.status as string,
        subscription: {
          id: subscription.id,
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000)
            : null,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          plan: subscription.items?.data?.[0]?.price?.id || null,
        },
      };
    } catch (err: any) {
      console.error(`[Stripe] Error fetching subscription: ${err.message}`);
      return { status: "error" as const, subscription: null };
    }
  }),

  /**
   * Create a Stripe Customer Portal session for managing billing
   */
  createPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
    const stripe = getStripe();
    if (!stripe) {
      throw new Error("Stripe is not configured.");
    }

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, ctx.user.id))
      .limit(1);

    if (!user?.stripeCustomerId) {
      throw new Error("No billing account found. Please subscribe to a plan first.");
    }

    const origin = ctx.req.headers.origin || "http://localhost:3000";

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${origin}/billing`,
    });

    return { portalUrl: session.url };
  }),

  /**
   * Get payment history for the current user
   */
  getPaymentHistory: protectedProcedure.query(async ({ ctx }) => {
    const stripe = getStripe();
    if (!stripe) return { payments: [] };

    const db = await getDb();
    if (!db) return { payments: [] };

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, ctx.user.id))
      .limit(1);

    if (!user?.stripeCustomerId) return { payments: [] };

    try {
      const charges = await stripe.charges.list({
        customer: user.stripeCustomerId,
        limit: 20,
      });

      return {
        payments: charges.data.map((charge) => ({
          id: charge.id,
          amount: charge.amount,
          currency: charge.currency,
          status: charge.status,
          description: charge.description,
          created: new Date(charge.created * 1000),
          receiptUrl: charge.receipt_url,
        })),
      };
    } catch (err: any) {
      console.error(`[Stripe] Error fetching payment history: ${err.message}`);
      return { payments: [] };
    }
  }),

  /**
   * Check if Stripe is configured (public — used to show/hide payment buttons)
   */
  isConfigured: publicProcedure.query(() => {
    const stripe = getStripe();
    return { configured: !!stripe };
  }),
});
