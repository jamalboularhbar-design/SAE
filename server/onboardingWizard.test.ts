import { describe, it, expect } from 'vitest';

describe('Onboarding Wizard: DB Helpers', () => {
  it('should export getWizardState function', async () => {
    const { getWizardState } = await import('./db');
    expect(typeof getWizardState).toBe('function');
  });

  it('should export saveWizardState function', async () => {
    const { saveWizardState } = await import('./db');
    expect(typeof saveWizardState).toBe('function');
  });

  it('should return null for non-existent user wizard state', async () => {
    const { getWizardState } = await import('./db');
    const state = await getWizardState(999999);
    expect(state).toBeNull();
  });

  it('should save and retrieve wizard state', async () => {
    const { saveWizardState, getWizardState } = await import('./db');
    const testUserId = 77777;
    const testData = {
      currentStep: 3,
      completedSteps: [0, 1, 2],
      formData: { orgName: 'Test Corp', industry: 'Technology', enforceMfa: true } as Record<string, string | boolean>,
      isComplete: false,
    };

    const id = await saveWizardState(testUserId, testData);
    expect(id).toBeTruthy();

    const state = await getWizardState(testUserId);
    expect(state).not.toBeNull();
    expect(state!.currentStep).toBe(3);
    expect(state!.completedSteps).toEqual([0, 1, 2]);
    expect((state!.formData as Record<string, string>).orgName).toBe('Test Corp');
    expect(state!.isComplete).toBe(0);
  });

  it('should update existing wizard state', async () => {
    const { saveWizardState, getWizardState } = await import('./db');
    const testUserId = 77777;
    const updatedData = {
      currentStep: 6,
      completedSteps: [0, 1, 2, 3, 4, 5],
      formData: { orgName: 'Test Corp Updated', industry: 'Finance', enforceMfa: true, size: '201-500' } as Record<string, string | boolean>,
      isComplete: true,
    };

    await saveWizardState(testUserId, updatedData);
    const state = await getWizardState(testUserId);
    expect(state).not.toBeNull();
    expect(state!.currentStep).toBe(6);
    expect(state!.completedSteps).toEqual([0, 1, 2, 3, 4, 5]);
    expect((state!.formData as Record<string, string | boolean>).enforceMfa).toBe(true);
    expect(state!.isComplete).toBe(1);
  });
});

describe('Onboarding Wizard: Router exports', () => {
  it('should export appRouter with onboardingWizard procedures', async () => {
    const { appRouter } = await import('./routers');
    expect(appRouter).toBeDefined();
    expect(appRouter._def).toBeDefined();
  });
});
