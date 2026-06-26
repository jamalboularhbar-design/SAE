import { useWizardRedirect } from '@/hooks/useWizardRedirect';

/**
 * Invisible component that checks if admin users need to complete
 * the enterprise onboarding wizard and redirects them if so.
 */
export default function WizardRedirectGuard() {
  useWizardRedirect();
  return null;
}
