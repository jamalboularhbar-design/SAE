# Agent Reference Guide Builder Workflow

## Overview

This document outlines the complete workflow for building professional operational reference guides using React, Tailwind CSS, and shadcn/ui components. The process follows a structured 5-phase approach that ensures quality, polish, and comprehensive feature implementation.

## Phase 1: System Prompt & Content Development

### Objective
Create a comprehensive system prompt that defines personas, processes, and operational guidelines for your business.

### Key Deliverables
- **Persona Definitions**: Define 2-3 distinct personas with characteristics, communication styles, and responsibilities
- **Process Frameworks**: Document 7-stage operational workflows for each persona
- **Capabilities & Guidelines**: List general capabilities and operational principles

### Questions to Answer
1. What are the distinct operational personas in your business?
2. What is the typical workflow for each persona (7-10 stages)?
3. What core capabilities should be available across all personas?
4. What operational guidelines govern all activities?

### Output Format
Create a markdown file with the following structure:
```markdown
# Agent System Prompt

## Persona 1: [Name]
### Characteristics
- [Characteristic 1]
- [Characteristic 2]

### Process Flow
1. [Stage 1]: [Description]
2. [Stage 2]: [Description]
...

## Persona 2: [Name]
### Characteristics
...

## General Capabilities
- [Capability 1]
- [Capability 2]

## Operational Guidelines
- [Guideline 1]
- [Guideline 2]
```

## Phase 2: Web Project Initialization & Design

### Objective
Set up a React/Tailwind project with premium minimalist design.

### Key Steps

1. **Initialize Project**
   - Use `webdev_init_project` with project name
   - Confirm static frontend template (React 19 + Tailwind 4 + shadcn/ui)

2. **Design System Selection**
   - Choose a design philosophy (e.g., Premium Minimalism, Modern Professional, etc.)
   - Define color palette (primary, accent, secondary colors)
   - Select typography (display font for headers, body font for content)
   - Document design decisions in `ideas.md`

3. **Global Styling**
   - Update `client/src/index.css` with custom theme colors
   - Add Google Fonts for typography
   - Configure Tailwind theme tokens

### Design Considerations
- **Color Palette**: Use semantic colors (accent, secondary, muted) for consistency
- **Typography**: Combine display fonts (Playfair Display) with readable body fonts (Inter)
- **Spacing**: Implement consistent spacing scale (4px, 8px, 16px, 24px, 32px)
- **Depth**: Use subtle shadows and borders for visual hierarchy

## Phase 3: Core Components & Page Structure

### Objective
Build reusable components and establish page layout.

### Essential Components

1. **Header Component**
   - Logo/branding
   - Navigation indicators
   - Status badges (e.g., "Manus & Claude Compatible")

2. **Persona Components** (one per persona)
   - Characteristics display (tabs or cards)
   - Process flow visualization
   - Responsibilities/capabilities listing

3. **Search Component**
   - Real-time search across all content
   - Category and type filtering
   - Results display with metadata

4. **Command Palette Component**
   - Keyboard shortcut (Cmd+K)
   - Quick navigation between personas
   - Export and search access

5. **Process Timeline Component**
   - Visual 7-stage workflow
   - Expandable stage details
   - Progress indicators

### Page Structure
```
Home Page
├── Header
├── Hero Section
├── Persona Tabs
│   ├── Persona 1
│   │   ├── Characteristics
│   │   ├── Process Timeline
│   │   └── Responsibilities
│   └── Persona 2
│       ├── Characteristics
│       ├── Process Timeline
│       └── Responsibilities
├── General Capabilities
└── Operational Guidelines
```

## Phase 4: Advanced Features Implementation

### Objective
Add professional features that enhance usability and functionality.

### Feature 1: Advanced Search
- **Functionality**: Search across personas, processes, capabilities, guidelines
- **Implementation**: Build search index from content, implement filtering by category and type
- **UI**: Search panel with category/type filters, result cards with metadata

### Feature 2: Command Palette
- **Functionality**: Quick access to key actions via Cmd+K keyboard shortcut
- **Implementation**: Use `cmdk` library with command grouping
- **Actions**: Switch personas, export PDF, open search, navigate sections

