import { useState } from 'react';
import { Share2, Copy, Check, Twitter, Linkedin, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface ShareDocumentProps {
  title: string;
  slug: string;
  category: string;
}

export default function ShareDocument({ title, slug, category }: ShareDocumentProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const url = `${window.location.origin}/docs/${slug}`;
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    { name: 'Twitter/X', icon: Twitter, url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` },
    { name: 'LinkedIn', icon: Linkedin, url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { name: 'Email', icon: Mail, url: `mailto:?subject=${encodedTitle}&body=Check out this document: ${encodedUrl}` },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground bg-card/50 border border-border/50 hover:border-accent/30 transition-colors"
        title="Share document"
      >
        <Share2 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Share</span>
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border/50 rounded-lg shadow-xl z-50 py-1">
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted/50 transition-colors text-left"
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
                onClick={() => setShowMenu(false)}
              >
                <link.icon className="w-3.5 h-3.5" />
                <span>{link.name}</span>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
