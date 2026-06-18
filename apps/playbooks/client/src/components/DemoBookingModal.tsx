import { useState } from "react";
import { X, Calendar, ExternalLink } from "lucide-react";

const CAL_LINK = "https://cal.com/argbuilder/demo";

interface DemoBookingModalProps {
  open: boolean;
  onClose: () => void;
}

export default function DemoBookingModal({ open, onClose }: DemoBookingModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl mx-4 relative shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Book a Demo</h2>
              <p className="text-xs text-muted-foreground">15-minute personalized walkthrough</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cal.com Embed */}
        <div className="h-[500px] w-full">
          <iframe
            src={`${CAL_LINK}?embed=true&theme=dark`}
            className="w-full h-full border-0"
            title="Book a Demo"
            allow="payment"
          />
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Powered by Cal.com
          </p>
          <a
            href={CAL_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline inline-flex items-center gap-1"
          >
            Open in new tab <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
