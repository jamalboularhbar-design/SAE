import { BRAND } from "./brand";
import { DEMO_WORKSPACES } from "./demoWorkspaces";
import { getWorkspaceRoot } from "./workspaceTaxonomy";

export interface PrintDocumentMeta {
  title: string;
  slug: string;
  category?: string;
  /** Workspace / client name when known (overrides category lookup) */
  clientName?: string;
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

/** Parse client label from admin footer_text (e.g. "Riad & Routes — riadandroutes.com") */
export function parseClientFromFooterText(footerText?: string | null): string | null {
  if (!footerText?.trim()) return null;
  const part = footerText.split(/[—–\-|·]/)[0]?.trim();
  return part || null;
}

/** Resolve client only for workspace deployments (RR, ArtKech, etc.) — not platform function categories */
export function resolveDocumentClient(category?: string | null): { name: string; domain?: string } | null {
  if (!category?.trim()) return null;

  const root = getWorkspaceRoot(category);
  if (!root) return null;

  const workspace = Object.values(DEMO_WORKSPACES).find((ws) => ws.name === root);
  return workspace ? { name: workspace.name, domain: workspace.domain } : { name: root };
}

export function resolvePrintClientName(meta: PrintDocumentMeta): string | null {
  if (meta.clientName?.trim()) return meta.clientName.trim();
  return resolveDocumentClient(meta.category)?.name ?? null;
}

/** Subtitle under the document title in print/PDF header */
export function buildPrintHeaderSubtitle(meta: PrintDocumentMeta): string {
  const client = resolvePrintClientName(meta);
  const parts = [
    client ?? BRAND.productName,
    meta.category && meta.category !== client ? meta.category : null,
    formatUpdatedDate(meta.updatedAt) ? `Updated ${formatUpdatedDate(meta.updatedAt)}` : null,
  ].filter(Boolean);
  return parts.join(" · ");
}

function buildConfidentialLine(meta: PrintDocumentMeta): string {
  const printed = formatPrintDate(meta.printedAt);
  const client = resolvePrintClientName(meta);
  if (client) {
    return `Confidential — ${client} · Internal use only · Printed ${printed}`;
  }
  return `Confidential · Internal use only · Printed ${printed}`;
}

/** Structured footer lines for print, PDF, and DOC export */
export function buildPrintFooter(meta: PrintDocumentMeta): {
  brandLine: string;
  sourceLine: string;
  confidentialLine: string;
  clientName: string | null;
} {
  const client = resolvePrintClientName(meta);
  return {
    brandLine: `${BRAND.productName} · ${BRAND.domain}`,
    sourceLine: documentPermalink(meta.slug),
    confidentialLine: buildConfidentialLine(meta),
    clientName: client,
  };
}

/** APA-style citation for print footer — attributes authorship to the deploying client when known */
export function buildPrintCitation(meta: PrintDocumentMeta): string {
  const year = meta.updatedAt
    ? new Date(meta.updatedAt).getFullYear()
    : new Date().getFullYear();
  const author = resolvePrintClientName(meta) ?? BRAND.parentName;
  return `${author}. (${year}). ${meta.title}. ${BRAND.productName}. ${documentPermalink(meta.slug)}`;
}
