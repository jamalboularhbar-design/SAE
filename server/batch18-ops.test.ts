import { describe, it, expect } from 'vitest';
import {
  getChecklistCompletions, toggleChecklistItem,
  getShiftHandovers, createShiftHandover, resolveShiftHandover,
  getProviders, getProviderById, createProvider, updateProvider, deleteProvider,
  getProviderQualityLogs, addProviderQualityLog,
} from './db';

describe('Batch 18: Operational Persistence - DB Helpers', () => {
  it('should export getChecklistCompletions function', () => {
    expect(typeof getChecklistCompletions).toBe('function');
  });

  it('should export toggleChecklistItem function', () => {
    expect(typeof toggleChecklistItem).toBe('function');
  });

  it('should export getShiftHandovers function', () => {
    expect(typeof getShiftHandovers).toBe('function');
  });

  it('should export createShiftHandover function', () => {
    expect(typeof createShiftHandover).toBe('function');
  });

  it('should export resolveShiftHandover function', () => {
    expect(typeof resolveShiftHandover).toBe('function');
  });

  it('should export getProviders function', () => {
    expect(typeof getProviders).toBe('function');
  });

  it('should export getProviderById function', () => {
    expect(typeof getProviderById).toBe('function');
  });

  it('should export createProvider function', () => {
    expect(typeof createProvider).toBe('function');
  });

  it('should export updateProvider function', () => {
    expect(typeof updateProvider).toBe('function');
  });

  it('should export deleteProvider function', () => {
    expect(typeof deleteProvider).toBe('function');
  });

  it('should export getProviderQualityLogs function', () => {
    expect(typeof getProviderQualityLogs).toBe('function');
  });

  it('should export addProviderQualityLog function', () => {
    expect(typeof addProviderQualityLog).toBe('function');
  });
});

describe('Batch 18: Operational Persistence - Router Procedures', () => {
  it('should export appRouter with checklist procedures', async () => {
    const { appRouter } = await import('./routers');
    expect(appRouter._def.procedures).toHaveProperty('checklist.getCompletions');
    expect(appRouter._def.procedures).toHaveProperty('checklist.toggle');
  });

  it('should export appRouter with handover procedures', async () => {
    const { appRouter } = await import('./routers');
    expect(appRouter._def.procedures).toHaveProperty('handover.list');
    expect(appRouter._def.procedures).toHaveProperty('handover.create');
    expect(appRouter._def.procedures).toHaveProperty('handover.resolve');
  });

  it('should export appRouter with providerPartners procedures', async () => {
    const { appRouter } = await import('./routers');
    expect(appRouter._def.procedures).toHaveProperty('providerPartners.list');
    expect(appRouter._def.procedures).toHaveProperty('providerPartners.getById');
    expect(appRouter._def.procedures).toHaveProperty('providerPartners.create');
    expect(appRouter._def.procedures).toHaveProperty('providerPartners.update');
    expect(appRouter._def.procedures).toHaveProperty('providerPartners.delete');
    expect(appRouter._def.procedures).toHaveProperty('providerPartners.qualityLogs');
    expect(appRouter._def.procedures).toHaveProperty('providerPartners.addQualityLog');
  });
});
