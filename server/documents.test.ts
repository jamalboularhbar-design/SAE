import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the db module
vi.mock("./db", () => ({
  getDocuments: vi.fn(),
  getDocumentBySlug: vi.fn(),
  getDocumentCategories: vi.fn(),
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
}));

import { getDocuments, getDocumentBySlug, getDocumentCategories } from "./db";

describe("Document API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getDocuments", () => {
    it("should return documents with total count", async () => {
      const mockResult = {
        documents: [
          {
            id: 1,
            slug: "API-Design-Developer-Portal",
            title: "API Design Developer Portal",
            category: "Engineering",
            filename: "ARG-Builder-API-Design-Developer-Portal.md",
            wordCount: 2500,
            createdAt: new Date("2026-05-05"),
          },
        ],
        total: 1,
      };
      (getDocuments as any).mockResolvedValue(mockResult);

      const result = await getDocuments({ limit: 50, offset: 0 });
      expect(result.documents).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.documents[0].title).toBe("API Design Developer Portal");
    });

    it("should filter by category", async () => {
      const mockResult = {
        documents: [
          {
            id: 1,
            slug: "API-Design-Developer-Portal",
            title: "API Design Developer Portal",
            category: "Engineering",
            filename: "ARG-Builder-API-Design-Developer-Portal.md",
            wordCount: 2500,
            createdAt: new Date("2026-05-05"),
          },
        ],
        total: 112,
      };
      (getDocuments as any).mockResolvedValue(mockResult);

      const result = await getDocuments({ category: "Engineering", limit: 50, offset: 0 });
      expect(getDocuments).toHaveBeenCalledWith({ category: "Engineering", limit: 50, offset: 0 });
      expect(result.total).toBe(112);
    });

    it("should support search", async () => {
      const mockResult = { documents: [], total: 0 };
      (getDocuments as any).mockResolvedValue(mockResult);

      const result = await getDocuments({ search: "pricing", limit: 50, offset: 0 });
      expect(getDocuments).toHaveBeenCalledWith({ search: "pricing", limit: 50, offset: 0 });
      expect(result.documents).toHaveLength(0);
    });
  });

  describe("getDocumentBySlug", () => {
    it("should return a document by slug", async () => {
      const mockDoc = {
        id: 1,
        slug: "API-Design-Developer-Portal",
        title: "API Design Developer Portal",
        category: "Engineering",
        filename: "ARG-Builder-API-Design-Developer-Portal.md",
        content: "# API Design Developer Portal\n\nContent here...",
        wordCount: 2500,
        createdAt: new Date("2026-05-05"),
        updatedAt: new Date("2026-05-05"),
      };
      (getDocumentBySlug as any).mockResolvedValue(mockDoc);

      const result = await getDocumentBySlug("API-Design-Developer-Portal");
      expect(result).not.toBeNull();
      expect(result!.slug).toBe("API-Design-Developer-Portal");
      expect(result!.content).toContain("API Design Developer Portal");
    });

    it("should return null for non-existent slug", async () => {
      (getDocumentBySlug as any).mockResolvedValue(null);

      const result = await getDocumentBySlug("non-existent-slug");
      expect(result).toBeNull();
    });
  });

  describe("getDocumentCategories", () => {
    it("should return categories with counts", async () => {
      const mockCategories = [
        { category: "AI & Developer", count: 7 },
        { category: "Customer Success", count: 82 },
        { category: "Engineering", count: 112 },
        { category: "Sales", count: 53 },
      ];
      (getDocumentCategories as any).mockResolvedValue(mockCategories);

      const result = await getDocumentCategories();
      expect(result).toHaveLength(4);
      expect(result[0].category).toBe("AI & Developer");
      expect(result[2].count).toBe(112);
    });

    it("should return empty array when no documents", async () => {
      (getDocumentCategories as any).mockResolvedValue([]);

      const result = await getDocumentCategories();
      expect(result).toHaveLength(0);
    });
  });
});
