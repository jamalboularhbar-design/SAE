import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { toast } from 'sonner';

interface Props {
  documentId: number;
  totalQuestions: number;
  correctAnswers: number;
}

export default function QuizResultsSaver({ documentId, totalQuestions, correctAnswers }: Props) {
  const { isAuthenticated } = useAuth();
  const saveMutation = trpc.quizResults.save.useMutation({
    onSuccess: () => toast.success('Quiz results saved!'),
    onError: () => toast.error('Failed to save quiz results'),
  });

  if (!isAuthenticated) return null;

  const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  const handleSave = () => {
    saveMutation.mutate({ documentId, totalQuestions, correctAnswers, score });
  };

  return { handleSave, isPending: saveMutation.isPending };
}

// Export as a hook for use in DocumentQuiz
export function useQuizResultsSaver() {
  const { isAuthenticated } = useAuth();
  const saveMutation = trpc.quizResults.save.useMutation({
    onSuccess: () => toast.success('Quiz results saved to your profile!'),
    onError: () => toast.error('Failed to save quiz results'),
  });

  const saveResults = (documentId: number, totalQuestions: number, correctAnswers: number) => {
    if (!isAuthenticated) return;
    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    saveMutation.mutate({ documentId, totalQuestions, correctAnswers, score });
  };

  return { saveResults, isPending: saveMutation.isPending };
}
