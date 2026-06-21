import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckCircle, Circle, Rocket } from 'lucide-react';

const TASK_LABELS: Record<string, string> = {
  read_5_docs: 'Read 5 documents',
  complete_quiz: 'Complete a quiz',
  bookmark_doc: 'Bookmark a document',
  create_reading_list: 'Create a reading list',
  set_preferences: 'Set your preferences',
  search_document: 'Search for a document',
};

export default function OnboardingChecklist() {
  const utils = trpc.useUtils();
  const { data: tasks, isLoading } = trpc.onboarding.get.useQuery();
  const completeMut = trpc.onboarding.complete.useMutation({
    onSuccess: () => {
      utils.onboarding.get.invalidate();
      toast.success('Task marked complete!');
    },
  });

  if (isLoading) return null;
  if (!tasks || tasks.length === 0) return null;

  const completedCount = tasks.filter((t: any) => t.completed).length;
  const totalCount = tasks.length;
  const allDone = completedCount === totalCount;

  if (allDone) return null;

  return (
    <Card className="border-dashed">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Rocket className="w-4 h-4 text-blue-400" />
          Getting Started
          <span className="text-xs text-muted-foreground ml-auto">{completedCount}/{totalCount}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-1.5 bg-muted rounded-full mb-3">
          <div
            className="h-1.5 bg-blue-500 rounded-full transition-all"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
        <div className="space-y-2">
          {tasks.map((task: any) => (
            <div key={task.id} className="flex items-center gap-2">
              {task.completed ? (
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              )}
              <span className={`text-sm flex-1 ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                {TASK_LABELS[task.taskKey] || task.taskKey}
              </span>
              {!task.completed && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-6 px-2"
                  onClick={() => completeMut.mutate({ taskKey: task.taskKey })}
                  disabled={completeMut.isPending}
                >
                  Mark done
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
