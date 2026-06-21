import { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Pause, Play, Square, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TextToSpeechProps {
  content: string;
}

export default function TextToSpeech({ content }: TextToSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const [progress, setProgress] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Strip markdown to get plain text
  const plainText = content
    .replace(/```[\s\S]*?```/g, '') // code blocks
    .replace(/`[^`]+`/g, '') // inline code
    .replace(/!\[.*?\]\(.*?\)/g, '') // images
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1') // links -> text
    .replace(/#{1,6}\s/g, '') // headings
    .replace(/[*_~]{1,3}/g, '') // bold/italic/strikethrough
    .replace(/>\s/g, '') // blockquotes
    .replace(/[-*+]\s/g, '') // list items
    .replace(/\d+\.\s/g, '') // numbered lists
    .replace(/\|.*\|/g, '') // tables
    .replace(/---+/g, '') // horizontal rules
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, ' ')
    .trim();

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    stop();

    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Try to use a good English voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.name.includes('Google') && v.lang.startsWith('en'))
      || voices.find(v => v.lang.startsWith('en'));
    if (preferred) utterance.voice = preferred;

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(100);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);

    // Estimate progress based on time and rate
    const estimatedDuration = (plainText.split(' ').length / (150 * rate)) * 60 * 1000;
    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / estimatedDuration) * 100, 99);
      setProgress(pct);
    }, 500);
  }, [plainText, rate, isPaused, stop]);

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (!('speechSynthesis' in window)) return null;

  return (
    <div className="border rounded-lg p-4 mt-4">
      <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
        <Volume2 className="w-4 h-4 text-primary" />
        Text-to-Speech
      </h3>

      <div className="flex items-center gap-2">
        {!isPlaying && !isPaused && (
          <Button variant="outline" size="sm" onClick={play} className="gap-1.5">
            <Play className="w-3.5 h-3.5" /> Play
          </Button>
        )}
        {isPlaying && (
          <Button variant="outline" size="sm" onClick={pause} className="gap-1.5">
            <Pause className="w-3.5 h-3.5" /> Pause
          </Button>
        )}
        {isPaused && (
          <Button variant="outline" size="sm" onClick={play} className="gap-1.5">
            <Play className="w-3.5 h-3.5" /> Resume
          </Button>
        )}
        {(isPlaying || isPaused) && (
          <Button variant="outline" size="sm" onClick={stop} className="gap-1.5">
            <Square className="w-3.5 h-3.5" /> Stop
          </Button>
        )}

        <div className="flex items-center gap-1 ml-2">
          <span className="text-xs text-muted-foreground">Speed:</span>
          {[0.75, 1, 1.25, 1.5, 2].map(r => (
            <button
              key={r}
              onClick={() => setRate(r)}
              className={`px-1.5 py-0.5 text-xs rounded ${
                rate === r ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {r}x
            </button>
          ))}
        </div>
      </div>

      {(isPlaying || isPaused || progress > 0) && (
        <div className="mt-2">
          <div className="h-1.5 bg-accent/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isPaused ? 'Paused' : isPlaying ? 'Playing...' : 'Complete'}
          </p>
        </div>
      )}
    </div>
  );
}
