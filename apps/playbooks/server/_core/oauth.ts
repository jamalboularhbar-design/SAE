import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk, checkAdminPassword, hashPassword, verifyPasswordHash } from "./sdk";
import { ENV } from "./env";
import { loginLimiter, passwordResetLimiter } from "../rateLimiter";
import {
  isTotpEnabled, generateTotpSecretAndUri, generateQRCodeDataUrl,
  verifyTotpToken, enableTotp, disableTotp,
  generateRecoveryCodes, verifyRecoveryCode, getRecoveryCodesCount,
} from "../totp";

// Session durations
const SESSION_REMEMBER_ME = ONE_YEAR_MS; // 1 year
const SESSION_DEFAULT = 24 * 60 * 60 * 1000; // 24 hours

// Pending 2FA sessions (password verified, awaiting TOTP)
const pending2faSessions = new Map<string, { email: string; rememberMe: boolean; expiresAt: number }>();

export function registerOAuthRoutes(app: Express) {
  // Email + password login — replaces Manus OAuth
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    // Rate limit: 5 attempts per IP per 15 minutes
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'unknown';
    const { allowed, resetMs } = loginLimiter.check(ip);
    if (!allowed) {
      res.status(429).json({
        error: `Too many login attempts. Please try again in ${Math.ceil(resetMs / 60000)} minutes.`,
      });
      return;
    }

    const { email, password, rememberMe } = req.body ?? {};

    if (typeof email !== "string" || typeof password !== "string") {
      res.status(400).json({ error: "email and password are required" });
      return;
    }

    // Validate against admin credentials from env vars
    const emailNorm = email.toLowerCase().trim();
    const emailMatch = emailNorm === ENV.adminEmail.toLowerCase().trim();
    const passwordMatch = emailMatch ? await checkAdminPassword(password) : false;

    if (emailMatch && passwordMatch) {
      // Admin login — may require 2FA below
    } else {
      const member = await db.getUserByEmail(emailNorm);
      if (!member?.passwordHash || !(await verifyPasswordHash(password, member.passwordHash))) {
        await db.logActivity("login_failed", undefined, ip, JSON.stringify({
          email: emailNorm,
          reason: !member ? "unknown_email" : "invalid_password",
          timestamp: new Date().toISOString(),
          userAgent: req.headers['user-agent'] || 'unknown',
        }));
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }
      await completeLoginForUser(req, res, member, !!rememberMe, ip);
      return;
    }

    // Check if TOTP is enabled - if so, require 2FA step (admin only)
    if (isTotpEnabled()) {
      const crypto = await import('crypto');
      const challengeToken = crypto.randomBytes(32).toString('hex');
      pending2faSessions.set(challengeToken, {
        email: email.toLowerCase().trim(),
        rememberMe: !!rememberMe,
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      });
      res.json({ requires2FA: true, challengeToken });
      return;
    }

    // No 2FA - complete login directly
    await completeLogin(req, res, !!rememberMe, ip);
  });

  // 2FA verification endpoint
  app.post("/api/auth/verify-2fa", async (req: Request, res: Response) => {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'unknown';
    const { challengeToken, totpCode, recoveryCode } = req.body ?? {};

    if (!challengeToken || typeof challengeToken !== 'string') {
      res.status(400).json({ error: "challengeToken is required" });
      return;
    }

    const session = pending2faSessions.get(challengeToken);
    if (!session || session.expiresAt < Date.now()) {
      pending2faSessions.delete(challengeToken);
      res.status(401).json({ error: "2FA session expired. Please login again." });
      return;
    }

    // Verify either TOTP code or recovery code
    let verified = false;
    if (totpCode && typeof totpCode === 'string') {
      verified = verifyTotpToken(totpCode);
    } else if (recoveryCode && typeof recoveryCode === 'string') {
      verified = verifyRecoveryCode(recoveryCode);
    }

    if (!verified) {
      await db.logActivity("2fa_failed", undefined, ip, JSON.stringify({
        email: session.email,
        timestamp: new Date().toISOString(),
      }));
      res.status(401).json({ error: "Invalid verification code" });
      return;
    }

    // Clean up pending session
    pending2faSessions.delete(challengeToken);

    // Complete login
    await completeLogin(req, res, session.rememberMe, ip);
  });

  // 2FA setup - generate secret and QR code
  app.post("/api/auth/2fa/setup", async (req: Request, res: Response) => {
    // Must be authenticated (check cookie)
    const user = await sdk.authenticateRequest(req);
    if (!user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const { secret, otpauthUrl } = generateTotpSecretAndUri();
    const qrCodeDataUrl = await generateQRCodeDataUrl(otpauthUrl);

    res.json({ secret, otpauthUrl, qrCodeDataUrl });
  });

  // 2FA enable - verify token and activate
  app.post("/api/auth/2fa/enable", async (req: Request, res: Response) => {
    const user = await sdk.authenticateRequest(req);
    if (!user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const { secret, token } = req.body ?? {};
    if (!secret || !token) {
      res.status(400).json({ error: "secret and token are required" });
      return;
    }

    // Verify the token against the provided secret
    const valid = verifyTotpToken(token, secret);
    if (!valid) {
      res.status(400).json({ error: "Invalid verification code. Please try again." });
      return;
    }

    // Enable TOTP
    enableTotp(secret);
    const recoveryCodes = generateRecoveryCodes();

    await db.logActivity("2fa_enabled", undefined, undefined, JSON.stringify({
      timestamp: new Date().toISOString(),
    }));

    res.json({ success: true, recoveryCodes });
  });

  // 2FA disable
  app.post("/api/auth/2fa/disable", async (req: Request, res: Response) => {
    const user = await sdk.authenticateRequest(req);
    if (!user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const { password } = req.body ?? {};
    if (!password) {
      res.status(400).json({ error: "Password confirmation required" });
      return;
    }

    const passwordMatch = await checkAdminPassword(password);
    if (!passwordMatch) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }

    disableTotp();

    await db.logActivity("2fa_disabled", undefined, undefined, JSON.stringify({
      timestamp: new Date().toISOString(),
    }));

    res.json({ success: true });
  });

  // 2FA status
  app.get("/api/auth/2fa/status", async (req: Request, res: Response) => {
    const user = await sdk.authenticateRequest(req);
    if (!user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    res.json({
      enabled: isTotpEnabled(),
      recoveryCodesRemaining: getRecoveryCodesCount(),
    });
  });

  // Password reset request (sends notification to owner)
  app.post("/api/auth/reset-password-request", async (req: Request, res: Response) => {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'unknown';
    const { allowed } = passwordResetLimiter.check(ip);
    if (!allowed) {
      // Always return success to prevent email enumeration
      res.json({ success: true, message: "If that email exists, a reset link has been sent." });
      return;
    }

    const { email } = req.body ?? {};
    if (typeof email !== "string") {
      res.status(400).json({ error: "email is required" });
      return;
    }

    // Only process if it matches the admin email (prevents enumeration)
    if (email.toLowerCase().trim() === ENV.adminEmail.toLowerCase().trim()) {
      // Generate a time-limited reset token (valid for 1 hour)
      const resetToken = await sdk.createSessionToken("admin-reset", {
        name: "password-reset",
        expiresInMs: 60 * 60 * 1000, // 1 hour
      });

      // Notify owner with the reset token
      const { notifyOwner } = await import("./notification");
      await notifyOwner({
        title: "Password Reset Requested",
        content: `A password reset was requested for ${email}.\n\nReset token: ${resetToken}\n\nThis token expires in 1 hour. Use it at /reset-password?token=<token> to set a new password.\n\nIf you didn't request this, you can safely ignore this notification.`,
      }).catch(() => {});
    }

    // Always return success to prevent email enumeration
    res.json({ success: true, message: "If that email exists, a reset link has been sent." });
  });

  // Password change (authenticated admin only)
  app.post("/api/auth/change-password", async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body ?? {};

    if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
      res.status(400).json({ error: "currentPassword and newPassword are required" });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ error: "New password must be at least 6 characters" });
      return;
    }

    // Verify current password
    const passwordMatch = await checkAdminPassword(currentPassword);
    if (!passwordMatch) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }

    // Note: In a full implementation, this would update the ADMIN_PASSWORD env var.
    // For now, we notify the owner that a password change was attempted.
    const { notifyOwner } = await import("./notification");
    await notifyOwner({
      title: "Password Change Requested",
      content: `The admin password change was requested. To update the password, go to Settings → Secrets in the Manus dashboard and update the ADMIN_PASSWORD value to the new password.`,
    }).catch(() => {});

    res.json({ success: true, message: "Password change request sent. Update ADMIN_PASSWORD in Settings → Secrets." });
  });

  /** Accept team/founding invite — creates account (Morocco: no Stripe required). */
  app.post("/api/auth/accept-invite", async (req: Request, res: Response) => {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'unknown';
    const { token, name, password } = req.body ?? {};

    if (typeof token !== "string" || typeof name !== "string" || typeof password !== "string") {
      res.status(400).json({ error: "token, name, and password are required" });
      return;
    }
    if (password.length < 8) {
      res.status(400).json({ error: "Password must be at least 8 characters" });
      return;
    }

    const invite = await db.getInviteByToken(token);
    if (!invite || invite.acceptedAt) {
      res.status(400).json({ error: "Invalid or already used invite" });
      return;
    }
    if (new Date(invite.expiresAt) < new Date()) {
      res.status(400).json({ error: "Invite has expired" });
      return;
    }

    const email = invite.email.toLowerCase().trim();
    const existing = await db.getUserByEmail(email);
    if (existing) {
      res.status(400).json({ error: "An account with this email already exists. Please log in." });
      return;
    }

    const passwordHash = await hashPassword(password);
    const membershipTier = invite.membershipTier === "founding" ? "founding" : "none";
    const user = await db.createInvitedUser({
      email,
      name: name.trim(),
      passwordHash,
      companyName: invite.companyName ?? undefined,
      membershipTier,
      role: invite.role,
    });

    if (invite.workspaceId) {
      await db.addWorkspaceMember({
        workspaceId: invite.workspaceId,
        userId: user.openId,
        role: "member",
      });
    }

    await db.markInviteAccepted(token);
    await completeLoginForUser(req, res, user, true, ip);
  });

  /** Public invite lookup for accept page */
  app.get("/api/auth/invite/:token", async (req: Request, res: Response) => {
    const invite = await db.getInviteByToken(req.params.token);
    if (!invite || invite.acceptedAt) {
      res.status(404).json({ error: "Invite not found" });
      return;
    }
    if (new Date(invite.expiresAt) < new Date()) {
      res.status(410).json({ error: "Invite expired" });
      return;
    }
    res.json({
      email: invite.email,
      companyName: invite.companyName,
      inviteeName: invite.inviteeName,
      membershipTier: invite.membershipTier,
      expiresAt: invite.expiresAt,
    });
  });
}

