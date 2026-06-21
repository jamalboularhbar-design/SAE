# ARG Builder — Stripe Setup Guide

## Overview

Your Stripe integration is **fully built and ready to activate**. This guide walks you through the 10-minute setup to start accepting payments.

---

## Step 1: Create Your Stripe Account

1. Go to [stripe.com](https://stripe.com) and sign up
2. Complete basic business verification (name, address, bank account)
3. You can use **Test Mode** immediately while verification is pending

---

## Step 2: Get Your API Keys

1. In Stripe Dashboard → **Developers → API Keys**
2. Copy your **Publishable key** (starts with `pk_test_...`)
3. Copy your **Secret key** (starts with `sk_test_...`)
4. Go to your ARG Builder project → **Settings → Payment**
5. Enter both keys there

---

## Step 3: Create Products & Prices in Stripe

In Stripe Dashboard → **Products**, create these:

### Subscription Products

| Product | Monthly Price | Annual Price | Notes |
|---------|-------------|--------------|-------|
| ARG Builder Starter | $299/month (flat) | $239/month (billed $2,868/year) | Up to 25 users included |
| ARG Builder Professional | $15/user/month | $12/user/month (billed annually) | 25-seat minimum = $375/mo floor |
| ARG Builder Enterprise | Custom (starting $2,500/mo) | Negotiated annually | Sales-led, 500+ employees |

For each product:
1. Click **Add Product**
2. Name it (e.g., "ARG Builder Starter")
3. Add a **Recurring** price → Monthly → $299
4. Add another **Recurring** price → Yearly → $2,868
5. For Professional, set pricing as **per unit** (per seat)
6. Copy the **Price ID** (starts with `price_...`) for each

### One-Time Implementation Fees

| Product | Price | Scope |
|---------|-------|-------|
| Standard Implementation | $5,000 one-time | AI-powered operational audit, system config, team onboarding (1–2 weeks) |
| Custom Implementation | $15,000–$50,000 one-time | Multi-department deployment with custom integrations & data migration |

For each:
1. Click **Add Product**
2. Add a **One-time** price

---

## Step 4: Set Price ID Environment Variables

Go to your project **Settings → Secrets** and add these:

| Variable Name | Value |
|--------------|-------|
| `STRIPE_PRICE_STARTER_MONTHLY` | `price_...` (from Step 3) |
| `STRIPE_PRICE_STARTER_ANNUAL` | `price_...` |
| `STRIPE_PRICE_PRO_MONTHLY` | `price_...` |
| `STRIPE_PRICE_PRO_ANNUAL` | `price_...` |
| `STRIPE_PRICE_ENTERPRISE_MONTHLY` | `price_...` |
| `STRIPE_PRICE_ENTERPRISE_ANNUAL` | `price_...` |
| `STRIPE_PRICE_IMPL_STANDARD` | `price_...` |
| `STRIPE_PRICE_IMPL_CUSTOM` | `price_...` |

---

## Step 5: Set Up Webhook

1. In Stripe Dashboard → **Developers → Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://argbuilder-io.manus.space/api/stripe/webhook`
   (or your custom domain: `https://argbuilder.io/api/stripe/webhook`)
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Copy the **Webhook Signing Secret** (starts with `whsec_...`)
6. This is automatically configured in Settings → Payment

---

## Step 6: Test the Flow

1. Visit `/product` on your site
2. Click "Start Free Trial" on the Starter plan
3. Use test card: `4242 4242 4242 4242` (any future expiry, any CVC)
4. Complete checkout → you'll be redirected to `/billing?status=success`
5. Check `/billing` to see your active subscription
6. Verify the webhook fired in Stripe Dashboard → Developers → Webhooks

---

## Step 7: Go Live

Once your Stripe account is fully verified:
1. Switch to **Live Mode** in Stripe Dashboard
2. Create the same Products/Prices in Live Mode
3. Update your API keys in Settings → Payment (replace `pk_test_` with `pk_live_`)
4. Update Price IDs in Settings → Secrets
5. Update webhook endpoint to use Live Mode signing secret

---

## Testing Tips

- Use `4242 4242 4242 4242` for successful payments
- Use `4000 0000 0000 0341` to test declined cards
- Use `4000 0000 0000 3220` to test 3D Secure authentication
- Stripe requires minimum $0.50 USD per transaction
- A 99% discount promo code is available for live mode testing

---

## What's Already Built

Your integration includes:

- **Checkout Sessions** — Redirect to Stripe-hosted payment page
- **Webhook Handler** — Processes payment events at `/api/stripe/webhook`
- **Subscription Tracking** — Stores customer/subscription IDs on user record
- **Billing Portal** — One-click access to Stripe's self-service portal
- **Payment History** — Lists all charges with receipt links
- **Billing Page** — Full UI at `/billing` showing status + history
- **Pricing Buttons** — Connected to Stripe on the `/product` page
- **Promo Codes** — `allow_promotion_codes: true` enabled on all sessions

---

## Architecture

```
User clicks "Subscribe" on /product
    → Frontend calls trpc.stripe.createCheckoutSession
    → Server creates Stripe Checkout Session
    → User redirected to Stripe-hosted payment page
    → Payment succeeds → Stripe fires webhook
    → /api/stripe/webhook receives event
    → Updates user record with stripeCustomerId + stripeSubscriptionId
    → User redirected to /billing?status=success
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Stripe is not configured" error | Add API keys in Settings → Payment |
| Checkout button does nothing | Check that Price IDs are set in Settings → Secrets |
| Webhook not firing | Verify endpoint URL and selected events in Stripe Dashboard |
| Subscription not showing on /billing | Check webhook logs in Stripe → Developers → Webhooks |
| "No billing account found" | User needs to complete at least one checkout first |
