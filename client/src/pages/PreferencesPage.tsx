import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLocation } from 'wouter';
import { Settings, ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function PreferencesPage() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const { data: prefs, isLoading } = trpc.preferences.get.useQuery(undefined, { enabled: isAuthenticated });
  const saveMut = trpc.preferences.save.useMutation();

  const [notificationFrequency, setNotificationFrequency] = useState('realtime');
  const [defaultSort, setDefaultSort] = useState('newest');
  const [readingSpeedWpm, setReadingSpeedWpm] = useState(200);
  const [preferredTheme, setPreferredTheme] = useState('dark');

  useEffect(() => {
    if (prefs) {
      setNotificationFrequency(prefs.notificationFrequency || 'realtime');
      setDefaultSort(prefs.defaultSort || 'newest');
      setReadingSpeedWpm(prefs.readingSpeedWpm || 200);
      setPreferredTheme(prefs.preferredTheme || 'dark');
    }
  }, [prefs]);

  const handleSave = async () => {
    await saveMut.mutateAsync({ notificationFrequency: notificationFrequency as any, defaultSort, readingSpeedWpm, preferredTheme });
    toast.success('Preferences saved');
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-accent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Please log in to access preferences.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Settings className="w-5 h-5 text-accent" />
          <h1 className="text-lg font-bold text-foreground">Preferences</h1>
        </div>
      </header>

      <div className="container py-8 max-w-2xl">
        <div className="space-y-8">
          {/* Notification Frequency */}
          <div className="p-6 rounded-xl border border-border/50 bg-card/30">
            <h2 className="text-sm font-semibold text-foreground mb-1">Notification Frequency</h2>
            <p className="text-xs text-muted-foreground mb-4">How often you receive notifications about document changes</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['realtime', 'daily', 'weekly', 'off'] as const).map(freq => (
                <button
                  key={freq}
                  onClick={() => setNotificationFrequency(freq)}
                  className={`px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                    notificationFrequency === freq
                      ? 'bg-accent text-white'
                      : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          {/* Default Sort */}
          <div className="p-6 rounded-xl border border-border/50 bg-card/30">
            <h2 className="text-sm font-semibold text-foreground mb-1">Default Sort Order</h2>
            <p className="text-xs text-muted-foreground mb-4">Default sorting for document lists</p>
            <div className="grid grid-cols-3 gap-2">
              {[{ value: 'newest', label: 'Newest First' }, { value: 'alpha', label: 'Alphabetical' }, { value: 'reading_time', label: 'Reading Time' }].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setDefaultSort(opt.value)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    defaultSort === opt.value
                      ? 'bg-accent text-white'
                      : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reading Speed */}
          <div className="p-6 rounded-xl border border-border/50 bg-card/30">
            <h2 className="text-sm font-semibold text-foreground mb-1">Reading Speed</h2>
            <p className="text-xs text-muted-foreground mb-4">Your reading speed in words per minute (affects reading time estimates)</p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={50}
                max={600}
                step={10}
                value={readingSpeedWpm}
                onChange={e => setReadingSpeedWpm(Number(e.target.value))}
                className="flex-1 accent-accent"
              />
              <span className="text-sm font-mono text-foreground w-16 text-right">{readingSpeedWpm} WPM</span>
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>Slow (50)</span>
              <span>Average (200)</span>
              <span>Fast (600)</span>
            </div>
          </div>

          {/* Theme */}
          <div className="p-6 rounded-xl border border-border/50 bg-card/30">
            <h2 className="text-sm font-semibold text-foreground mb-1">Preferred Theme</h2>
            <p className="text-xs text-muted-foreground mb-4">Your preferred color theme</p>
            <div className="grid grid-cols-3 gap-2">
              {[{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }, { value: 'system', label: 'System' }].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setPreferredTheme(opt.value)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    preferredTheme === opt.value
                      ? 'bg-accent text-white'
                      : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saveMut.isPending} className="gap-2">
              {saveMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
