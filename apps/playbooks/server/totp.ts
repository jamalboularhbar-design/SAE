import { TOTP } from 'otplib';
import { generateSecret, generateURI, verifySync } from 'otplib';
import QRCode from 'qrcode';

// TOTP secret is stored in memory for the single admin user
// In a multi-user system, this would be stored per-user in the database
let totpSecret: string | null = null;
let totpEnabled = false;

export function isTotpEnabled(): boolean {
  return totpEnabled;
}

export function getTotpSecret(): string | null {
  return totpSecret;
}

import { BRAND } from './brand';

export function generateTotpSecretAndUri(): { secret: string; otpauthUrl: string } {
  const secret = generateSecret();
  const otpauthUrl = generateURI({
    issuer: BRAND.productName,
    label: BRAND.adminEmail,
    secret,
    algorithm: 'sha1',
    digits: 6,
    period: 30,
  });
  return { secret, otpauthUrl };
}

export async function generateQRCodeDataUrl(otpauthUrl: string): Promise<string> {
  return QRCode.toDataURL(otpauthUrl);
}

export function verifyTotpToken(token: string, secret?: string): boolean {
  const s = secret || totpSecret;
  if (!s) return false;
  try {
    const result = verifySync({ token, secret: s });
    return result.valid === true;
  } catch {
    return false;
  }
}

export function enableTotp(secret: string): void {
  totpSecret = secret;
  totpEnabled = true;
}

export function disableTotp(): void {
  totpSecret = null;
  totpEnabled = false;
}

// Recovery codes (simple implementation)
let recoveryCodes: string[] = [];

export function generateRecoveryCodes(): string[] {
  const crypto = require('crypto');
  recoveryCodes = Array.from({ length: 8 }, () =>
    crypto.randomBytes(4).toString('hex').toUpperCase()
  );
  return recoveryCodes;
}

export function verifyRecoveryCode(code: string): boolean {
  const idx = recoveryCodes.findIndex(c => c === code.toUpperCase());
  if (idx >= 0) {
    recoveryCodes.splice(idx, 1); // consume the code
    return true;
  }
  return false;
}

export function getRecoveryCodesCount(): number {
  return recoveryCodes.length;
}
