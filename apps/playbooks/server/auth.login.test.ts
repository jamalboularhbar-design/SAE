import { describe, it, expect } from "vitest";
import { checkAdminPassword } from "./_core/sdk";
import { ENV } from "./_core/env";

describe("Admin Login", () => {
  it("should have ADMIN_EMAIL configured", () => {
    expect(ENV.adminEmail).toBe("admin@nexusai.ma");
  });

  it("should have ADMIN_PASSWORD configured (not default)", () => {
    expect(ENV.adminPassword).not.toBe("changeme");
    expect(ENV.adminPassword.length).toBeGreaterThan(0);
  });

  it("should accept the correct admin password", async () => {
    const result = await checkAdminPassword(ENV.adminPassword);
    expect(result).toBe(true);
  });

  it("should reject an incorrect password", async () => {
    const result = await checkAdminPassword("wrong-password-123");
    expect(result).toBe(false);
  });
});
