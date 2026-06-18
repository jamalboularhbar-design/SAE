import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: React.ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AnalyticsErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[AnalyticsErrorBoundary]', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 rounded-lg border border-border/40 bg-card/50 min-h-[200px] gap-3">
          <AlertTriangle className="w-8 h-8 text-amber-500" />
          <p className="text-sm font-medium text-foreground">
            {this.props.fallbackTitle || 'Failed to load widget'}
          </p>
          <p className="text-xs text-muted-foreground max-w-xs text-center">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <Button variant="outline" size="sm" onClick={this.handleRetry} className="mt-2 gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AnalyticsErrorBoundary;
