import { Express, Request, Response } from "express";
import { marked } from "marked";
import { getDocumentBySlug } from "./db";
import { BRAND } from "./brand";
import { prepareDocumentContent } from "@shared/documentContent";
import {
  buildPrintCitation,
  buildPrintFooter,
  buildPrintHeaderSubtitle,
} from "@shared/printFooter";

/**
 * Generates a styled HTML document from markdown content for PDF rendering.
 */
function markdownToHtml(
  title: string,
  slug: string,
  category: string,
  content: string,
  updatedAt?: Date | string | null
): string {
  const htmlContent = marked.parse(content, { async: false }) as string;
  const footer = buildPrintFooter({ title, slug, category });
  const citation = buildPrintCitation({ title, slug, updatedAt });
  const headerSubtitle = buildPrintHeaderSubtitle({ title, slug, category, updatedAt });

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    @page { margin: 2cm; size: A4; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12pt;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 100%;
      padding: 0;
      margin: 0;
    }
    .header {
      border-bottom: 2px solid #2563eb;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .header h1 {
      font-size: 22pt;
      margin: 0 0 8px 0;
      color: #1e293b;
    }
    .header .meta {
      font-size: 10pt;
      color: #64748b;
    }
    .header .category {
      display: inline-block;
      background: #eff6ff;
      color: #2563eb;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 9pt;
      font-weight: 600;
      text-transform: uppercase;
    }
    h1 { font-size: 18pt; color: #1e293b; margin-top: 24px; }
    h2 { font-size: 15pt; color: #334155; margin-top: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
    h3 { font-size: 13pt; color: #475569; margin-top: 16px; }
    h4 { font-size: 12pt; color: #64748b; margin-top: 12px; }
    p { margin: 8px 0; }
    ul, ol { margin: 8px 0; padding-left: 24px; }
    li { margin: 4px 0; }
    code {
      background: #f1f5f9;
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 10pt;
      font-family: 'Fira Code', 'Consolas', monospace;
    }
    pre {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 12px;
      overflow-x: auto;
      font-size: 9pt;
      line-height: 1.4;
    }
    pre code { background: none; padding: 0; }
    blockquote {
      border-left: 4px solid #2563eb;
      margin: 12px 0;
      padding: 8px 16px;
      background: #f8fafc;
      color: #475569;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
      font-size: 10pt;
    }
    th, td {
      border: 1px solid #e2e8f0;
      padding: 8px 12px;
      text-align: left;
    }
    th { background: #f1f5f9; font-weight: 600; }
    tr:nth-child(even) { background: #f8fafc; }
    .footer {
      margin-top: 48px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
      font-size: 9pt;
      color: #64748b;
      line-height: 1.6;
      page-break-inside: avoid;
    }
    .footer-brand {
      font-weight: 600;
      color: #334155;
      margin-bottom: 4px;
    }
    .footer-source {
      word-break: break-all;
      margin-bottom: 4px;
    }
    .footer-citation {
      font-style: italic;
      margin-bottom: 4px;
    }
    .footer-confidential {
      font-size: 8pt;
      color: #94a3b8;
    }
    a { color: #1e293b; text-decoration: none; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${title}</h1>
    <div class="meta">
      <span class="category">${category}</span>
      &nbsp;&middot;&nbsp; ${headerSubtitle}
    </div>
  </div>
  <div class="content">
    ${htmlContent}
  </div>
  <div class="footer">
    <div class="footer-brand">${footer.brandLine}</div>
    <div class="footer-source">Source: ${footer.sourceLine}</div>
    <div class="footer-citation">${citation}</div>
    <div class="footer-confidential">${footer.confidentialLine}</div>
  </div>
</body>
</html>`;
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

      const html = markdownToHtml(
        doc.title,
        doc.slug,
        doc.category,
        prepareDocumentContent(doc.content),
        doc.updatedAt || doc.createdAt
      );

      // Return as downloadable HTML file that can be opened in browser and printed to PDF
      const format = req.query.format;
      if (format === 'html') {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${doc.title.replace(/[^a-zA-Z0-9 -]/g, '')}.html"`);
        res.send(html);
      } else {
        // Default: return HTML inline for iframe-based print-to-PDF
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html);
      }
    } catch (error) {
      console.error("PDF export error:", error);
      res.status(500).json({ error: "Failed to generate PDF export" });
    }
  });
}
