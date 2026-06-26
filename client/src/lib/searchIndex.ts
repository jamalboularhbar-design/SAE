export interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: 'travel' | 'artkech' | 'general';
  section: string;
  type: 'characteristic' | 'process' | 'responsibility' | 'capability' | 'guideline' | 'product';
  content: string;
}

const travelCharacteristics = [
  { title: 'Sophisticated & Discreet', description: 'Communicates with refined tone, understanding privacy and exclusivity needs' },
  { title: 'Knowledgeable', description: 'Deep expertise in luxury travel, Morocco, accommodations, and cultural nuances' },
  { title: 'Proactive & Detail-Oriented', description: 'Anticipates needs, meticulously plans itineraries, manages all logistics' },
  { title: 'Resourceful', description: 'Sources exclusive access, manages complex arrangements, resolves issues' },
  { title: 'Empathetic', description: 'Understands desires of discerning travelers, provides personalized service' },
];

const travelProcessStages = [
  { title: 'Inquiry & Qualification', description: 'Receive initial inquiry, assess client profile' },
  { title: 'Consultation & Proposal', description: 'Conduct detailed consultation, present bespoke itinerary' },
  { title: 'Itinerary Refinement', description: 'Iterate on proposal, secure tentative holds' },
  { title: 'Booking & Confirmation', description: 'Finalize all bookings, provide comprehensive itinerary' },
  { title: 'Pre-Trip Preparation', description: 'Coordinate logistics, share recommendations' },
  { title: 'In-Trip Concierge', description: 'Provide 24/7 support, manage real-time adjustments' },
  { title: 'Post-Trip Follow-up', description: 'Gather feedback, nurture relationship' },
];

const artkechCharacteristics = [
  { title: 'Visionary & Artistic', description: 'Keen eye for design, understanding aesthetic principles' },
  { title: 'Strategic & Problem-Solver', description: 'Identifies reader problems and develops creative solutions' },
  { title: 'Meticulous & Quality-Focused', description: 'Every design element meets highest standards' },
  { title: 'Collaborative & Communicative', description: 'Effectively communicates design concepts' },
  { title: 'Innovative', description: 'Stays abreast of design trends and technologies' },
];

const artkechProcessStages = [
  { title: 'Discovery & Briefing', description: 'Understand client vision and target audience' },
  { title: 'Strategy & Concept', description: 'Develop brand identity or editorial strategy' },
  { title: 'Design & Development', description: 'Execute design work with premium standards' },
  { title: 'Production & Photography', description: 'Coordinate photography and asset creation' },
  { title: 'Review & Refinement', description: 'Present designs and incorporate feedback' },
  { title: 'Pre-Press & Publishing', description: 'Prepare files for print and production' },
  { title: 'Delivery & Launch', description: 'Deliver products and provide launch guidance' },
];

const generalCapabilities = [
  { title: 'Context Switching', description: 'Seamlessly transition between workspaces based on task context' },
  { title: 'Client Communication', description: 'Professional interactions with exceptional service focus' },
  { title: 'Project Management', description: 'Track progress, manage timelines, allocate resources' },
  { title: 'Information Synthesis', description: 'Access and process information from multiple sources' },
  { title: 'Automation & Efficiency', description: 'Streamline workflows and improve operational efficiency' },
  { title: 'Quality Assurance', description: 'Ensure deliverables meet highest standards' },
];

const operationalGuidelines = [
  { title: 'Prioritization', description: 'Tasks prioritized by urgency, client value, and strategic importance' },
  { title: 'Confidentiality', description: 'All client information handled with utmost security' },
  { title: 'Brand Alignment', description: 'Communications adhere to brand voice and quality standards' },
  { title: 'Escalation', description: 'Complex issues promptly escalated to appropriate team members' },
  { title: 'Feedback Integration', description: 'Continuously improve through client and team feedback' },
  { title: 'Proactive Problem Solving', description: 'Identify issues before they arise and implement preventative measures' },
];

export function buildSearchIndex(): SearchResult[] {
  const results: SearchResult[] = [];

  // Travel characteristics
  travelCharacteristics.forEach((char, idx) => {
    results.push({
      id: `travel-char-${idx}`,
      title: char.title,
      description: char.description,
      category: 'travel',
      section: 'Characteristics',
      type: 'characteristic',
      content: `${char.title} ${char.description}`,
    });
  });

  // Travel process stages
  travelProcessStages.forEach((stage, idx) => {
    results.push({
      id: `travel-process-${idx}`,
      title: stage.title,
      description: stage.description,
      category: 'travel',
      section: 'Process Flow',
      type: 'process',
      content: `${stage.title} ${stage.description}`,
    });
  });

  // ArtKech characteristics
  artkechCharacteristics.forEach((char, idx) => {
    results.push({
      id: `artkech-char-${idx}`,
      title: char.title,
      description: char.description,
      category: 'artkech',
      section: 'Characteristics',
      type: 'characteristic',
      content: `${char.title} ${char.description}`,
    });
  });

  // ArtKech process stages
  artkechProcessStages.forEach((stage, idx) => {
    results.push({
      id: `artkech-process-${idx}`,
      title: stage.title,
      description: stage.description,
      category: 'artkech',
      section: 'Process Flow',
      type: 'process',
      content: `${stage.title} ${stage.description}`,
    });
  });

  // General capabilities
  generalCapabilities.forEach((cap, idx) => {
    results.push({
      id: `general-cap-${idx}`,
      title: cap.title,
      description: cap.description,
      category: 'general',
      section: 'Capabilities',
      type: 'capability',
      content: `${cap.title} ${cap.description}`,
    });
  });

  // Operational guidelines
  operationalGuidelines.forEach((guideline, idx) => {
    results.push({
      id: `general-guide-${idx}`,
      title: guideline.title,
      description: guideline.description,
      category: 'general',
      section: 'Guidelines',
      type: 'guideline',
      content: `${guideline.title} ${guideline.description}`,
    });
  });

  return results;
}

export function searchContent(query: string, index: SearchResult[]): SearchResult[] {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  return index.filter(item => 
    item.title.toLowerCase().includes(lowerQuery) ||
    item.description.toLowerCase().includes(lowerQuery) ||
    item.content.toLowerCase().includes(lowerQuery)
  );
}

export function filterByCategory(results: SearchResult[], category: 'travel' | 'artkech' | 'general' | 'all'): SearchResult[] {
  if (category === 'all') return results;
  return results.filter(item => item.category === category);
}

export function filterByType(results: SearchResult[], type: string): SearchResult[] {
  if (type === 'all') return results;
  return results.filter(item => item.type === type as any);
}
