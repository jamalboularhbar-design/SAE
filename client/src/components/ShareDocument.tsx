import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Share2, Copy, Check, Twitter, Linkedin, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { documentShareUrl } from '@/lib/shareDocument';

interface ShareDocumentProps {
  title: string;
  slug: string;
  category: string;
}

export default function ShareDocument({ title, slug }: ShareDocumentProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const url = documentShareUrl(slug);
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  useEffect(() => {
    if (!showMenu || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const menuWidth = 192;
    const left = Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 8);
    setMenuPos({
      top: rect.bottom + 8,
      left: Math.max(8, left),
    });
  }, [showMenu]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy link');
    }
  };

  const shareLinks = [
    { name: 'Twitter/X', icon: Twitter, url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` },
    { name: 'LinkedIn', icon: Linkedin, url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { name: 'Email', icon: Mail, url: `mailto:?subject=${encodedTitle}&body=Check out this document: ${encodedUrl}` },
  ];

  const menu = showMenu ? (
    <>
      <div className="fixed inset-0 z-[100]" onClick={() => setShowMenu(false)} aria-hidden="true" />
      <div
        className="fixed w-48 bg-card border border-border/50 rounded-lg shadow-xl z-[101] py-1"
        style={{ top: menuPos.top, left: menuPos.left }}
        role="menu"
      >
        <button
          onClick={handleCopyLink}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted/50 transition-colors text-left"
          role="menuitem"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied!' : 'Copy link'}</span>
        </button>
        <div className="border-t border-border/30 my-1" />
        {shareLinks.map(link => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted/50 transition-colors"
            role="menuitem"
            onClick={() => setShowMenu(false)}
          >
            <link.icon className="w-3.5 h-3.5" />
            <span>{link.name}</span>
          </a>
        ))}
      </div>
    </>
  ) : null;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground bg-card/50 border border-border/50 hover:border-accent/30 transition-colors"
        title="Share document"
        aria-expanded={showMenu}
        aria-haspopup="menu"
      >
        <Share2 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Share</span>
      </button>
      {typeof document !== 'undefined' && menu ? createPortal(menu, document.body) : null}
    </div>
  );
}
