import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Settings2, Plus, Trash2, GripVertical, Type, Hash, Calendar, List, ToggleLeft } from 'lucide-react';
import { toast } from 'sonner';

const FIELD_TYPES = [
  { value: 'text', label: 'Text', icon: Type },
  { value: 'number', label: 'Number', icon: Hash },
  { value: 'date', label: 'Date', icon: Calendar },
  { value: 'select', label: 'Dropdown', icon: List },
  { value: 'boolean', label: 'Toggle', icon: ToggleLeft },
];

const CATEGORIES = ['general', 'technical', 'compliance', 'operations', 'hr'];

export default function CustomFieldsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [newField, setNewField] = useState({ name: '', label: '', fieldType: 'text', category: 'general', options: '' });

  const { data: fields, refetch } = trpc.customFields.getDefinitions.useQuery({ category: selectedCategory });

  const createMutation = trpc.customFields.createField.useMutation({
    onSuccess: () => {
      toast.success('Custom field created');
      setCreateDialogOpen(false);
      setNewField({ name: '', label: '', fieldType: 'text', category: selectedCategory, options: '' });
      refetch();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = trpc.customFields.deleteField.useMutation({
    onSuccess: () => {
      toast.success('Field deleted');
      refetch();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const handleCreate = () => {
    if (!newField.name || !newField.label) {
      toast.error('Name and label are required');
      return;
    }
    const options = newField.fieldType === 'select' && newField.options
      ? newField.options.split(',').map((o: string) => o.trim())
      : undefined;
    createMutation.mutate({
      name: newField.name.toLowerCase().replace(/\s+/g, '_'),
      label: newField.label,
      fieldType: newField.fieldType,
      category: newField.category || selectedCategory,
      options: options ? JSON.stringify(options) : undefined,
    });
  };

  const getFieldIcon = (type: string) => {
    const ft = FIELD_TYPES.find(f => f.value === type);
    return ft ? ft.icon : Type;
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Settings2 className="w-6 h-6 text-accent" />
              Custom Field Definitions
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Define custom metadata fields for documents by category</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-1" /> Add Field
          </Button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {CATEGORIES.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="capitalize"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Fields list */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm capitalize">{selectedCategory} Fields</CardTitle>
          </CardHeader>
          <CardContent>
            {(!fields || fields.length === 0) ? (
              <div className="text-center py-8 text-muted-foreground">
                <Settings2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No custom fields defined for this category yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {fields.map((field: any) => {
                  const Icon = getFieldIcon(field.fieldType);
                  return (
                    <div
                      key={field.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-accent/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-4 h-4 text-muted-foreground/50 cursor-grab" />
                        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{field.label}</p>
                          <p className="text-xs text-muted-foreground font-mono">{field.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs capitalize">{field.fieldType}</Badge>
                        {field.isRequired ? (
                          <Badge className="text-xs bg-red-600">Required</Badge>
                        ) : null}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteMutation.mutate({ id: field.id })}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create field dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Custom Field</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Label</label>
              <Input
                placeholder="e.g. Compliance Level"
                value={newField.label}
                onChange={(e) => setNewField(prev => ({ ...prev, label: e.target.value, name: e.target.value.toLowerCase().replace(/\s+/g, '_') }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Field Name (auto-generated)</label>
              <Input value={newField.name} readOnly className="font-mono text-xs bg-muted" />
            </div>
            <div>
              <label className="text-sm font-medium">Type</label>
              <Select value={newField.fieldType} onValueChange={(v) => setNewField(prev => ({ ...prev, fieldType: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map(ft => (
                    <SelectItem key={ft.value} value={ft.value}>{ft.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {newField.fieldType === 'select' && (
              <div>
                <label className="text-sm font-medium">Options (comma-separated)</label>
                <Input
                  placeholder="Option A, Option B, Option C"
                  value={newField.options}
                  onChange={(e) => setNewField(prev => ({ ...prev, options: e.target.value }))}
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select value={newField.category} onValueChange={(v) => setNewField(prev => ({ ...prev, category: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Field'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
