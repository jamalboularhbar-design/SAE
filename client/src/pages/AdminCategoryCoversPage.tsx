import { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { ArrowLeft, Image, Save, X } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCategoryCoversPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const { data: categories } = trpc.documents.categories.useQuery();
  const { data: covers, refetch } = trpc.categoryCover.all.useQuery();
  const setCoverMut = trpc.categoryCover.set.useMutation({
    onSuccess: () => { refetch(); toast.success('Cover image updated'); },
    onError: () => toast.error('Failed to update cover'),
  });

  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');

  const handleSave = (categoryName: string) => {
    if (!imageUrl.trim()) return;
    setCoverMut.mutate({ categoryName, imageUrl: imageUrl.trim() });
    setEditingCategory(null);
    setImageUrl('');
  };

  const getCoverUrl = (category: string) => {
    return covers?.find(c => c.category === category)?.imageUrl || null;
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Admin access required.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/admin/dashboard')} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Image className="w-5 h-5 text-accent" />
          <h1 className="text-lg font-bold text-foreground">Category Cover Images</h1>
        </div>
      </header>

      <div className="container py-6 max-w-3xl">
        <p className="text-sm text-muted-foreground mb-6">
          Set cover images for each category. These appear on the category listing page as visual headers.
        </p>

        <div className="space-y-3">
          {categories?.map(cat => {
            const coverUrl = getCoverUrl(cat.category);
            const isEditing = editingCategory === cat.category;

            return (
              <div key={cat.category} className="p-4 rounded-xl border border-border/30 bg-card/20">
                <div className="flex items-center gap-4">
                  {/* Preview */}
                  <div className="w-16 h-16 rounded-lg bg-card/50 border border-border/30 overflow-hidden shrink-0 flex items-center justify-center">
                    {coverUrl ? (
                      <img src={coverUrl} alt={cat.category} className="w-full h-full object-cover" />
                    ) : (
                      <Image className="w-6 h-6 text-muted-foreground/30" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{cat.category}</p>
                    <p className="text-xs text-muted-foreground">{cat.count} documents</p>
                    {coverUrl && !isEditing && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{coverUrl}</p>
                    )}
                  </div>

                  {!isEditing && (
                    <button
                      onClick={() => { setEditingCategory(cat.category); setImageUrl(coverUrl || ''); }}
                      className="px-3 py-1.5 rounded-lg text-xs bg-card/50 border border-border/30 text-foreground hover:bg-card/80"
                    >
                      {coverUrl ? 'Change' : 'Set'}
                    </button>
                  )}
                </div>

                {isEditing && (
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={e => setImageUrl(e.target.value)}
                      placeholder="Enter image URL..."
                      className="flex-1 text-sm rounded-lg bg-background border border-border/50 px-3 py-1.5 text-foreground"
                    />
                    <button
                      onClick={() => handleSave(cat.category)}
                      disabled={!imageUrl.trim()}
                      className="p-1.5 rounded-lg bg-accent text-accent-foreground disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setEditingCategory(null); setImageUrl(''); }}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
