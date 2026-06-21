import { Leaf, Clock, AlertTriangle } from 'lucide-react';

function getFreshness(updatedAt: string | Date | null | undefined, createdAt: string | Date | null | undefined) {
  const date = updatedAt ? new Date(updatedAt) : createdAt ? new Date(createdAt) : null;
  if (!date) return null;
  const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 7) return { label: 'Fresh', color: 'text-emerald-400 bg-emerald-500/10', icon: Leaf };
  if (days <= 30) return { label: 'Recent', color: 'text-blue-400 bg-blue-500/10', icon: Clock };
  if (days <= 90) return { label: 'Aging', color: 'text-amber-400 bg-amber-500/10', icon: Clock };
  return { label: 'Stale', color: 'text-red-400 bg-red-500/10', icon: AlertTriangle };
}

export default function ContentFreshnessBadge({ updatedAt, createdAt }: { updatedAt?: string | Date | null; createdAt?: string | Date | null }) {
  const freshness = getFreshness(updatedAt, createdAt);
  if (!freshness) return null;
  const Icon = freshness.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${freshness.color}`}>
      <Icon className="w-2.5 h-2.5" />
      {freshness.label}
    </span>
  );
}
