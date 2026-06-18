import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star, Download, Plus, Package, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function TemplateMarketplacePage() {
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSubmit, setShowSubmit] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ name: '', description: '', content: '', category: '' });

  const { data: templates, isLoading } = trpc.templateMarketplace.list.useQuery(category ? { category } : undefined);
  const utils = trpc.useUtils();

  const submitTemplate = trpc.templateMarketplace.submit.useMutation({
    onSuccess: () => {
      toast.success('Template submitted successfully!');
      setShowSubmit(false);
      setNewTemplate({ name: '', description: '', content: '', category: '' });
      utils.templateMarketplace.list.invalidate();
    },
  });

  const useTemplate = trpc.templateMarketplace.use.useMutation({
    onSuccess: () => {
      toast.success('Template cloned to your documents!');
      utils.templateMarketplace.list.invalidate();
    },
  });

  const categories = ['Operations', 'Technical', 'Marketing', 'HR', 'Finance', 'Legal', 'General'];

  const filtered = templates?.filter((t: any) =>
    !searchTerm || t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Template Marketplace</h1>
          <Badge variant="secondary">{templates?.length || 0} templates</Badge>
        </div>
        <Dialog open={showSubmit} onOpenChange={setShowSubmit}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Submit Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Submit a Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input
                placeholder="Template name"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
              />
              <Input
                placeholder="Category (e.g., Operations, Technical)"
                value={newTemplate.category}
                onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
              />
              <Textarea
                placeholder="Description"
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                rows={3}
              />
              <Textarea
                placeholder="Template content (Markdown)"
                value={newTemplate.content}
                onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                rows={8}
              />
              <Button
                className="w-full"
                onClick={() => submitTemplate.mutate(newTemplate)}
                disabled={!newTemplate.name || !newTemplate.content || submitTemplate.isPending}
              >
                {submitTemplate.isPending ? 'Submitting...' : 'Submit Template'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={!category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategory(undefined)}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      {!filtered?.length ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No templates found</p>
            <p className="text-sm mt-1">Be the first to submit a template!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((template: any) => (
            <Card key={template.id} className="hover:border-primary/30 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base line-clamp-1">{template.name}</CardTitle>
                  {template.category && (
                    <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                      {template.category}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {template.description || 'No description provided'}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400" />
                      {template.avgRating?.toFixed(1) || '0.0'} ({template.totalRatings})
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {template.usageCount}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => useTemplate.mutate({ id: template.id })}
                  >
                    Use
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  by {template.authorName || 'Anonymous'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
