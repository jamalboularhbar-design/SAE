import { describe, it, expect, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock Stripe - since keys aren't configured, we test the graceful handling
describe("Stripe Router", () => {
  const mockUser = {
    id: 1,
    openId: "test-user-123",
    name: "Test User",
    email: "test@example.com",
    loginMethod: "manus",
    role: "user" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    stripeCustomerId: null,
    stripeSubscriptionId: null,
  };

  const mockReq = {
    headers: { origin: "http://localhost:3000" },
  } as any;

  const mockRes = {
    clearCookie: vi.fn(),
  } as any;

  const authenticatedCtx: TrpcContext = {
    user: mockUser,
    req: mockReq,
    res: mockRes,
  };

  const unauthenticatedCtx: TrpcContext = {
    user: null,
    req: mockReq,
    res: mockRes,
  };

  describe("getProducts", () => {
    it("returns product tiers and implementation fees", async () => {
      const caller = appRouter.createCaller(authenticatedCtx);
      const result = await caller.stripe.getProducts();

      expect(result.tiers).toBeDefined();
      expect(result.tiers.length).toBe(3);
      expect(result.tiers[0].name).toBe("Starter");
      expect(result.tiers[1].name).toBe("Professional");
      expect(result.tiers[2].name).toBe("Enterprise");
      expect(result.implementation).toBeDefined();
      expect(result.implementation.standard.price).toBe(500000);
    });

    it("returns products even for unauthenticated users", async () => {
      const caller = appRouter.createCaller(unauthenticatedCtx);
      const result = await caller.stripe.getProducts();

      expect(result.tiers.length).toBe(3);
    });
  });

  describe("isConfigured", () => {
    it("returns false when STRIPE_SECRET_KEY is not set", async () => {
      const caller = appRouter.createCaller(unauthenticatedCtx);
      const result = await caller.stripe.isConfigured();

      // In test environment, Stripe keys are not set
      expect(result.configured).toBe(false);
    });
  });

  describe("createCheckoutSession", () => {
    it("throws error when Stripe is not configured", async () => {
      const caller = appRouter.createCaller(authenticatedCtx);

      await expect(
        caller.stripe.createCheckoutSession({
          tierId: "starter",
          billingPeriod: "monthly",
        })
      ).rejects.toThrow("Stripe is not configured");
    });

    it("requires authentication", async () => {
      const caller = appRouter.createCaller(unauthenticatedCtx);

      await expect(
        caller.stripe.createCheckoutSession({
          tierId: "starter",
          billingPeriod: "monthly",
        })
      ).rejects.toThrow();
    });
  });

  describe("getSubscriptionStatus", () => {
    it("returns no_subscription when user has no subscription", async () => {
      const caller = appRouter.createCaller(authenticatedCtx);
      const result = await caller.stripe.getSubscriptionStatus();

      expect(result.status).toBe("no_subscription");
      expect(result.subscription).toBeNull();
    });
  });

  describe("createPortalSession", () => {
    it("throws when Stripe is not configured", async () => {
      const caller = appRouter.createCaller(authenticatedCtx);

      await expect(caller.stripe.createPortalSession()).rejects.toThrow(
        "Stripe is not configured"
      );
    });
  });

  describe("getPaymentHistory", () => {
    it("returns empty payments when Stripe is not configured", async () => {
      const caller = appRouter.createCaller(authenticatedCtx);
      const result = await caller.stripe.getPaymentHistory();

      expect(result.payments).toEqual([]);
    });
  });
});
