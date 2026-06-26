import { Printer } from "lucide-react";
import { printDocument } from "@/lib/printDocument";

interface PrintButtonProps {
  slug: string;
  title: string;
  clientName?: string;
  className?: string;
}

export default function PrintButton({ slug, title, clientName, className = "" }: PrintButtonProps) {
  return (
    <button
      type="button"
      onClick={() => printDocument({ slug, title, clientName })}
      className={`flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors ${className}`}
      title="Print this document"
      aria-label="Print document"
    >
      <Printer className="w-4 h-4" />
      <span className="text-xs hidden sm:inline">Print</span>
    </button>
  );
}