### Feature 3: Process Timeline
- **Functionality**: Interactive 7-stage workflow visualization
- **Implementation**: Expandable cards with stage details and key activities
- **Interactivity**: Click to expand/collapse, visual progress indicator

### Feature 4: PDF Export
- **Functionality**: Export current persona guide as printable PDF
- **Implementation**: Generate HTML, trigger browser print dialog
- **Customization**: Include title, metadata, formatted content

## Phase 5: Polish & Refinement

### Objective
Ensure the website is production-ready with excellent UX and visual polish.

### Quality Checklist

- [ ] **Responsive Design**: Test on mobile, tablet, desktop
- [ ] **Accessibility**: Keyboard navigation, focus states, color contrast
- [ ] **Performance**: Fast load times, smooth interactions
- [ ] **Consistency**: Design tokens applied throughout
- [ ] **Error Handling**: Graceful fallbacks for edge cases
- [ ] **Browser Compatibility**: Works on modern browsers

### Polish Tasks

1. **Visual Refinement**
   - Verify color contrast ratios
   - Ensure consistent spacing and alignment
   - Add subtle animations/transitions
   - Review typography hierarchy

2. **Interaction Refinement**
   - Smooth hover states
   - Clear focus indicators
   - Responsive button feedback
   - Loading states where applicable

3. **Content Review**
   - Verify all text is accurate and polished
   - Check for typos and grammar
   - Ensure consistent terminology
   - Validate all links and references

4. **Testing**
   - Test search functionality with various queries
   - Verify command palette actions
   - Test persona switching
   - Validate PDF export
   - Check responsive behavior

## Implementation Patterns

### Search Index Pattern
```typescript
// Create searchable index from content
const index = buildSearchIndex();

// Filter by query and category
const results = searchContent(query, index);
const filtered = filterByCategory(results, category);
```

### Component Structure Pattern
```typescript
// Persona component with tabs
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="characteristics">Characteristics</TabsTrigger>
    <TabsTrigger value="process">Process Flow</TabsTrigger>
  </TabsList>
  <TabsContent value="characteristics">
    {/* Characteristics content */}
  </TabsContent>
</Tabs>
```

### Timeline Pattern
```typescript
// Expandable stage cards
{stages.map((stage) => (
  <Card onClick={() => toggleStage(stage.id)}>
    <CardHeader>
      <Badge>{stage.number}</Badge>
      <CardTitle>{stage.title}</CardTitle>
    </CardHeader>
    {isExpanded && <CardContent>{stage.details}</CardContent>}
  </Card>
))}
```

## Best Practices

### Content Organization
- Keep persona definitions concise but comprehensive
- Use consistent terminology across all personas
- Structure processes in logical 7-stage sequences
- Provide clear, actionable descriptions for each stage

### UI/UX
- Use semantic color names (accent, secondary, muted) for consistency
- Implement keyboard shortcuts for power users
- Provide visual feedback for all interactions
- Ensure sufficient whitespace for readability

### Performance
- Lazy load heavy components
- Optimize search index for fast queries
- Cache computed values
- Minimize re-renders with proper React hooks

### Accessibility
- Use semantic HTML elements
- Provide keyboard navigation
- Ensure sufficient color contrast
- Include alt text for images
- Use ARIA labels where appropriate

## Common Pitfalls

### Design Issues
- Inconsistent color usage across components
- Poor contrast between text and background
- Excessive centered layouts lacking visual interest
- Overuse of rounded corners or gradients

### Functionality Issues
- Search not updating results in real-time
- Command palette not triggering on keyboard shortcut
- Timeline stages not expanding/collapsing properly
- Export functionality breaking on certain content

### Content Issues
- Inconsistent terminology between personas
- Missing or incomplete process stage descriptions
- Typos or grammatical errors in guidelines
- Outdated or inaccurate operational information

## Deployment & Maintenance

### Before Publishing
- Run full quality checklist
- Test all features in production environment
- Verify responsive design on multiple devices
- Get stakeholder approval

### After Publishing
- Monitor user feedback
- Track search queries for content gaps
- Update content as processes evolve
- Maintain consistency across personas
