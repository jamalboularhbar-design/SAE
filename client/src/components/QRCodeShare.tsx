import { useState } from 'react';
import { QrCode, X, Download } from 'lucide-react';

interface QRCodeShareProps {
  slug: string;
  title: string;
}

// Simple QR code generation using a public API (no external lib needed)
function getQRCodeUrl(text: string, size = 200): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&format=png&margin=8`;
}

export default function QRCodeShare({ slug, title }: QRCodeShareProps) {
  const [showQR, setShowQR] = useState(false);
  const docUrl = `${window.location.origin}/docs/${slug}`;
  const qrUrl = getQRCodeUrl(docUrl, 256);

  const handleDownload = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-${slug}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // fallback: open in new tab
      window.open(qrUrl, '_blank');
    }
  };

  return (
    <>
      <button
        onClick={() => setShowQR(true)}
        className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-card/80"
        title="Generate QR code"
        aria-label="Generate QR code for sharing"
      >
        <QrCode className="w-4 h-4" />
      </button>

      {showQR && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowQR(false)}>
          <div className="bg-card border border-border rounded-xl p-6 max-w-xs w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">QR Code</h3>
              <button onClick={() => setShowQR(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="bg-white p-3 rounded-lg">
                <img src={qrUrl} alt={`QR code for ${title}`} className="w-48 h-48" />
              </div>
              <p className="text-xs text-muted-foreground text-center truncate max-w-full">{title}</p>
              <p className="text-[10px] text-muted-foreground/70 text-center break-all">{docUrl}</p>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-xs font-medium hover:bg-accent/90 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download QR
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
