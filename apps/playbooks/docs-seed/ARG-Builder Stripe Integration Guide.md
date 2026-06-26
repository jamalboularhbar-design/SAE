# ARG Builder Stripe Integration Guide

**Purpose:** Enable self-serve payment for the Starter tier ($299/month) directly from the landing page, so prospects can sign up without a sales call.

---

## Overview

The Stripe integration adds a "Buy Now" flow to the Starter tier on the pricing section of the landing page. When a prospect clicks "Get Started" on the Starter plan, they are redirected to a Stripe Checkout session. After successful payment, they are redirected back to ARG Builder where their account is provisioned automatically.

The Professional and Enterprise tiers remain "Contact Sales" — these require a demo and custom onboarding.

---

## Implementation Steps

### Step 1: Add Stripe Feature to the Project

Use the Manus `webdev_add_feature` tool to add Stripe integration:

```
webdev_add_feature(feature="stripe")
```

This will install the Stripe SDK, create the necessary server-side helpers, and scaffold the webhook handler. Follow the README instructions provided after the feature is added.

### Step 2: Create Stripe Products and Prices

In the Stripe Dashboard (dashboard.stripe.com), create the following:

**Product: ARG Builder Starter**
- Name: ARG Builder Starter
- Description: AI-powered operational knowledge platform for teams up to 25 users
- Price: $299/month (recurring, monthly billing)
- Price ID: Save this — you'll need it in the code (e.g., `price_xxxxxxxxx`)

**Product: ARG Builder Professional** (for future use)
- Name: ARG Builder Professional
- Description: Full-featured operational intelligence platform
- Price: $15/user/month (recurring, per-seat billing)
- Note: This will be used later when self-serve Professional tier is enabled

### Step 3: Add Stripe Secrets

Use `webdev_request_secrets` to add the following environment variables:

| Key | Description |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe secret key (starts with `sk_live_` or `sk_test_`) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret (starts with `whsec_`) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (starts with `pk_live_` or `pk_test_`) |
| `STRIPE_STARTER_PRICE_ID` | Price ID for the Starter plan ($299/month) |

### Step 4: Create the Checkout Flow

Add a new tRPC procedure for creating Stripe Checkout sessions:

```typescript
// In server/routers.ts
import Stripe from 'stripe';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

// Add to the router:
stripe: {
  createCheckoutSession: protectedProcedure
    .input(z.object({ priceId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{ price: input.priceId, quantity: 1 }],
        customer_email: ctx.user.email,
        metadata: { userId: String(ctx.user.id) },
        success_url: `${ctx.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${ctx.origin}/product#pricing`,
      });
      return { url: session.url };
    }),
}
```

### Step 5: Update the Landing Page Pricing Section

Modify the Starter tier "Get Started" button to trigger the checkout flow:

```tsx
// In LandingPage.tsx, replace the Starter plan CTA:
<Button
  onClick={async () => {
    if (!user) {
      window.location.href = getLoginUrl('/product');
      return;
    }
    const result = await createCheckout.mutateAsync({
      priceId: import.meta.env.VITE_STRIPE_STARTER_PRICE_ID,
    });
    if (result.url) window.location.href = result.url;
  }}
  className="bg-teal-500 hover:bg-teal-400 text-black font-semibold"
>
  Get Started
</Button>
```

### Step 6: Handle Webhooks

The Stripe webhook handler (scaffolded by `webdev_add_feature`) should handle these events:

| Event | Action |
|---|---|
| `checkout.session.completed` | Create subscription record in DB, provision user account |
| `invoice.payment_succeeded` | Update subscription status, extend access |
| `invoice.payment_failed` | Notify user, set grace period (7 days) |
| `customer.subscription.deleted` | Revoke access, send win-back email |

### Step 7: Create Subscription Management

Add a `/subscription` page where paying customers can:
- View their current plan and billing cycle
- Access the Stripe Customer Portal to update payment method or cancel
- See usage stats (number of users, documents, storage)

### Step 8: Add Database Tables

```sql
CREATE TABLE subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  stripe_customer_id VARCHAR(255) NOT NULL,
  stripe_subscription_id VARCHAR(255) NOT NULL,
  plan VARCHAR(50) NOT NULL DEFAULT 'starter',
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  current_period_start BIGINT NOT NULL,
  current_period_end BIGINT NOT NULL,
  created_at BIGINT NOT NULL DEFAULT (UNIX_TIMESTAMP() * 1000),
  updated_at BIGINT NOT NULL DEFAULT (UNIX_TIMESTAMP() * 1000),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## Testing Checklist

Before going live, test the complete flow using Stripe test mode:

- [ ] Create a test checkout session and complete payment with test card (4242 4242 4242 4242)
- [ ] Verify webhook receives `checkout.session.completed` event
- [ ] Verify subscription record is created in the database
- [ ] Verify user can access the subscription management page
- [ ] Test payment failure with declining test card (4000 0000 0000 0002)
- [ ] Test subscription cancellation through Stripe Customer Portal
- [ ] Verify access is revoked after cancellation
- [ ] Test the complete flow in Stripe live mode with a real $1 test charge (then refund)

---

## Timeline

| Step | Estimated Time | Dependency |
|---|---|---|
| Add Stripe feature | 5 minutes | None |
| Create Stripe products | 10 minutes | Stripe account |
| Add secrets | 5 minutes | Stripe API keys |
| Implement checkout flow | 2 hours | Steps 1–3 |
| Handle webhooks | 1 hour | Step 4 |
| Subscription management page | 2 hours | Step 5 |
| Testing | 1 hour | All steps |
| **Total** | **~6 hours** | |

This can be implemented in a single focused session. The Manus `webdev_add_feature` tool handles most of the scaffolding, so the primary work is wiring the checkout flow and webhook handling.
