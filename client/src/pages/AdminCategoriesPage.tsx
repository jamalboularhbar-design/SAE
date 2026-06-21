import { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FolderPlus, Trash2, Edit2, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCategoriesPage() {
  const [, setLocation] = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const utils = trpc.useUtils();
  const { data: customCats, isLoading } = trpc.customCategories.list.useQuery();
  const { data: existingCats } = trpc.documents.categories.useQuery();

  const createMutation = trpc.customCategories.create.useMutation({
    onSuccess: () => {
      utils.customCategories.list.invalidate();
      setNewName('');
      setNewDescription('');
      toast.success('Category created');
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.customCategories.update.useMutation({
    onSuccess: () => {
      utils.customCategories.list.invalidate();
      setEditingId(null);
      toast.success('Category updated');
    },
  });

  const deleteMutation = trpc.customCategories.delete.useMutation({
    onSuccess: () => {
      utils.customCategories.list.invalidate();
      toast.success('Category deleted');
    },
  });

  if (authLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" /></div>;
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        <p>Admin access required.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <FolderPlus className="w-5 h-5 text-amber-500" />
          <h1 className="text-lg font-semibold">Manage Categories</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Existing document categories (read-only) */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">Existing Document Categories ({existingCats?.length || 0})</h2>
          <div className="flex flex-wrap gap-2">
            {existingCats?.map((cat: any) => (
              <Badge key={cat.category} variant="outline" className="text-xs">
                {cat.category} ({cat.count})
              </Badge>
            ))}
          </div>
        </div>

        {/* Create new custom category */}
        <div className="border border-border rounded-lg p-4 mb-6">
          <h2 className="text-sm font-medium mb-3">Create Custom Category</h2>
          <div className="flex gap-2">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Category name..."
              className="flex-1"
            />
            <Input
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Description (optional)..."
              className="flex-1"
            />
            <Button
              size="sm"
              disabled={!newName.trim() || createMutation.isPending}
              onClick={() => createMutation.mutate({ name: newName.trim(), description: newDescription.trim() || undefined })}
            >
              <FolderPlus className="w-4 h-4 mr-1" /> Create
            </Button>
          </div>
        </div>

        {/* Custom categories list */}
        <h2 className="text-sm font-medium text-muted-foreground mb-2">Custom Categories</h2>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="animate-pulse h-14 bg-muted/30 rounded-lg" />)}
          </div>
        ) : customCats && customCats.length > 0 ? (
          <div className="space-y-2">
            {customCats.map((cat: any) => (
              <div key={cat.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                {editingId === cat.id ? (
                  <>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 h-8"
                    />
                    <Input
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Description"
                      className="flex-1 h-8"
                    />
                    <Button size="icon" className="h-8 w-8" onClick={() => updateMutation.mutate({ id: cat.id, name: editName, description: editDescription })}>
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingId(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <span className="font-medium text-sm">{cat.name}</span>
                      {cat.description && <p className="text-xs text-muted-foreground">{cat.description}</p>}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => { setEditingId(cat.id); setEditName(cat.name); setEditDescription(cat.description || ''); }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-400 hover:text-red-300"
                      onClick={() => deleteMutation.mutate({ id: cat.id })}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">No custom categories yet. Create one above.</p>
        )}
      </div>
    </div>
  );
}
