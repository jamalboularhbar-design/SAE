---
name: agent-reference-guide-builder
description: Build professional operational reference guides with dual personas, advanced search, command palette, and process timelines. Use for creating interactive team guides, operational playbooks, and business process documentation with premium design and full-featured interactivity.
---

# Agent Reference Guide Builder

This skill provides a complete workflow for building professional, interactive operational reference guides. It's designed for businesses with multiple operational personas (e.g., luxury travel concierge + creative studio director) that need a centralized, searchable guide for team coordination and client communication.

## What You'll Build

A production-ready React web application featuring:

- **Dual Persona System**: Switch seamlessly between distinct operational personas
- **Advanced Search**: Real-time search across all content with category/type filtering
- **Command Palette**: Keyboard-driven access (Cmd+K) to key actions
- **Interactive Process Timelines**: 7-stage workflows with expandable details
- **PDF Export**: Download persona guides as printable documents
- **Premium Design**: Dark theme with semantic colors and sophisticated typography

## When to Use This Skill

Use this skill when you need to:

- Create an operational reference guide for your team
- Document distinct business personas and their workflows
- Build an interactive, searchable knowledge base
- Establish a centralized source of truth for processes
- Enable quick access to operational information via search and keyboard shortcuts

## Prerequisites

- Clear understanding of your business personas (2-3 personas recommended)
- Documented 7-stage process flows for each persona
- List of core capabilities and operational guidelines
- Willingness to invest in premium design and polish

## Workflow Overview

The skill follows a 5-phase approach:

1. **System Prompt & Content Development** - Define personas and processes
2. **Web Project Initialization & Design** - Set up React project with design system
3. **Core Components & Page Structure** - Build reusable components
4. **Advanced Features Implementation** - Add search, command palette, timelines
5. **Polish & Refinement** - Ensure production-ready quality

## Phase 1: System Prompt & Content Development

### Objective
Create a comprehensive system prompt that defines all personas, processes, and guidelines.

### Steps

1. **Define Your Personas**
   - Identify 2-3 distinct operational personas in your business
   - For each persona, document:
     - 5 core characteristics
     - Communication style (3-4 approaches)
     - Responsibilities and key activities

2. **Document Process Flows**
   - Create a 7-stage workflow for each persona
   - For each stage, include:
     - Stage number and title
     - Clear description
     - 2-3 key activities or deliverables

3. **List General Capabilities**
   - Identify 6-8 capabilities shared across personas
   - Examples: Context Switching, Client Communication, Project Management

4. **Define Operational Guidelines**
   - Document 6-8 operational principles
   - Examples: Prioritization, Confidentiality, Brand Alignment

### Output
Create a markdown file with all persona definitions, process flows, capabilities, and guidelines. See `references/workflow.md` for detailed structure.

## Phase 2: Web Project Initialization & Design

### Objective
Set up a React/Tailwind project with a cohesive design system.

### Steps

1. **Initialize Web Project**
   ```bash
   # Use webdev_init_project with project name
   # Select static frontend template (React 19 + Tailwind 4 + shadcn/ui)
   ```

2. **Choose Design Philosophy**
   - Select a design approach (e.g., Premium Minimalism, Modern Professional)
   - Define color palette:
     - Primary accent color (e.g., gold for luxury travel)
     - Secondary color (e.g., sage green for creative studio)
     - Semantic colors (muted, border, ring)
   - Select typography:
     - Display font for headers (e.g., Playfair Display)
     - Body font for content (e.g., Inter)

3. **Update Global Styling**
   - Edit `client/src/index.css` with theme colors
   - Add Google Fonts to `client/index.html`
   - Configure Tailwind theme tokens

### Design Considerations

- **Color Consistency**: Use semantic color names (accent, secondary, muted) throughout
- **Typography Hierarchy**: Combine display and body fonts for clear visual structure
- **Spacing System**: Implement consistent spacing (4px, 8px, 16px, 24px, 32px)
- **Depth & Shadows**: Use subtle shadows for visual hierarchy

## Phase 3: Core Components & Page Structure

