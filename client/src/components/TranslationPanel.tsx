import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Languages, Loader2, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import ContextualHelp from '@/components/ContextualHelp';

const LANGUAGES = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'ru', name: 'Russian' },
  { code: 'nl', name: 'Dutch' },
  { code: 'hi', name: 'Hindi' },
];

interface TranslationPanelProps {
  slug: string;
}

export default function TranslationPanel({ slug }: TranslationPanelProps) {
  const { isAuthenticated } = useAuth();
  const [selectedLang, setSelectedLang] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<{ title: string; content: string } | null>(null);

  const { data: existingTranslations } = trpc.translation.list.useQuery({ slug });
  const generateMut = trpc.translation.generate.useMutation();

  const handleTranslate = async (langCode: string) => {
    setSelectedLang(langCode);
    setShowDropdown(false);
    setIsTranslating(true);
    try {
      const result = await generateMut.mutateAsync({ slug, language: langCode });
      if (result) {
        setTranslatedContent({ title: result.title, content: result.content });
      }
    } catch (err: any) {
      const msg = String(err?.message || '');
      toast.error(msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.toLowerCase().includes('quota') ? 'AI quota reached for today — please try again later.' : 'Translation failed — please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const getTranslationQuery = trpc.translation.get.useQuery(
    { slug, language: selectedLang || 'en' },
    { enabled: false }
  );

  const handleViewExisting = async (langCode: string) => {
    setSelectedLang(langCode);
    setShowDropdown(false);
    setIsTranslating(true);
    try {
      const result = await getTranslationQuery.refetch();
      if (result.data) {
        setTranslatedContent({ title: result.data.translatedTitle, content: result.data.translatedContent });
      }
    } catch {
      // Fallback: regenerate
      try {
        const result = await generateMut.mutateAsync({ slug, language: langCode });
        if (result) setTranslatedContent({ title: result.title, content: result.content });
      } catch {
        toast?.('Translation failed. Please try again.');
      }
    } finally {
      setIsTranslating(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="mt-4 p-4 rounded-xl border border-border/50 bg-card/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-foreground">Translate</h3>
          <ContextualHelp title="Document Translation" description="Translates this document into another language using AI. Translations are cached so you only need to generate once per language." />
        </div>
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDropdown(!showDropdown)}
            disabled={isTranslating}
            className="text-xs"
          >
            {isTranslating ? (
              <><Loader2 className="w-3 h-3 animate-spin mr-1" /> Translating...</>
            ) : (
              <><Languages className="w-3 h-3 mr-1" /> {selectedLang ? LANGUAGES.find(l => l.code === selectedLang)?.name : 'Choose Language'} <ChevronDown className="w-3 h-3 ml-1" /></>
            )}
          </Button>
          {showDropdown && (
            <div className="absolute right-0 top-full mt-1 w-44 py-1 bg-card border border-border/50 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
              {LANGUAGES.map(lang => {
                const hasTranslation = existingTranslations?.some(t => t.language === lang.code);
                return (
                  <button
                    key={lang.code}
                    onClick={() => hasTranslation ? handleViewExisting(lang.code) : handleTranslate(lang.code)}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-muted/50 transition-colors flex items-center justify-between"
                  >
                    <span>{lang.name}</span>
                    {hasTranslation && <span className="text-[10px] text-accent">cached</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {existingTranslations && existingTranslations.length > 0 && !translatedContent && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {existingTranslations.map(t => (
            <button
              key={t.language}
              onClick={() => handleViewExisting(t.language)}
              className="px-2 py-0.5 text-[10px] rounded-full bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
            >
              {LANGUAGES.find(l => l.code === t.language)?.name || t.language}
            </button>
          ))}
        </div>
      )}

      {translatedContent && (
        <div className="mt-3 p-3 rounded-lg bg-background/50 border border-border/30">
          <h4 className="text-sm font-medium text-foreground mb-2">{translatedContent.title}</h4>
          <div className="text-xs text-muted-foreground max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
            {translatedContent.content.slice(0, 2000)}
            {translatedContent.content.length > 2000 && '...'}
          </div>
          <button
            onClick={() => setTranslatedContent(null)}
            className="mt-2 text-[10px] text-accent hover:underline"
          >
            Close translation
          </button>
        </div>
      )}
    </div>
  );
}
