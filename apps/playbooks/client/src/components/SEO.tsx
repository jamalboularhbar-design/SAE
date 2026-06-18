import { useEffect } from 'react';
import { BRAND, brandTitle } from '@/lib/brand';

interface SEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  canonical?: string;
  noindex?: boolean;
}

const DEFAULT_TITLE = BRAND.seoTitle;
const DEFAULT_DESCRIPTION = BRAND.seoDescription;
const DEFAULT_OG_IMAGE = '/og-image.png';

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  canonical,
  noindex = false,
}: SEOProps) {
  const fullTitle = title ? brandTitle(title) : DEFAULT_TITLE;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Helper to set/update meta tags
    const setMeta = (property: string, content: string, isName = false) => {
      const attr = isName ? 'name' : 'property';
      let el = document.querySelector(`meta[${attr}="${property}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, property);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    // Standard meta
    setMeta('description', description, true);
    if (noindex) setMeta('robots', 'noindex, nofollow', true);

    // Open Graph
    setMeta('og:title', fullTitle);
    setMeta('og:description', description);
    setMeta('og:image', ogImage);
    setMeta('og:type', ogType);
    if (canonical) setMeta('og:url', canonical);

    // Twitter Card
    setMeta('twitter:card', twitterCard, true);
    setMeta('twitter:title', fullTitle, true);
    setMeta('twitter:description', description, true);
    setMeta('twitter:image', ogImage, true);

    // Canonical link
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonical;
    }

    return () => {
      // Reset title on unmount
      document.title = DEFAULT_TITLE;
    };
  }, [fullTitle, description, ogImage, ogType, twitterCard, canonical, noindex]);

  return null;
}

// Pre-configured SEO for common pages
const pn = BRAND.productName;
export const PAGE_SEO: Record<string, SEOProps> = {
  product: {
    title: 'Product',
    description: `Discover ${pn} — multi-brand operational playbooks with ${BRAND.aiHubName}, knowledge graphs, process timelines, and enterprise collaboration.`,
  },
  pricing: {
    title: 'Pricing',
    description: 'Simple, transparent pricing for teams of all sizes. Start with a 14-day free trial. Plans from $299/month for agencies to custom enterprise solutions.',
  },
  resources: {
    title: 'Resources & Learning Center',
    description: `Guides, whitepapers, and case studies to help your team build better operational systems with ${pn}.`,
  },
  caseStudies: {
    title: 'Case Studies',
    description: `See how agencies and multi-brand operators transformed their operations with ${pn} and ${BRAND.aiHubName}.`,
  },
  changelog: {
    title: 'Changelog',
    description: `Latest product updates, new features, and improvements to ${pn}. See what we shipped this month.`,
  },
  roi: {
    title: 'ROI Calculator',
    description: `Calculate how much time and money your team can save with ${pn}. Input your team size and see annual savings instantly.`,
  },
  successMetrics: {
    title: 'Customer Success Metrics',
    description: `Real results from ${pn} customers: 60% faster onboarding, 73% less time searching, 45% fewer compliance incidents.`,
  },
  faq: {
    title: 'FAQ',
    description: `Frequently asked questions about ${pn} — pricing, AI tools, integrations, security, and getting started.`,
  },
  requestDemo: {
    title: 'Request a Demo',
    description: `Schedule a personalized demo of ${pn}. Tell us about your team and we'll show you how to transform your operations.`,
  },
  startTrial: {
    title: 'Start Free Trial',
    description: `Start your 14-day free trial of ${pn}. No credit card required. Full access to playbooks and ${BRAND.aiHubName}.`,
  },
  referral: {
    title: 'Referral Program',
    description: `Refer ${pn} to your network and earn 1 free month for every successful signup. Share your unique referral link.`,
  },
  apiDocs: {
    title: 'API Documentation',
    description: `Integrate ${pn} with your existing tools. REST API documentation with authentication, endpoints, and code examples.`,
  },
  aiHub: {
    title: BRAND.aiHubName,
    description: `${BRAND.aiHubTagline}. Writing assistant, semantic search, AI chat, summarizer, workflows, and more.`,
  },
};
