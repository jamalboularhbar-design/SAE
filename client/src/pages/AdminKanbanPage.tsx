import KanbanBoard from '@/components/KanbanBoard';
import { Columns3 } from 'lucide-react';

export default function AdminKanbanPage() {
  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center gap-3 mb-8">
        <Columns3 className="w-6 h-6 text-accent" />
        <div>
          <h1 className="text-2xl font-display text-foreground">Document Workflow Board</h1>
          <p className="text-sm text-muted-foreground">Drag documents between columns or use quick-move buttons to change status</p>
        </div>
      </div>
      <KanbanBoard />
    </div>
  );
}
