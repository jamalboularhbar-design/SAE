import { Express, Request, Response } from "express";
import { marked } from "marked";
import { getDocumentBySlug, getBrandingSettings } from "./db";
import { prepareDocumentContent } from "@shared/documentContent";
import {
  buildPrintCitation,
  buildPrintFooter,
  buildPrintHeaderSubtitle,
  parseClientFromFooterText,
  resolveDocumentClient,
} from "@shared/printFooter";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Generates a styled HTML document from markdown content for PDF rendering.
 */
function markdownToHtml(
  title: string,
  slug: string,
  category: string,
  content: string,
  updatedAt?: Date | string | null,
  clientName?: string | null,
  autoPrint = false
): string {
  const htmlContent = marked.parse(content, { async: false }) as string;
  const meta = { title, slug, category, updatedAt, clientName: clientName ?? undefined };
  const footer = buildPrintFooter(meta);
  const citation = buildPrintCitation(meta);
  const headerSubtitle = buildPrintHeaderSubtitle(meta);
  const safeTitle = escapeHtml(title);
  const safeCategory = escapeHtml(category);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${safeTitle} — ${footer.clientName ?? "ARG-Builder"}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
  <style>
    @page { margin: 2.2cm 2cm 2.4cm; size: A4; }
    * { box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 11.5pt;
      line-height: 1.65;
      color: #1a1a1a;
      max-width: 100%;
      padding: 0;
      margin: 0;
      background: #fff;
    }
    .print-toolbar {
      position: sticky;
      top: 0;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 20px;
      background: #0f172a;
      color: #e2e8f0;
      font-size: 13px;
      border-bottom: 1px solid #334155;
    }
    .print-toolbar button {
      background: #c9a96e;
      color: #0f172a;
      border: none;
      border-radius: 8px;
      padding: 8px 16px;
      font-weight: 600;
      cursor: pointer;
      font-size: 13px;
    }
    .print-toolbar button:hover { background: #d4b87a; }
    .print-toolbar .hint { opacity: 0.85; max-width: 520px; line-height: 1.4; }
    .document-shell { max-width: 720px; margin: 0 auto; padding: 32px 24px 48px; }
    .header {
      border-bottom: 2px solid #c9a96e;
      padding-bottom: 18px;
      margin-bottom: 28px;
    }
    .header h1 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 24pt;
      font-weight: 700;
      margin: 0 0 10px 0;
      color: #0f172a;
      line-height: 1.2;
    }
    .header .meta {
      font-size: 9.5pt;
      color: #64748b;
      line-height: 1.5;
    }
    .header .category {
      display: inline-block;
      background: #fef3c7;
      color: #92400e;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 8.5pt;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .content h1 { font-size: 17pt; color: #0f172a; margin-top: 28px; page-break-after: avoid; }
    .content h2 { font-size: 14pt; color: #1e293b; margin-top: 22px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; page-break-after: avoid; }
    .content h3 { font-size: 12pt; color: #334155; margin-top: 16px; page-break-after: avoid; }
    .content h4 { font-size: 11pt; color: #475569; margin-top: 12px; }
    .content p { margin: 10px 0; orphans: 3; widows: 3; }
    .content ul, .content ol { margin: 10px 0; padding-left: 22px; }
    .content li { margin: 5px 0; }
    .content code {
      background: #f1f5f9;
      padding: 1px 5px;
      border-radius: 3px;
      font-size: 9.5pt;
      font-family: 'Consolas', 'Fira Code', monospace;
    }
    .content pre {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 14px;
      overflow-x: auto;
      font-size: 9pt;
      line-height: 1.45;
      page-break-inside: avoid;
    }
    .content pre code { background: none; padding: 0; }
    .content blockquote {
      border-left: 4px solid #c9a96e;
      margin: 14px 0;
      padding: 8px 16px;
      background: #fffbeb;
      color: #44403c;
    }
    .content table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0;
      font-size: 10pt;
      page-break-inside: avoid;
    }
    .content th, .content td {
      border: 1px solid #e2e8f0;
      padding: 8px 10px;
      text-align: left;
    }
    .content th { background: #f8fafc; font-weight: 600; }
    .content img { max-width: 100%; height: auto; page-break-inside: avoid; }
    .footer {
      margin-top: 40px;
      padding-top: 16px;
      border-top: 1px solid #cbd5e1;
      font-size: 8.5pt;
      color: #64748b;
      line-height: 1.55;
      page-break-inside: avoid;
    }
    .footer-brand { font-weight: 600; color: #334155; margin-bottom: 4px; }
    .footer-source { word-break: break-all; margin-bottom: 4px; }
    .footer-citation { font-style: italic; margin-bottom: 6px; color: #475569; }
    .footer-confidential {
      font-size: 8pt;
      color: #57534e;
      letter-spacing: 0.02em;
    }
    .footer-confidential strong { color: #292524; font-weight: 600; }
    a { color: #1e293b; text-decoration: none; }
    @media print {
      .print-toolbar { display: none !important; }
      .document-shell { padding: 0; max-width: 100%; }
      body { font-size: 11pt; }
    }
  </style>
</head>
<body>
  <div class="print-toolbar no-print">
    <span class="hint">Document print view — turn off <strong>Headers and footers</strong> in the print dialog for a clean PDF without browser URL/date chrome.</span>
    <button type="button" onclick="window.print()">Print / Save PDF</button>
  </div>
  <div class="document-shell">
    <div class="header">
      <h1>${safeTitle}</h1>
      <div class="meta">
        <span class="category">${safeCategory}</span>
        &nbsp;&middot;&nbsp; ${escapeHtml(headerSubtitle)}
      </div>
    </div>
    <div class="content">
      ${htmlContent}
    </div>
    <div class="footer">
      <div class="footer-brand">${escapeHtml(footer.brandLine)}</div>
      <div class="footer-source">Source: ${escapeHtml(footer.sourceLine)}</div>
      <div class="footer-citation">${escapeHtml(citation)}</div>
      <div class="footer-confidential">${formatConfidentialHtml(footer.confidentialLine, footer.clientName)}</div>
    </div>
  </div>
  ${autoPrint ? `<script>window.addEventListener('load',function(){setTimeout(function(){window.print()},600)});</script>` : ""}
</body>
</html>`;
}

function formatConfidentialHtml(line: string, clientName: string | null): string {
  const escaped = escapeHtml(line);
  if (!clientName) return escaped;
  const clientEsc = escapeHtml(clientName);
  return escaped.replace(clientEsc, `<strong>${clientEsc}</strong>`);
}

async function resolveClientName(
  category: string,
  queryClient?: string
): Promise<string | undefined> {
  if (queryClient?.trim()) return queryClient.trim();

  const fromCategory = resolveDocumentClient(category)?.name;
  if (fromCategory) return fromCategory;

  try {
    const settings = await getBrandingSettings();
    const footerText = settings.find((s) => s.settingKey === "footer_text")?.settingValue;
    return parseClientFromFooterText(footerText) ?? undefined;
  } catch {
    return undefined;
  }
}

/**
 * Register the PDF export endpoint on the Express app.
 * GET /api/export/pdf/:slug - Returns HTML for PDF rendering (client uses print-to-pdf)
 * or with ?format=html returns the styled HTML directly for download.
 */
export function registerPdfExport(app: Express) {
  app.get("/api/export/pdf/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      if (!slug) {
        res.status(400).json({ error: "Missing slug parameter" });
        return;
      }

      const doc = await getDocumentBySlug(slug);
      if (!doc || !doc.content) {
        res.status(404).json({ error: "Document not found" });
        return;
      }

      const clientName = await resolveClientName(
        doc.category,
        typeof req.query.client === "string" ? req.query.client : undefined
      );
      const autoPrint = req.query.print === "1";

      const html = markdownToHtml(
        doc.title,
        doc.slug,
        doc.category,
        prepareDocumentContent(doc.content),
        doc.updatedAt || doc.createdAt,
        clientName,
        autoPrint
      );

      const format = req.query.format;
      if (format === "html") {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${doc.title.replace(/[^a-zA-Z0-9 -]/g, "")}.html"`
        );
        res.send(html);
      } else {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.send(html);
      }
    } catch (error) {
      console.error("PDF export error:", error);
      res.status(500).json({ error: "Failed to generate PDF export" });
    }
  });
}
