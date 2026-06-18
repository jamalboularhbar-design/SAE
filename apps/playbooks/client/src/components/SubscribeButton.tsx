import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Bell, BellOff } from 'lucide-react';
import { toast } from 'sonner';

interface SubscribeButtonProps {
  targetType: 'document' | 'category';
  targetValue: string;
  className?: string;
}

export default function SubscribeButton({ targetType, targetValue, className = '' }: SubscribeButtonProps) {
  const { isAuthenticated } = useAuth();
  const { data: subscriptions } = trpc.subscriptions.list.useQuery(undefined, { enabled: isAuthenticated });
  const utils = trpc.useUtils();

  const isSubscribed = subscriptions?.some(
    s => s.targetType === targetType && s.targetValue === targetValue
  ) ?? false;

  const subscribeMut = trpc.subscriptions.subscribe.useMutation({
    onSuccess: () => { utils.subscriptions.list.invalidate(); toast.success('Subscribed! You\'ll be notified of changes.'); },
  });
  const unsubscribeMut = trpc.subscriptions.unsubscribe.useMutation({
    onSuccess: () => { utils.subscriptions.list.invalidate(); toast.success('Unsubscribed'); },
  });

  if (!isAuthenticated) return null;

  const handleClick = () => {
    if (isSubscribed) {
      unsubscribeMut.mutate({ targetType, targetValue });
    } else {
      subscribeMut.mutate({ targetType, targetValue });
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={subscribeMut.isPending || unsubscribeMut.isPending}
      className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
        isSubscribed
          ? 'bg-accent/10 text-accent border border-accent/30'
          : 'text-muted-foreground hover:text-foreground hover:bg-card/50 border border-border/30'
      } ${className}`}
      title={isSubscribed ? 'Unsubscribe from changes' : 'Subscribe to changes'}
    >
      {isSubscribed ? <BellOff className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
      {isSubscribed ? 'Subscribed' : 'Subscribe'}
    </button>
  );
}
