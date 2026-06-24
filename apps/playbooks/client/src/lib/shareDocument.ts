import { toast } from "sonner";

export function documentShareUrl(slug: string): string {
  return `${window.location.origin}/docs/${slug}`;
}

/** Native share when available; otherwise copy link to clipboard */
export async function shareDocument(title: string, slug: string): Promise<void> {
  const url = documentShareUrl(slug);
  const shareData = { title, text: title, url };

  if (typeof navigator.share === "function") {
    try {
      if (!navigator.canShare || navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return;
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  } catch {
    toast.error("Could not share — copy the URL from your browser");
  }
}
