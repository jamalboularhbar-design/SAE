import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, LayoutDashboard, BookOpen, BarChart3, Settings, Check } from 'lucide-react';
import { toast } from 'sonner';

const landingOptions = [
  { value: '/', label: 'Home Page', description: 'Public landing page with search and popular docs', icon: Home },
  { value: '/dashboard', label: 'My Dashboard', description: 'Personal dashboard with reading stats and bookmarks', icon: LayoutDashboard },
  { value: '/documents', label: 'Documents', description: 'Browse all documents and categories', icon: BookOpen },
  { value: '/admin/dashboard', label: 'Admin Dashboard', description: 'Admin overview with system metrics (admin only)', icon: BarChart3 },
  { value: '/admin/advanced-analytics', label: 'Advanced Analytics', description: 'Full analytics suite with charts (admin only)', icon: Settings },
];

export default function LandingPreferencePage() {
  const { data: pref, isLoading } = trpc.landingPreference.get.useQuery();
  const utils = trpc.useUtils();
  const setLanding = trpc.landingPreference.set.useMutation({
    onSuccess: () => {
      utils.landingPreference.get.invalidate();
      toast.success('Landing page preference saved');
    },
  });

  const currentLanding = pref?.landingPage || '/';

  return (
    <div className="container max-w-3xl py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Home className="w-6 h-6 text-primary" />
          Landing Page Preference
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Choose which page loads when you first visit the site</p>
      </div>

      <div className="space-y-3">
        {landingOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = currentLanding === option.value;
          return (
            <Card
              key={option.value}
              className={`cursor-pointer transition-colors ${isSelected ? 'border-primary bg-primary/5' : 'hover:border-border/80'}`}
              onClick={() => !isSelected && setLanding.mutate({ landingPage: option.value })}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{option.label}</CardTitle>
                    {isSelected && <Badge className="bg-primary/20 text-primary text-xs"><Check className="w-3 h-3 mr-1" />Active</Badge>}
                  </div>
                  <CardDescription className="text-xs mt-0.5">{option.description}</CardDescription>
                </div>
                <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{option.value}</code>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading preference...</p>}
    </div>
  );
}
