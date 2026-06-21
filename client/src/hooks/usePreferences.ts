import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';

export interface UserPreferences {
  notificationFrequency: string;
  defaultSort: string;
  readingSpeedWpm: number;
  preferredTheme: string;
}

const DEFAULT_PREFS: UserPreferences = {
  notificationFrequency: 'realtime',
  defaultSort: 'newest',
  readingSpeedWpm: 200,
  preferredTheme: 'dark',
};

export function usePreferences(): UserPreferences {
  const { isAuthenticated } = useAuth();
  const { data } = trpc.preferences.get.useQuery(undefined, {
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  if (!data) return DEFAULT_PREFS;

  return {
    notificationFrequency: data.notificationFrequency || DEFAULT_PREFS.notificationFrequency,
    defaultSort: data.defaultSort || DEFAULT_PREFS.defaultSort,
    readingSpeedWpm: data.readingSpeedWpm || DEFAULT_PREFS.readingSpeedWpm,
    preferredTheme: data.preferredTheme || DEFAULT_PREFS.preferredTheme,
  };
}
