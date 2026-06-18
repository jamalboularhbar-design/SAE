/**
 * NexusAI Shared Types
 * Used across Playbooks, Templates, and Ops Core.
 */

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: 'starter' | 'pro' | 'enterprise';
  stripeCustomerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workspace {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  description?: string;
  branding?: {
    logoUrl?: string;
    primaryColor?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  workspaceId: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  language: string;
  reviewDate?: Date;
  scheduledPublishAt?: Date;
  wordCount: number;
  readTimeMinutes: number;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  organizationId: string;
  createdAt: Date;
}

export type PlanTier = 'starter' | 'pro' | 'enterprise';

export interface PlanLimits {
  workspaces: number;
  documents: number;
  teamMembers: number;
  aiRequestsPerMonth: number;
  clientPortals: number;
}

export const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  starter: {
    workspaces: 3,
    documents: 500,
    teamMembers: 5,
    aiRequestsPerMonth: 100,
    clientPortals: 0,
  },
  pro: {
    workspaces: 10,
    documents: 2000,
    teamMembers: 25,
    aiRequestsPerMonth: 1000,
    clientPortals: 5,
  },
  enterprise: {
    workspaces: Infinity,
    documents: Infinity,
    teamMembers: Infinity,
    aiRequestsPerMonth: Infinity,
    clientPortals: Infinity,
  },
};

export interface TemplateBundle {
  id: string;
  name: string;
  slug: string;
  description: string;
  documentCount: number;
  price: number;
  formats: ('notion' | 'markdown' | 'gdocs' | 'hosted')[];
  categories: string[];
}

export const TEMPLATE_BUNDLES: TemplateBundle[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    slug: 'starter-pack',
    description: '50 core SOPs for HR, finance, sales, and operations',
    documentCount: 50,
    price: 49,
    formats: ['notion', 'markdown', 'gdocs'],
    categories: ['People & Culture', 'Finance & Legal', 'Sales', 'Strategy & Operations'],
  },
  {
    id: 'agency',
    name: 'Agency Pack',
    slug: 'agency-pack',
    description: '100+ agency operations: onboarding, briefs, handoffs, client management',
    documentCount: 100,
    price: 99,
    formats: ['notion', 'markdown', 'gdocs'],
    categories: ['Customer Success', 'Marketing', 'Partnerships & GTM', 'Product'],
  },
  {
    id: 'hospitality',
    name: 'Hospitality Pack',
    slug: 'hospitality-pack',
    description: 'Complete operational playbook for luxury travel and hospitality',
    documentCount: 80,
    price: 149,
    formats: ['notion', 'markdown', 'gdocs'],
    categories: ['Riad & Routes', 'Customer Success', 'Operations & Resources'],
  },
  {
    id: 'design',
    name: 'Design Studio Pack',
    slug: 'design-studio-pack',
    description: 'Premium design studio operations and publishing workflows',
    documentCount: 70,
    price: 149,
    formats: ['notion', 'markdown', 'gdocs'],
    categories: ['ArtKech Design Studio', 'Content & Media', 'Product'],
  },
  {
    id: 'complete',
    name: 'Complete Library',
    slug: 'complete-library',
    description: 'All 280+ operational documents with 1 year of updates',
    documentCount: 280,
    price: 199,
    formats: ['notion', 'markdown', 'gdocs', 'hosted'],
    categories: ['All'],
  },
];
