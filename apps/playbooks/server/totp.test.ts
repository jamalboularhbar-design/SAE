import { describe, it, expect } from "vitest";

describe("TOTP/2FA Module", () => {
  it("should export all expected functions", async () => {
    const totp = await import("./totp");
    expect(typeof totp.generateTotpSecretAndUri).toBe("function");
    expect(typeof totp.verifyTotpToken).toBe("function");
    expect(typeof totp.enableTotp).toBe("function");
    expect(typeof totp.disableTotp).toBe("function");
    expect(typeof totp.isTotpEnabled).toBe("function");
    expect(typeof totp.generateRecoveryCodes).toBe("function");
    expect(typeof totp.verifyRecoveryCode).toBe("function");
    expect(typeof totp.getRecoveryCodesCount).toBe("function");
    expect(typeof totp.generateQRCodeDataUrl).toBe("function");
  });

  it("should start with TOTP disabled", async () => {
    const { isTotpEnabled } = await import("./totp");
    expect(isTotpEnabled()).toBe(false);
  });

  it("should generate a secret and otpauth URI", async () => {
    const { generateTotpSecretAndUri } = await import("./totp");
    const { secret, otpauthUrl } = generateTotpSecretAndUri();
    expect(secret).toBeTruthy();
    expect(secret.length).toBeGreaterThan(10);
    expect(otpauthUrl).toContain("otpauth://totp/");
    expect(otpauthUrl).toContain("NexusAI%20Playbooks");
  });

  it("should enable and disable TOTP", async () => {
    const { enableTotp, disableTotp, isTotpEnabled, generateTotpSecretAndUri } = await import("./totp");
    const { secret } = generateTotpSecretAndUri();
    
    enableTotp(secret);
    expect(isTotpEnabled()).toBe(true);
    
    disableTotp();
    expect(isTotpEnabled()).toBe(false);
  });

  it("should generate recovery codes", async () => {
    const { enableTotp, generateRecoveryCodes, getRecoveryCodesCount, disableTotp, generateTotpSecretAndUri } = await import("./totp");
    const { secret } = generateTotpSecretAndUri();
    
    enableTotp(secret);
    const codes = generateRecoveryCodes();
    expect(codes.length).toBe(8);
    expect(getRecoveryCodesCount()).toBe(8);
    
    // Each code should be 8 chars
    codes.forEach(code => {
      expect(code.length).toBe(8);
    });
    
    disableTotp();
  });

  it("should verify and consume recovery codes", async () => {
    const { enableTotp, generateRecoveryCodes, verifyRecoveryCode, getRecoveryCodesCount, disableTotp, generateTotpSecretAndUri } = await import("./totp");
    const { secret } = generateTotpSecretAndUri();
    
    enableTotp(secret);
    const codes = generateRecoveryCodes();
    const firstCode = codes[0];
    
    // Verify first code - should consume it
    const firstResult = verifyRecoveryCode(firstCode);
    expect(firstResult).toBe(true);
    expect(getRecoveryCodesCount()).toBe(7); // One consumed
    
    // Invalid code should fail
    expect(verifyRecoveryCode("INVALID1")).toBe(false);
    
    disableTotp();
  });

  it("should reject invalid TOTP tokens", async () => {
    const { enableTotp, verifyTotpToken, disableTotp, generateTotpSecretAndUri } = await import("./totp");
    const { secret } = generateTotpSecretAndUri();
    
    enableTotp(secret);
    
    // Invalid token
    expect(verifyTotpToken("000000")).toBe(false);
    expect(verifyTotpToken("123456")).toBe(false);
    
    disableTotp();
  });

  it("should generate QR code data URL", async () => {
    const { generateQRCodeDataUrl, generateTotpSecretAndUri } = await import("./totp");
    const { otpauthUrl } = generateTotpSecretAndUri();
    const dataUrl = await generateQRCodeDataUrl(otpauthUrl);
    expect(dataUrl).toContain("data:image/png;base64,");
  });
});
