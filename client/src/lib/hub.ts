import { HUB_SPECIALISTS, HUB_CATEGORIES, HUB_BUSINESSES } from '@shared/hubData';

/** Sample specialists shown on marketing pages (one per major category) */
export const HUB_MARKETING_SAMPLE = [
  HUB_SPECIALISTS.find((s) => s.id === 'brand'),
  HUB_SPECIALISTS.find((s) => s.id === 'sop'),
  HUB_SPECIALISTS.find((s) => s.id === 'strategy'),
  HUB_SPECIALISTS.find((s) => s.id === 'linkedin'),
  HUB_SPECIALISTS.find((s) => s.id === 'automation'),
  HUB_SPECIALISTS.find((s) => s.id === 'research-ai'),
].filter(Boolean);

export { HUB_SPECIALISTS, HUB_CATEGORIES, HUB_BUSINESSES };

export const HUB_ROSTER_STATS = {
  businesses: HUB_BUSINESSES.length,
  specialists: HUB_SPECIALISTS.length,
  categories: HUB_CATEGORIES.length,
  hubVersion: 'jamal-hub-v2',
} as const;
