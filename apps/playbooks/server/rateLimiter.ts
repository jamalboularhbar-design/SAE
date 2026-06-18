/**
 * In-memory rate limiter for API endpoints.
 * Tracks requests per IP with a sliding window approach.
 * For production at scale, replace with Redis-backed solution.
 */

interface RateLimitEntry {
  timestamps: number[];
}

interface RateLimiterConfig {
  windowMs: number;   // Time window in milliseconds
  maxRequests: number; // Max requests allowed within the window
}

class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private config: RateLimiterConfig;
  private cleanupInterval: ReturnType<typeof setInterval>;

  constructor(config: RateLimiterConfig) {
    this.config = config;
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /**
   * Check if a request from the given key (IP) is allowed.
   * Returns { allowed: boolean, remaining: number, resetMs: number }
   */
  check(key: string): { allowed: boolean; remaining: number; resetMs: number } {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    let entry = this.store.get(key);
    if (!entry) {
      entry = { timestamps: [] };
      this.store.set(key, entry);
    }

    // Remove timestamps outside the window
    entry.timestamps = entry.timestamps.filter(t => t > windowStart);

    const remaining = Math.max(0, this.config.maxRequests - entry.timestamps.length);
    const oldestInWindow = entry.timestamps[0];
    const resetMs = oldestInWindow ? (oldestInWindow + this.config.windowMs) - now : this.config.windowMs;

    if (entry.timestamps.length >= this.config.maxRequests) {
      return { allowed: false, remaining: 0, resetMs };
    }

    // Record this request
    entry.timestamps.push(now);
    return { allowed: true, remaining: remaining - 1, resetMs: this.config.windowMs };
  }

  private cleanup() {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    const keys = Array.from(this.store.keys());
    for (const key of keys) {
      const entry = this.store.get(key)!;
      entry.timestamps = entry.timestamps.filter((t: number) => t > windowStart);
      if (entry.timestamps.length === 0) {
        this.store.delete(key);
      }
    }
  }

  destroy() {
    clearInterval(this.cleanupInterval);
  }
}

// Rate limiter for demo form: 3 requests per IP per hour
export const leadSubmitLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3,
});

// Rate limiter for login: 5 attempts per IP per 15 minutes
export const loginLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
});

// Rate limiter for password reset: 3 requests per IP per hour
export const passwordResetLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3,
});
