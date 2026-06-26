import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Brain, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentQuizProps {
  documentId: number;
  content: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export default function DocumentQuiz({ documentId, content }: DocumentQuizProps) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const { data: cached } = trpc.quiz.get.useQuery({ documentId }, { enabled: showQuiz });
  const generateMutation = trpc.quiz.generate.useMutation({
    onSuccess: () => {
      toast.success('Quiz generated!');
      setAnswers({});
      setSubmitted(false);
    },
    onError: () => toast.error('Failed to generate quiz'),
  });

  const questions: QuizQuestion[] = (() => {
    if (generateMutation.data?.questions) return generateMutation.data.questions;
    if (cached?.questions) {
      try { return JSON.parse(cached.questions); } catch { return []; }
    }
    return [];
  })();

  const score = submitted
    ? questions.reduce((acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0), 0)
    : 0;

  if (!showQuiz) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowQuiz(true)}
        className="gap-2"
      >
        <Brain className="w-4 h-4" />
        Knowledge Quiz
      </Button>
    );
  }

  return (
    <div className="border rounded-lg p-4 mt-4 bg-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          Comprehension Quiz
        </h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              generateMutation.mutate({ documentId, content });
            }}
            disabled={generateMutation.isPending}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${generateMutation.isPending ? 'animate-spin' : ''}`} />
            {questions.length > 0 ? 'Regenerate' : 'Generate Quiz'}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setShowQuiz(false)}>
            Close
          </Button>
        </div>
      </div>

      {generateMutation.isPending && (
        <p className="text-muted-foreground text-sm animate-pulse">Generating quiz questions with AI...</p>
      )}

      {questions.length > 0 && (
        <div className="space-y-4">
          {questions.map((q, qi) => (
            <div key={qi} className="border rounded p-3">
              <p className="font-medium mb-2">{qi + 1}. {q.question}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((opt, oi) => {
                  const isSelected = answers[qi] === oi;
                  const isCorrect = submitted && oi === q.correctIndex;
                  const isWrong = submitted && isSelected && oi !== q.correctIndex;
                  return (
                    <button
                      key={oi}
                      onClick={() => {
                        if (!submitted) setAnswers({ ...answers, [qi]: oi });
                      }}
                      className={`text-left px-3 py-2 rounded border text-sm transition-colors ${
                        isCorrect ? 'bg-green-500/20 border-green-500' :
                        isWrong ? 'bg-red-500/20 border-red-500' :
                        isSelected ? 'bg-primary/20 border-primary' :
                        'hover:bg-accent/50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {isCorrect && <CheckCircle className="w-4 h-4 text-green-500" />}
                        {isWrong && <XCircle className="w-4 h-4 text-red-500" />}
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {!submitted ? (
            <Button
              onClick={() => setSubmitted(true)}
              disabled={Object.keys(answers).length < questions.length}
            >
              Submit Answers
            </Button>
          ) : (
            <div className="flex items-center gap-4 p-3 bg-accent/30 rounded">
              <span className="text-lg font-bold">Score: {score}/{questions.length}</span>
              <span className="text-sm text-muted-foreground">
                {score === questions.length ? 'Perfect! 🎉' : score >= questions.length * 0.6 ? 'Good job! 👍' : 'Keep studying! 📚'}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => { setAnswers({}); setSubmitted(false); }}
              >
                Retry
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