### Objective
Build reusable components and establish the page layout.

### Essential Components

1. **Header Component** (`components/Header.tsx`)
   - Logo/branding
   - Subtitle/tagline
   - Status badge

2. **Persona Components** (`components/personas/`)
   - One component per persona
   - Tabbed interface (Characteristics, Process, Responsibilities)
   - Characteristic cards with descriptions

3. **Search Component** (`components/Search.tsx`)
   - Real-time search input
   - Category filters (Travel, ArtKech, General)
   - Type filters (Characteristic, Process, Capability, Guideline)
   - Result cards with metadata

4. **Command Palette Component** (`components/CommandPalette.tsx`)
   - Cmd+K keyboard shortcut
   - Grouped commands (Navigation, Export, Tools)
   - Quick actions for persona switching and export

5. **Process Timeline Component** (`components/ProcessTimeline.tsx`)
   - Numbered stage badges (1-7)
   - Expandable stage cards
   - Key activities listing
   - Progress indicator

### Page Structure

```
Home Page
├── Header
├── Hero Section
├── Toolbar (Search + Command Palette)
├── Persona Tabs
│   ├── Persona 1
│   │   ├── Characteristics
│   │   ├── Process Timeline
│   │   └── Responsibilities
│   └── Persona 2
│       ├── Characteristics
│       ├── Process Timeline
│       └── Responsibilities
├── General Capabilities (6-8 cards)
└── Operational Guidelines (6-8 cards)
```

### Implementation Reference

See `references/components.md` for complete component templates and patterns.

## Phase 4: Advanced Features Implementation

### Feature 1: Advanced Search

**Functionality**: Search across all personas, processes, capabilities, and guidelines with real-time filtering.

**Implementation**:
1. Create `lib/searchIndex.ts` with search utilities
2. Build index from persona data (characteristics, processes, capabilities, guidelines)
3. Implement search, category filter, and type filter functions
4. Create Search component with filter UI and result display

**Key Files**:
- `lib/searchIndex.ts` - Search index and filtering logic
- `components/Search.tsx` - Search UI component

### Feature 2: Command Palette

**Functionality**: Keyboard-driven access to key actions via Cmd+K.

**Implementation**:
1. Use `cmdk` library for command interface
2. Group commands by category (Navigation, Export, Tools)
3. Implement keyboard shortcut detection
4. Add actions: Switch personas, Export PDF, Open Search

**Key Files**:
- `components/CommandPalette.tsx` - Command palette UI

### Feature 3: Process Timeline

**Functionality**: Interactive 7-stage workflow visualization.

**Implementation**:
1. Create ProcessTimeline component
2. Implement expandable stage cards
3. Add visual connector lines between stages
4. Include progress indicator
5. Display key activities for each stage

**Key Files**:
- `components/ProcessTimeline.tsx` - Timeline component

### Feature 4: PDF Export

**Functionality**: Export current persona guide as printable PDF.

**Implementation**:
1. Create `lib/exportPdf.ts` with PDF generation utilities
2. Generate HTML with styled content
3. Trigger browser print dialog
4. Include title, metadata, and formatted content

**Key Files**:
- `lib/exportPdf.ts` - PDF export utilities

## Phase 5: Polish & Refinement

### Quality Checklist

- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Keyboard navigation and accessibility
- [ ] Fast load times and smooth interactions
- [ ] Consistent design tokens throughout
- [ ] Graceful error handling
- [ ] Cross-browser compatibility

### Polish Tasks

1. **Visual Refinement**
   - Verify color contrast ratios (WCAG AA minimum)
   - Ensure consistent spacing and alignment
   - Add subtle animations/transitions
   - Review typography hierarchy

2. **Interaction Refinement**
   - Smooth hover states on all interactive elements
   - Clear focus indicators for keyboard navigation
   - Responsive button feedback
   - Loading states where applicable

3. **Content Review**
   - Verify all text is accurate and polished
   - Check for typos and grammar
   - Ensure consistent terminology
   - Validate all links and references

4. **Testing**
   - Test search with various queries
   - Verify command palette actions
   - Test persona switching
   - Validate PDF export
   - Check responsive behavior on multiple devices

## Bundled Resources

### References

- **`workflow.md`** - Complete 5-phase workflow with detailed steps and best practices
- **`components.md`** - Component templates, patterns, and implementation examples

### Scripts

- **`generate_search_index.py`** - Generate TypeScript search index from YAML/JSON persona definitions
  ```bash
  python scripts/generate_search_index.py --input personas.yaml --output search_index.ts
  ```

### Templates

- **`personas_template.yaml`** - YAML template for defining personas, processes, and guidelines

## Quick Start

1. **Define Your Content**
   - Copy `templates/personas_template.yaml`
   - Fill in your personas, processes, and guidelines
   - Save as `personas.yaml`

2. **Initialize Project**
   - Run `webdev_init_project` with your project name
   - Select static frontend template

3. **Generate Search Index** (optional)
   ```bash
   python scripts/generate_search_index.py --input personas.yaml --output search_index.ts
   ```

4. **Build Components**
   - Create Header, Persona, Search, CommandPalette, ProcessTimeline components
   - Update Home page with persona tabs and content

5. **Add Features**
   - Implement search functionality
   - Add command palette
   - Create process timelines
   - Add PDF export

6. **Polish & Deploy**
   - Test all features
   - Refine design and interactions
   - Create checkpoint and publish

## Common Patterns

### Search Index Pattern
```typescript
const index = buildSearchIndex();
const results = searchContent(query, index);
const filtered = filterByCategory(results, 'travel');
```

### Persona Switching Pattern
```typescript
const [activePersona, setActivePersona] = useState('travel');
// Use in Tabs component
<Tabs value={activePersona} onValueChange={setActivePersona}>
```

### Timeline Pattern
```typescript
{stages.map((stage) => (
  <Card onClick={() => toggleStage(stage.id)}>
    <Badge>{stage.number}</Badge>
    <CardTitle>{stage.title}</CardTitle>
    {isExpanded && <CardContent>{stage.details}</CardContent>}
  </Card>
))}
```

## Best Practices

### Content Organization
- Keep persona definitions concise but comprehensive
- Use consistent terminology across all personas
- Structure processes in logical 7-stage sequences
- Provide clear, actionable descriptions

### UI/UX
- Use semantic color names for consistency
- Implement keyboard shortcuts for power users
- Provide visual feedback for all interactions
- Ensure sufficient whitespace for readability

### Performance
- Lazy load heavy components
- Optimize search index for fast queries
- Cache computed values
- Minimize re-renders with React hooks

### Accessibility
- Use semantic HTML elements
- Provide keyboard navigation
- Ensure sufficient color contrast
- Include alt text for images
- Use ARIA labels where appropriate

## Troubleshooting

### Search Not Working
- Verify search index is built correctly
- Check that content is properly indexed
- Ensure search component is receiving index data

### Command Palette Not Triggering
- Verify keyboard event listener is attached
- Check browser console for errors
- Test with different keyboard combinations

### Timeline Not Expanding
- Verify expandedStage state is updating
- Check that click handler is attached to card
- Ensure CSS classes for expanded state are applied

### PDF Export Not Working
- Verify browser print dialog is triggered
- Check that HTML content is properly formatted
- Test with different browsers

## Next Steps

After building your reference guide, consider:

1. **Team Member Roles Dashboard** - Map team members to process stages
2. **Client Intake Forms** - Auto-populate based on client profiles
3. **Real-Time Collaboration** - Add shared notes and status updates
4. **Analytics** - Track which sections are most accessed
5. **Mobile App** - Convert to mobile-friendly version
6. **API Integration** - Connect to external systems (CRM, project management)

## Support & Iteration

This skill is designed for iteration. After building your first reference guide:

1. Use it with your team
2. Gather feedback on what's missing or unclear
3. Identify content gaps or process improvements
4. Update personas and processes based on real usage
5. Add new features based on team needs

The skill provides a solid foundation; customize it to your specific business needs.
