import { BRAND } from "./brand";

export interface PrintDocumentMeta {
  title: string;
  slug: string;
  category?: string;
  updatedAt?: Date | string | null;
  printedAt?: Date;
}

export function documentPermalink(slug: string): string {
  return `${BRAND.appUrl}/docs/${slug}`;
}

export function formatPrintDate(date = new Date()): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatUpdatedDate(updatedAt?: Date | string | null): string | null {
  if (!updatedAt) return null;
  return new Date(updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Subtitle under the document title in print/PDF header */
export function buildPrintHeaderSubtitle(meta: PrintDocumentMeta): string {
  const parts = [
    BRAND.productName,
    meta.category,
    formatUpdatedDate(meta.updatedAt) ? `Updated ${formatUpdatedDate(meta.updatedAt)}` : null,
  ].filter(Boolean);
  return parts.join(" · ");
}

/** Structured footer lines for print, PDF, and DOC export */
export function buildPrintFooter(meta: PrintDocumentMeta): {
  brandLine: string;
  sourceLine: string;
  confidentialLine: string;
} {
  const printed = formatPrintDate(meta.printedAt);
  return {
    brandLine: `${BRAND.productName} · ${BRAND.domain}`,
    sourceLine: documentPermalink(meta.slug),
    confidentialLine: `Confidential — For internal use only · Printed ${printed}`,
  };
}

/** APA-style citation for print footer */
export function buildPrintCitation(meta: PrintDocumentMeta): string {
  const year = meta.updatedAt
    ? new Date(meta.updatedAt).getFullYear()
    : new Date().getFullYear();
  return `${BRAND.parentName}. (${year}). ${meta.title}. ${BRAND.productName}. ${documentPermalink(meta.slug)}`;
}
