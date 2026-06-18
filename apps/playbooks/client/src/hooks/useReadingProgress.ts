import { useState, useEffect, useCallback } from 'react';

interface ReadingState {
  scrollPercent: number;
  lastRead: number;
}

const STORAGE_KEY = 'arg-reading-progress';

function getProgressMap(): Record<string, ReadingState> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveProgressMap(map: Record<string, ReadingState>) {
  // Keep only last 50 entries
  const entries = Object.entries(map).sort((a, b) => b[1].lastRead - a[1].lastRead).slice(0, 50);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(entries)));
}

export function useReadingProgress(slug: string) {
  const [savedProgress, setSavedProgress] = useState<number>(0);

  // Load saved progress on mount
  useEffect(() => {
    const map = getProgressMap();
    const entry = map[slug];
    if (entry) {
      setSavedProgress(entry.scrollPercent);
      // Restore scroll position after a short delay to let content render
      setTimeout(() => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (maxScroll > 0) {
          window.scrollTo({ top: (entry.scrollPercent / 100) * maxScroll, behavior: 'auto' });
        }
      }, 300);
    }
  }, [slug]);

  // Save progress periodically
  const saveProgress = useCallback(() => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;
    const percent = Math.round((window.scrollY / maxScroll) * 100);
    const map = getProgressMap();
    map[slug] = { scrollPercent: percent, lastRead: Date.now() };
    saveProgressMap(map);
  }, [slug]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(saveProgress, 1000); // Debounce 1s
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('scroll', handleScroll);
      saveProgress(); // Save on unmount
    };
  }, [saveProgress]);

  return { savedProgress };
}

export function getReadingProgressForSlug(slug: string): number {
  const map = getProgressMap();
  return map[slug]?.scrollPercent ?? 0;
}