// Helper to complete login (shared between direct login and post-2FA)
async function completeLogin(req: Request, res: Response, rememberMe: boolean, ip: string) {
  const openId = "admin";
  await db.upsertUser({
    openId,
    name: "Admin",
    email: ENV.adminEmail,
    loginMethod: "email",
    role: "admin",
    lastSignedIn: new Date(),
  });

  const sessionDuration = rememberMe ? SESSION_REMEMBER_ME : SESSION_DEFAULT;

  const sessionToken = await sdk.createSessionToken(openId, {
    name: "Admin",
    expiresInMs: sessionDuration,
  });

  const cookieOptions = getSessionCookieOptions(req);
  res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: sessionDuration });

  // Audit log: successful login
  await db.logActivity("login_success", undefined, ip, JSON.stringify({
    email: ENV.adminEmail,
    rememberMe,
    sessionDuration: sessionDuration / 1000 + 's',
    timestamp: new Date().toISOString(),
    userAgent: req.headers['user-agent'] || 'unknown',
  }));

  res.json({ success: true });
}

async function completeLoginForUser(
  req: Request,
  res: Response,
  user: { openId: string; name: string | null; email: string | null },
  rememberMe: boolean,
  ip: string
) {
  await db.upsertUser({
    openId: user.openId,
    name: user.name ?? undefined,
    email: user.email ?? undefined,
    lastSignedIn: new Date(),
  });

  const sessionDuration = rememberMe ? SESSION_REMEMBER_ME : SESSION_DEFAULT;
  const sessionToken = await sdk.createSessionToken(user.openId, {
    name: user.name ?? "Member",
    expiresInMs: sessionDuration,
  });

  const cookieOptions = getSessionCookieOptions(req);
  res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: sessionDuration });

  await db.logActivity("login_success", undefined, ip, JSON.stringify({
    email: user.email,
    openId: user.openId,
    rememberMe,
    timestamp: new Date().toISOString(),
    userAgent: req.headers['user-agent'] || 'unknown',
  }));

  res.json({ success: true });
}
