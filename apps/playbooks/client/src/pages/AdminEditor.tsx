import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import AdminDependencyManager from '@/components/AdminDependencyManager';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Plus, Pencil, Trash2, Search, FileText, ArrowLeft, Save, X, AlertTriangle, Loader2,
  Pin, PinOff, CheckSquare, Square, Tag, ArrowUpDown, Download
} from 'lucide-react';
import { getLoginUrl } from '@/const';
import { toast } from 'sonner';

type DocStatus = 'draft' | 'review' | 'published';

const CATEGORY_CUSTOM = '__custom__';

const statusColors: Record<DocStatus, string> = {
  draft: 'bg-gray-500/20 text-gray-400',
  review: 'bg-amber-500/20 text-amber-400',
  published: 'bg-emerald-500/20 text-emerald-400',
};

export default function AdminEditor() {
  const [, navigate] = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | DocStatus>('all');
  const [editingDoc, setEditingDoc] = useState<{
    slug?: string; title: string; category: string; content: string;
    status: DocStatus; reviewBy?: string; locale?: string; scheduledPublishAt?: string;
  } | null>(null);
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);

  // Batch selection
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set());
  const [batchAction, setBatchAction] = useState<'none' | 'status' | 'tag' | 'delete'>('none');
  const [batchStatus, setBatchStatus] = useState<DocStatus>('published');
  const [batchTag, setBatchTag] = useState('');
  const [useCustomCategory, setUseCustomCategory] = useState(false);

  const { data: categoriesData } = trpc.documents.categories.useQuery();
  const { data: customCatsData } = trpc.customCategories.list.useQuery();
  const { data: documentsData, refetch } = trpc.documents.list.useQuery({
    limit: 600,
    category: selectedCategory === 'All' ? undefined : selectedCategory,
    search: search || undefined,
    status: statusFilter,
  });

  const utils = trpc.useUtils();

  const createMutation = trpc.documents.create.useMutation({
    onSuccess: () => { refetch(); setEditingDoc(null); toast.success('Document created successfully'); },
    onError: (err) => { toast.error(`Failed to create: ${err.message}`); },
  });
  const updateMutation = trpc.documents.update.useMutation({
    onSuccess: () => { refetch(); setEditingDoc(null); toast.success('Document updated successfully'); },
    onError: (err) => { toast.error(`Failed to update: ${err.message}`); },
  });
  const deleteMutation = trpc.documents.delete.useMutation({
    onSuccess: () => { refetch(); setDeleteSlug(null); toast.success('Document deleted'); },
    onError: (err) => { toast.error(`Failed to delete: ${err.message}`); setDeleteSlug(null); },
  });
  const pinMutation = trpc.documents.pin.useMutation({
    onSuccess: () => { refetch(); toast.success('Document pinned'); },
  });
  const unpinMutation = trpc.documents.unpin.useMutation({
    onSuccess: () => { refetch(); toast.success('Document unpinned'); },
  });
  const batchDeleteMutation = trpc.documents.batchDelete.useMutation({
    onSuccess: (data) => { refetch(); setSelectedSlugs(new Set()); setBatchAction('none'); toast.success(`Deleted ${data.deleted} documents`); },
  });
  const batchStatusMutation = trpc.documents.batchUpdateStatus.useMutation({
    onSuccess: (data) => { refetch(); setSelectedSlugs(new Set()); setBatchAction('none'); toast.success(`Updated ${data.updated} documents`); },
  });
  const batchTagMutation = trpc.documents.batchAddTag.useMutation({
    onSuccess: (data) => { refetch(); setSelectedSlugs(new Set()); setBatchAction('none'); setBatchTag(''); toast.success(`Tagged ${data.added} documents`); },
  });
  const scheduleMutation = trpc.scheduledPublish.schedule.useMutation();

  const categories = useMemo(() => {
    const base = categoriesData ?? [];
    const custom = customCatsData ?? [];
    const existing = new Set(base.map(c => c.category));
    const extras = custom.filter((cc: any) => !existing.has(cc.name)).map((cc: any) => ({ category: cc.name, count: 0 }));
    return [...base, ...extras];
  }, [categoriesData, customCatsData]);
  const documents = useMemo(() => documentsData?.documents ?? [], [documentsData]);

  const handleEditClick = async (slug: string) => {
    setLoadingSlug(slug);
    try {
      const doc = await utils.documents.getBySlug.fetch({ slug });
      if (doc) {
        const categoryNames = categories.map(c => c.category);
        setUseCustomCategory(Boolean(doc.category && !categoryNames.includes(doc.category)));
        setEditingDoc({
          slug,
          title: doc.title,
          category: doc.category,
          content: doc.content || '',
          status: (doc.status as DocStatus) || 'published',
          reviewBy: doc.reviewBy ? new Date(doc.reviewBy).toISOString().split('T')[0] : '',
          locale: (doc as any).locale || 'en',
        });
      } else {
        toast.error('Document not found');
      }
    } catch (err: any) {
      toast.error(`Failed to load document: ${err.message || 'Unknown error'}`);
    } finally {
      setLoadingSlug(null);
    }
  };

  const toggleSelect = (slug: string) => {
    const next = new Set(selectedSlugs);
    if (next.has(slug)) next.delete(slug); else next.add(slug);
    setSelectedSlugs(next);
  };

  const selectAll = () => {
    if (selectedSlugs.size === documents.length) {
      setSelectedSlugs(new Set());
    } else {
      setSelectedSlugs(new Set(documents.map(d => d.slug)));
    }
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-pulse text-muted-foreground">Loading...</div></div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
          <h2 className="text-xl font-semibold text-foreground">Authentication Required</h2>
          <p className="text-muted-foreground">You need to sign in to access the admin editor.</p>
          <Button onClick={() => window.location.href = getLoginUrl()}>Sign In</Button>
        </div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-semibold text-foreground">Access Denied</h2>
          <p className="text-muted-foreground">Only administrators can access the document editor.</p>
          <Button variant="outline" onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    if (!editingDoc) return;
    if (!editingDoc.title.trim() || !editingDoc.category.trim() || !editingDoc.content.trim()) {
      toast.error('Title, category, and content are all required');
      return;
    }
    if (editingDoc.slug) {
      updateMutation.mutate({
        slug: editingDoc.slug,
        title: editingDoc.title,
        category: editingDoc.category,
        content: editingDoc.content,
        status: editingDoc.status,
        reviewBy: editingDoc.reviewBy || undefined,
        locale: editingDoc.locale || 'en',
      });
      // Schedule publish if date is set and status is draft
      if (editingDoc.scheduledPublishAt && editingDoc.status === 'draft') {
        scheduleMutation.mutate({
          documentSlug: editingDoc.slug,
          publishAt: new Date(editingDoc.scheduledPublishAt).toISOString(),
        });
      }
    } else {
      createMutation.mutate({
        title: editingDoc.title,
        category: editingDoc.category,
        content: editingDoc.content,
        status: editingDoc.status,
        locale: editingDoc.locale || 'en',
      });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const selectedArray = Array.from(selectedSlugs);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border/50 bg-card/80 backdrop-blur-md">
        <div className="container py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground">Document Editor</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Admin Panel — Create, edit, manage, and batch-operate documents</p>
            </div>
          </div>
          <Button onClick={() => { setUseCustomCategory(false); setEditingDoc({ title: '', category: '', content: '', status: 'published' }); }} size="sm">
            <Plus className="w-4 h-4 mr-1" /> New Document
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="container py-4 sm:py-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-md border border-border bg-card text-foreground text-sm"
          >
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c.category} value={c.category}>{c.category} ({c.count})</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-md border border-border bg-card text-foreground text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="review">In Review</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Batch actions bar */}
        {selectedSlugs.size > 0 && (
          <div className="flex items-center gap-2 p-3 rounded-lg border border-amber-500/30 bg-amber-500/5">
            <span className="text-sm font-medium">{selectedSlugs.size} selected</span>
            <Button size="sm" variant="outline" onClick={() => setBatchAction('status')}>
              <ArrowUpDown className="w-3 h-3 mr-1" /> Set Status
            </Button>
            <Button size="sm" variant="outline" onClick={() => setBatchAction('tag')}>
              <Tag className="w-3 h-3 mr-1" /> Add Tag
            </Button>
            <Button size="sm" variant="outline" onClick={async () => {
              // Bulk export selected documents as combined markdown
              try {
                const docs = await Promise.all(
                  selectedArray.map(s => utils.documents.getBySlug.fetch({ slug: s }))
                );
                const combined = docs.filter(Boolean).map((d: any) => `# ${d!.title}\n\n${d!.content || ''}`).join('\n\n---\n\n');
                const blob = new Blob([combined], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = window.document.createElement('a');
                a.href = url;
                a.download = `export-${selectedSlugs.size}-documents.md`;
                a.click();
                URL.revokeObjectURL(url);
                toast.success(`Exported ${selectedSlugs.size} documents`);
              } catch { toast.error('Export failed'); }
            }}>
              <Download className="w-3 h-3 mr-1" /> Export
            </Button>
            <Button size="sm" variant="destructive" onClick={() => setBatchAction('delete')}>
              <Trash2 className="w-3 h-3 mr-1" /> Delete
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelectedSlugs(new Set())}>
              <X className="w-3 h-3 mr-1" /> Clear
            </Button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing {documents.length} of {documentsData?.total ?? 0} documents
          </p>
          <Button variant="ghost" size="sm" onClick={selectAll} className="text-xs">
            {selectedSlugs.size === documents.length ? <CheckSquare className="w-3 h-3 mr-1" /> : <Square className="w-3 h-3 mr-1" />}
            {selectedSlugs.size === documents.length ? 'Deselect All' : 'Select All'}
          </Button>
        </div>

        {/* Document List */}
        <div className="space-y-2">
          {documents.map((doc: any) => (
            <div key={doc.slug} className="flex items-center gap-3 p-3 sm:p-4 rounded-lg border border-border/50 bg-card/30 hover:border-accent/30 transition-colors group">
              <button
                onClick={() => toggleSelect(doc.slug)}
                className="flex-shrink-0 text-muted-foreground hover:text-foreground"
              >
                {selectedSlugs.has(doc.slug) ? <CheckSquare className="w-4 h-4 text-amber-500" /> : <Square className="w-4 h-4" />}
              </button>
              <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{doc.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-[10px]">{doc.category}</Badge>
                  <Badge className={`text-[10px] ${statusColors[doc.status as DocStatus] || statusColors.published}`}>
                    {doc.status || 'published'}
                  </Badge>
                  {doc.pinned === 1 && <Badge className="text-[10px] bg-amber-500/20 text-amber-400">📌 Pinned</Badge>}
                  {doc.wordCount && <span className="text-[10px] text-muted-foreground">{Math.ceil(doc.wordCount / 200)} min</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => doc.pinned ? unpinMutation.mutate({ slug: doc.slug }) : pinMutation.mutate({ slug: doc.slug })}
                  title={doc.pinned ? 'Unpin' : 'Pin'}
                >
                  {doc.pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={loadingSlug === doc.slug}
                  onClick={() => handleEditClick(doc.slug)}
                >
                  {loadingSlug === doc.slug ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Pencil className="w-3.5 h-3.5" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleteSlug(doc.slug)}>
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={!!editingDoc} onOpenChange={open => { if (!open) { setEditingDoc(null); setUseCustomCategory(false); } }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingDoc?.slug ? 'Edit Document' : 'Create New Document'}</DialogTitle>
            <DialogDescription>
              {editingDoc?.slug ? 'Modify the document content below.' : 'Fill in the details to create a new document.'}
            </DialogDescription>
          </DialogHeader>
          {editingDoc && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Title</label>
                  <Input
                    value={editingDoc.title}
                    onChange={e => setEditingDoc({ ...editingDoc, title: e.target.value })}
                    placeholder="Document title..."
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
                  {!useCustomCategory ? (
                    <Select
                      value={editingDoc.category || undefined}
                      onValueChange={(val) => {
                        if (val === CATEGORY_CUSTOM) {
                          setUseCustomCategory(true);
                          setEditingDoc({ ...editingDoc, category: '' });
                        } else {
                          setEditingDoc({ ...editingDoc, category: val });
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category..." />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(c => (
                          <SelectItem key={c.category} value={c.category}>
                            {c.category}
                          </SelectItem>
                        ))}
                        <SelectItem value={CATEGORY_CUSTOM}>Custom category...</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={editingDoc.category}
                        onChange={e => setEditingDoc({ ...editingDoc, category: e.target.value })}
                        placeholder="Enter custom category..."
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setUseCustomCategory(false)}
                      >
                        List
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Status</label>
                  <select
                    value={editingDoc.status}
                    onChange={e => setEditingDoc({ ...editingDoc, status: e.target.value as DocStatus })}
                    className="w-full px-3 py-2 rounded-md border border-border bg-card text-foreground text-sm"
                  >
                    <option value="draft">Draft</option>
                    <option value="review">In Review</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Review By (optional)</label>
                  <Input
                    type="date"
                    value={editingDoc.reviewBy || ''}
                    onChange={e => setEditingDoc({ ...editingDoc, reviewBy: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Language</label>
                  <select
                    value={editingDoc.locale || 'en'}
                    onChange={e => setEditingDoc({ ...editingDoc, locale: e.target.value })}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ja">Japanese</option>
                    <option value="zh">Chinese</option>
                    <option value="pt">Portuguese</option>
                    <option value="ar">Arabic</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Schedule Publish (optional)</label>
                  <Input
                    type="datetime-local"
                    value={editingDoc.scheduledPublishAt || ''}
                    onChange={e => setEditingDoc({ ...editingDoc, scheduledPublishAt: e.target.value })}
                    className="text-sm"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">Set a future date to auto-publish this draft.</p>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Content (Markdown)
                  <span className="ml-2 text-muted-foreground/60">
                    {editingDoc.content.split(/\s+/).filter(Boolean).length} words
                  </span>
                </label>
                <Textarea
                  value={editingDoc.content}
                  onChange={e => setEditingDoc({ ...editingDoc, content: e.target.value })}
                  placeholder="Write your document content in Markdown..."
                  className="min-h-[400px] font-mono text-sm"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingDoc(null)} disabled={isSaving}>
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving || !editingDoc?.title || !editingDoc?.category || !editingDoc?.content}>
              {isSaving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dependency Manager - shown when editing an existing doc */}
      {editingDoc && editingDoc.slug && (
        <div className="mt-4">
          <AdminDependencyManager slug={editingDoc.slug} />
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteSlug} onOpenChange={open => !open && setDeleteSlug(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteSlug(null)} disabled={deleteMutation.isPending}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => deleteSlug && deleteMutation.mutate({ slug: deleteSlug })}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Deleting...</> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Batch Status Dialog */}
      <Dialog open={batchAction === 'status'} onOpenChange={open => !open && setBatchAction('none')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Status for {selectedSlugs.size} Documents</DialogTitle>
            <DialogDescription>Choose the new workflow status for the selected documents.</DialogDescription>
          </DialogHeader>
          <select
            value={batchStatus}
            onChange={e => setBatchStatus(e.target.value as DocStatus)}
            className="w-full px-3 py-2 rounded-md border border-border bg-card text-foreground text-sm"
          >
            <option value="draft">Draft</option>
            <option value="review">In Review</option>
            <option value="published">Published</option>
          </select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBatchAction('none')}>Cancel</Button>
            <Button onClick={() => batchStatusMutation.mutate({ slugs: selectedArray, status: batchStatus })} disabled={batchStatusMutation.isPending}>
              {batchStatusMutation.isPending ? 'Updating...' : 'Apply'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Batch Tag Dialog */}
      <Dialog open={batchAction === 'tag'} onOpenChange={open => !open && setBatchAction('none')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tag to {selectedSlugs.size} Documents</DialogTitle>
            <DialogDescription>Enter the tag to add to all selected documents.</DialogDescription>
          </DialogHeader>
          <Input
            value={batchTag}
            onChange={e => setBatchTag(e.target.value)}
            placeholder="Tag name..."
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setBatchAction('none')}>Cancel</Button>
            <Button onClick={() => batchTagMutation.mutate({ slugs: selectedArray, tag: batchTag })} disabled={!batchTag.trim() || batchTagMutation.isPending}>
              {batchTagMutation.isPending ? 'Tagging...' : 'Add Tag'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Batch Delete Dialog */}
      <Dialog open={batchAction === 'delete'} onOpenChange={open => !open && setBatchAction('none')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {selectedSlugs.size} Documents</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedSlugs.size} documents? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBatchAction('none')}>Cancel</Button>
            <Button variant="destructive" onClick={() => batchDeleteMutation.mutate({ slugs: selectedArray })} disabled={batchDeleteMutation.isPending}>
              {batchDeleteMutation.isPending ? 'Deleting...' : `Delete ${selectedSlugs.size} Documents`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
