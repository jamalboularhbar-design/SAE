import { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

interface ContextualHelpProps {
  title: string;
  description: string;
  className?: string;
}

export default function ContextualHelp({ title, description, className = '' }: ContextualHelpProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className={`relative inline-flex ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-muted-foreground hover:text-accent transition-colors"
        aria-label={`Help: ${title}`}
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-xl bg-card border border-border/50 shadow-xl z-50 animate-in fade-in-0 zoom-in-95">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h4 className="text-xs font-semibold text-foreground">{title}</h4>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{description}</p>
          </div>
        </>
      )}
    </span>
  );
}
