import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Tag, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentTagsProps {
  slug: string;
}

export default function DocumentTags({ slug }: DocumentTagsProps) {
  const [newTag, setNewTag] = useState('');
  const [showInput, setShowInput] = useState(false);

  const { data: tags, refetch } = trpc.tags.forDocument.useQuery({ slug });

  const addMutation = trpc.tags.add.useMutation({
    onSuccess: (data) => {
      if (data.alreadyExists) {
        toast.info('Tag already exists');
      } else {
        toast.success('Tag added');
        refetch();
      }
      setNewTag('');
      setShowInput(false);
    },
  });

  const removeMutation = trpc.tags.remove.useMutation({
    onSuccess: () => {
      toast.success('Tag removed');
      refetch();
    },
  });

  const handleAddTag = () => {
    const tag = newTag.trim().toLowerCase();
    if (!tag) return;
    addMutation.mutate({ documentSlug: slug, tag });
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Tag className="w-3.5 h-3.5 text-muted-foreground" />
      {tags?.map(tag => (
        <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs">
          {tag}
          <button
            onClick={() => removeMutation.mutate({ documentSlug: slug, tag })}
            className="hover:text-red-400 transition-colors"
            aria-label={`Remove tag ${tag}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      {showInput ? (
        <form
          onSubmit={(e) => { e.preventDefault(); handleAddTag(); }}
          className="inline-flex items-center gap-1"
        >
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="tag name"
            className="w-20 px-2 py-0.5 text-xs rounded bg-card/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50"
            autoFocus
            onBlur={() => { if (!newTag) setShowInput(false); }}
          />
          <button type="submit" className="text-accent hover:text-accent/80 text-xs">Add</button>
        </form>
      ) : (
        <button
          onClick={() => setShowInput(true)}
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors"
          aria-label="Add tag"
        >
          <Plus className="w-3 h-3" />
          <span>tag</span>
        </button>
      )}
    </div>
  );
}
