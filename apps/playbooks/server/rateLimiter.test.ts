import { describe, it, expect } from "vitest";
import { leadSubmitLimiter, loginLimiter, passwordResetLimiter } from "./rateLimiter";

describe("Rate Limiter", () => {
  it("should allow requests within the limit", () => {
    const testKey = `test-allow-${Date.now()}`;
    const result1 = leadSubmitLimiter.check(testKey);
    expect(result1.allowed).toBe(true);
    expect(result1.remaining).toBe(2); // 3 max - 1 used = 2 remaining
  });

  it("should block requests exceeding the limit", () => {
    const testKey = `test-block-${Date.now()}`;
    // Use up all 3 allowed requests
    leadSubmitLimiter.check(testKey);
    leadSubmitLimiter.check(testKey);
    leadSubmitLimiter.check(testKey);
    // 4th should be blocked
    const result = leadSubmitLimiter.check(testKey);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.resetMs).toBeGreaterThan(0);
  });

  it("login limiter should allow 5 attempts", () => {
    const testKey = `test-login-${Date.now()}`;
    for (let i = 0; i < 5; i++) {
      const result = loginLimiter.check(testKey);
      expect(result.allowed).toBe(true);
    }
    // 6th should be blocked
    const blocked = loginLimiter.check(testKey);
    expect(blocked.allowed).toBe(false);
  });

  it("password reset limiter should allow 3 requests", () => {
    const testKey = `test-reset-${Date.now()}`;
    for (let i = 0; i < 3; i++) {
      const result = passwordResetLimiter.check(testKey);
      expect(result.allowed).toBe(true);
    }
    const blocked = passwordResetLimiter.check(testKey);
    expect(blocked.allowed).toBe(false);
  });

  it("different IPs should have independent limits", () => {
    const ip1 = `ip1-${Date.now()}`;
    const ip2 = `ip2-${Date.now()}`;
    // Exhaust ip1
    leadSubmitLimiter.check(ip1);
    leadSubmitLimiter.check(ip1);
    leadSubmitLimiter.check(ip1);
    const blockedIp1 = leadSubmitLimiter.check(ip1);
    expect(blockedIp1.allowed).toBe(false);
    // ip2 should still be allowed
    const allowedIp2 = leadSubmitLimiter.check(ip2);
    expect(allowedIp2.allowed).toBe(true);
  });
});
