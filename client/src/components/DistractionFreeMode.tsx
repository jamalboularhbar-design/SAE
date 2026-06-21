import { useState, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DistractionFreeModeProps {
  children: React.ReactNode;
}

export default function DistractionFreeMode({ children }: DistractionFreeModeProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isFullscreen]);

  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setIsFullscreen(!isFullscreen)}
        title={isFullscreen ? 'Exit reading mode (Esc)' : 'Enter distraction-free reading mode'}
        className="text-muted-foreground hover:text-accent"
      >
        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </Button>

      {isFullscreen && (
        <div className="fixed inset-0 z-[100] bg-background overflow-y-auto">
          <div className="max-w-3xl mx-auto px-8 py-12">
            <div className="flex justify-end mb-6">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsFullscreen(false)}
                className="text-muted-foreground"
              >
                <Minimize2 className="w-4 h-4 mr-2" /> Exit Reading Mode
              </Button>
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
