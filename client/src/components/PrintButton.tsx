import { Printer } from 'lucide-react';

interface PrintButtonProps {
  title: string;
  className?: string;
}

export default function PrintButton({ title, className = '' }: PrintButtonProps) {
  const handlePrint = () => {
    // Add a temporary title for the print
    const originalTitle = document.title;
    document.title = title;
    window.print();
    document.title = originalTitle;
  };

  return (
    <button
      onClick={handlePrint}
      className={`flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors ${className}`}
      title="Print this document"
      aria-label="Print document"
    >
      <Printer className="w-4 h-4" />
      <span className="text-xs hidden sm:inline">Print</span>
    </button>
  );
}
