import { toast } from "sonner";

export interface PrintDocumentOptions {
  slug: string;
  title?: string;
  /** Client name from onboarding / branding — passed to print renderer */
  clientName?: string;
}

/**
 * Opens a clean, document-only print view (server-rendered HTML).
 * Avoids printing the full app chrome (nav, sidebars, Quick Actions, etc.).
 */
export function printDocument({ slug, clientName }: PrintDocumentOptions): void {
  const params = new URLSearchParams({ print: "1" });
  if (clientName?.trim()) {
    params.set("client", clientName.trim());
  }

  const url = `/api/export/pdf/${encodeURIComponent(slug)}?${params.toString()}`;
  const printWindow = window.open(url, "_blank", "noopener,noreferrer");

  if (!printWindow) {
    toast.error("Allow pop-ups to print this document");
    return;
  }

  toast.success("Opening print view — disable “Headers and footers” in the dialog for a clean PDF");
}
