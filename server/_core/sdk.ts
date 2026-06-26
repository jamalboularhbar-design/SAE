import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { ForbiddenError } from "@shared/_core/errors";
import { parse as parseCookieHeader } from "cookie";
import type { Request } from "express";
import { SignJWT, jwtVerify } from "jose";
import { scrypt, timingSafeEqual, randomBytes } from "crypto";
import { promisify } from "util";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { ENV } from "./env";

const scryptAsync = promisify(scrypt);

export type SessionPayload = {
  openId: string;
  name: string;
};

// ─── Password verification ───────────────────────────────────────────────────

async function scryptHash(password: string, salt: string): Promise<Buffer> {
  return scryptAsync(password, salt, 64) as Promise<Buffer>;
}

export async function checkAdminPassword(inputPassword: string): Promise<boolean> {
  const adminPassword = ENV.adminPassword;
  // If stored as scrypt hash (saltHex:hashHex), use timing-safe compare
  if (adminPassword.includes(":") && adminPassword.length > 80) {
    const [saltHex, hashHex] = adminPassword.split(":");
    const hash = await scryptHash(inputPassword, saltHex!);
    const stored = Buffer.from(hashHex!, "hex");
    if (hash.length !== stored.length) return false;
    return timingSafeEqual(hash, stored);
  }
  // Plain text (initial setup) — still timing-safe
  const a = Buffer.alloc(256, 0);
  const b = Buffer.alloc(256, 0);
  a.write(inputPassword);
  b.write(adminPassword);
  return timingSafeEqual(a, b) && inputPassword === adminPassword;
}

/** Hash a password for storage on invited/founding users (saltHex:hashHex). */
export async function hashPassword(password: string): Promise<string> {
  const saltHex = Buffer.from(randomBytes(16)).toString("hex");
  const hash = await scryptHash(password, saltHex);
  return `${saltHex}:${hash.toString("hex")}`;
}

export async function verifyPasswordHash(inputPassword: string, stored: string): Promise<boolean> {
  if (!stored.includes(":")) return false;
  const [saltHex, hashHex] = stored.split(":");
  const hash = await scryptHash(inputPassword, saltHex!);
  const expected = Buffer.from(hashHex!, "hex");
  if (hash.length !== expected.length) return false;
  return timingSafeEqual(hash, expected);
}

// ─── Session management ──────────────────────────────────────────────────────

class SDKServer {
  private getSessionSecret() {
    return new TextEncoder().encode(ENV.cookieSecret);
  }

  private parseCookies(cookieHeader: string | undefined) {
    if (!cookieHeader) return new Map<string, string>();
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }

  async createSessionToken(
    openId: string,
    options: { expiresInMs?: number; name?: string } = {}
  ): Promise<string> {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1000);
    const secretKey = this.getSessionSecret();

    return new SignJWT({ openId, name: options.name ?? "" })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime(expirationSeconds)
      .sign(secretKey);
  }

  async verifySession(cookieValue: string | undefined | null): Promise<SessionPayload | null> {
    if (!cookieValue) return null;
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, { algorithms: ["HS256"] });
      const { openId, name } = payload as Record<string, unknown>;
      if (typeof openId !== "string" || !openId) return null;
      return { openId, name: typeof name === "string" ? name : "" };
    } catch {
      return null;
    }
  }

  async authenticateRequest(req: Request): Promise<User> {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);

    if (!session) throw ForbiddenError("Invalid session cookie");

    const user = await db.getUserByOpenId(session.openId);
    if (!user) throw ForbiddenError("User not found");

    await db.upsertUser({ openId: user.openId, lastSignedIn: new Date() });
    return user;
  }
}

export const sdk = new SDKServer();
