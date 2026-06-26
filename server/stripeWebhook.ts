import { Express, Request, Response } from "express";
import Stripe from "stripe";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import express from "express";

/**
 * Initialize Stripe instance.
 * Returns null if keys are not configured.
 */
export function getStripe(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;
  return new Stripe(secretKey, { apiVersion: "2025-04-30.basil" as any });
}

/**
 * Register Stripe webhook endpoint.
 * MUST be registered BEFORE express.json() middleware to receive raw body.
 */
export function registerStripeWebhook(app: Express) {
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req: Request, res: Response) => {
      const stripe = getStripe();
      if (!stripe) {
        console.error("[Stripe Webhook] Stripe not configured");
        return res.status(500).json({ error: "Stripe not configured" });
      }

      const sig = req.headers["stripe-signature"] as string;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!webhookSecret) {
        console.error("[Stripe Webhook] STRIPE_WEBHOOK_SECRET not set");
        return res.status(500).json({ error: "Webhook secret not configured" });
      }

      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err: any) {
        console.error(`[Stripe Webhook] Signature verification failed: ${err.message}`);
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
      }

      // Handle test events
      if (event.id.startsWith("evt_test_")) {
        console.log("[Webhook] Test event detected, returning verification response");
        return res.json({ verified: true });
      }

      console.log(`[Stripe Webhook] Received event: ${event.type} (${event.id})`);

      try {
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            await handleCheckoutCompleted(session);
            break;
          }
          case "customer.subscription.created":
          case "customer.subscription.updated": {
            const subscription = event.data.object as Stripe.Subscription;
            await handleSubscriptionUpdate(subscription);
            break;
          }
          case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;
            await handleSubscriptionCanceled(subscription);
            break;
          }
          case "invoice.paid": {
            const invoice = event.data.object as Stripe.Invoice;
            console.log(`[Stripe Webhook] Invoice paid: ${invoice.id}`);
            break;
          }
          case "invoice.payment_failed": {
            const invoice = event.data.object as Stripe.Invoice;
            console.log(`[Stripe Webhook] Invoice payment failed: ${invoice.id}`);
            break;
          }
          default:
            console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
      } catch (err: any) {
        console.error(`[Stripe Webhook] Error processing event: ${err.message}`);
        res.status(500).json({ error: "Webhook processing error" });
      }
    }
  );
}

/**
 * Handle checkout.session.completed — link Stripe customer to our user
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!userId) {
    console.error("[Stripe Webhook] No user_id in session metadata");
    return;
  }

  console.log(`[Stripe Webhook] Checkout completed for user ${userId}, customer ${customerId}`);

  const db = await getDb();
  if (!db) return;

  await db
    .update(users)
    .set({
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
    })
    .where(eq(users.id, parseInt(userId)));
}

/**
 * Handle subscription updates — sync subscription ID
 */
async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const db = await getDb();
  if (!db) return;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.stripeCustomerId, customerId))
    .limit(1);

  if (!user) {
    console.log(`[Stripe Webhook] No user found for customer ${customerId}`);
    return;
  }

  await db
    .update(users)
    .set({ stripeSubscriptionId: subscription.id })
    .where(eq(users.id, user.id));

  console.log(`[Stripe Webhook] Updated subscription for user ${user.id}: ${subscription.id} (${subscription.status})`);
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const db = await getDb();
  if (!db) return;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.stripeCustomerId, customerId))
    .limit(1);

  if (!user) {
    console.log(`[Stripe Webhook] No user found for customer ${customerId}`);
    return;
  }

  await db
    .update(users)
    .set({ stripeSubscriptionId: null })
    .where(eq(users.id, user.id));

  console.log(`[Stripe Webhook] Subscription canceled for user ${user.id}`);
}
