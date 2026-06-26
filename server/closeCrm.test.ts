import { describe, it, expect } from "vitest";
import { verifyCloseApiKey, createCloseLead } from "./closeCrm";

describe("Close CRM Integration", () => {
  it("should export verifyCloseApiKey function", () => {
    expect(typeof verifyCloseApiKey).toBe("function");
  });

  it("should export createCloseLead function", () => {
    expect(typeof createCloseLead).toBe("function");
  });

  it("should verify the Close CRM API key is valid", async () => {
    const isValid = await verifyCloseApiKey();
    expect(isValid).toBe(true);
  }, 15000);

  it("should create a test lead in Close CRM", async () => {
    const leadId = await createCloseLead({
      fullName: "Test Lead (NexusAI Playbooks)",
      email: "test-integration@argbuilder.io",
      company: "NexusAI Playbooks Test",
      jobTitle: "Integration Test",
      teamSize: "saas",
      message: "This is an automated integration test lead. Safe to delete.",
      source: "vitest-integration-test",
    });

    // Should return a Close lead ID (starts with "lead_")
    expect(leadId).not.toBeNull();
    expect(leadId).toMatch(/^lead_/);
  }, 15000);
});
