import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';

/**
 * Hook that redirects admin users to the onboarding wizard
 * if their enterprise setup is incomplete.
 * Only triggers on admin pages (paths starting with /admin).
 */
export function useWizardRedirect() {
  const { user, isAuthenticated } = useAuth();
  const [location, navigate] = useLocation();
  const { data: wizardState, isLoading } = trpc.onboardingWizard.getState.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === 'admin',
  });

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) return;
    if (user.role !== 'admin') return;
    // Don't redirect if already on the wizard page
    if (location === '/admin/onboarding-wizard') return;
    // Only redirect from admin pages
    if (!location.startsWith('/admin')) return;
    // If wizard state exists and is complete, don't redirect
    if (wizardState?.isComplete) return;
    // If wizard state doesn't exist (null/undefined from query) or is incomplete, redirect
    if (wizardState && !wizardState.isComplete && wizardState.currentStep === 0 && wizardState.completedSteps.length === 0) {
      // Only redirect if they haven't started at all (fresh state)
      navigate('/admin/onboarding-wizard');
    }
  }, [wizardState, isLoading, isAuthenticated, user, location, navigate]);
}
