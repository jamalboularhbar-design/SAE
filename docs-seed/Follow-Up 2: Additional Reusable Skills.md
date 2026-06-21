# Follow-Up 2: Additional Reusable Skills

## Overview

This document outlines three additional reusable skills that extend the ARG-Builder ecosystem. These skills can be used independently or in combination with the main agent system to handle specialized tasks.

## Skill 1: Design System Builder

### Purpose

The Design System Builder skill enables autonomous creation of cohesive, professional design systems for web applications. It handles color palette generation, typography selection, spacing systems, and component styling guidelines.

### When to Use

- Creating design systems for new web projects
- Establishing brand consistency across multiple applications
- Generating design tokens and CSS variables
- Creating design documentation and style guides
- Ensuring accessibility compliance in design systems

### Skill Structure

**SKILL.md Content:**

The Design System Builder skill provides:

**Part 1: Design Philosophy Framework**

The skill guides users through selecting appropriate design philosophies based on business context. It includes detailed descriptions of five core design philosophies: Premium Minimalism (luxury, professional services), Modern Professional (tech, consulting), Warm & Approachable (creative, wellness), Sophisticated Craft (design, publishing), and Bold & Contemporary (startups, innovation).

For each philosophy, the skill provides design characteristics, color psychology, typography recommendations, and visual reference examples. Users answer a series of diagnostic questions about their business positioning, target audience, and brand values. The skill then recommends the most appropriate philosophy with detailed rationale.

**Part 2: Color Palette Generation**

The skill provides systematic processes for generating cohesive color palettes. It includes color psychology guidelines, accessibility requirements (WCAG AA minimum), and practical color selection workflows.

The process starts with selecting a primary accent color that represents the brand. Users consider industry norms, psychological associations, and memorability. The skill provides tools for testing color combinations and verifying contrast ratios.

Next, users select a secondary accent color that complements the primary. The skill guides selection of semantic colors including muted (for secondary content), border (for dividers), ring (for focus states), background, and foreground colors.

The skill includes automated contrast checking and provides recommendations for colors that fail accessibility standards. It generates color palette documentation with hex codes, usage guidelines, and visual swatches.

**Part 3: Typography System Definition**

The skill guides selection of display and body fonts from Google Fonts, ensuring readability and brand alignment. It defines complete typography hierarchies with specific sizes, weights, and line heights for all text elements (h1, h2, h3, p, small, etc.).

The skill provides typography pairing recommendations based on design philosophy. For example, Premium Minimalism pairs Playfair Display (elegant, distinctive) with Inter (highly readable). The skill explains why specific pairings work well together.

Users define a spacing system based on a base unit (typically 4px) with increments for margins, padding, and gaps. The skill ensures visual rhythm and consistency throughout the design.

**Part 4: Component Styling Guidelines**

The skill provides detailed styling guidelines for common UI components. It covers buttons, cards, inputs, modals, navigation, and more. Each component includes styling specifications, hover states, focus indicators, and responsive behavior.

The skill emphasizes consistency through semantic color usage, spacing scale adherence, and typography hierarchy. It provides code examples for implementing components with Tailwind CSS and shadcn/ui.

**Part 5: Design Documentation**

The skill generates comprehensive design documentation including design system overview, color palette with usage guidelines, typography system with examples, spacing system documentation, component styling guidelines, and accessibility checklist.

### Output Deliverables

1. **Design System Documentation** (5,000-7,000 words)
   - Design philosophy with rationale
   - Color palette with accessibility verification
   - Typography system with hierarchy
   - Spacing system with scale
   - Component styling guidelines
   - Accessibility checklist

2. **CSS Variables File** (client/src/index.css)
   - All colors as CSS variables
   - Typography scale as utilities
   - Spacing scale as utilities
   - Theme configuration

3. **Design Tokens JSON** (design-tokens.json)
   - Structured design tokens
   - Color definitions
   - Typography definitions
   - Spacing definitions
   - Machine-readable format

4. **Visual Style Guide** (Figma or similar)
   - Color swatches
   - Typography examples
   - Component examples
   - Usage guidelines

### How to Use

```
I need a professional design system for my [industry] business.

BUSINESS CONTEXT:
- Business Name: [Name]
- Industry: [Industry]
- Target Audience: [Audience]
- Brand Values: [Values]

DESIGN PREFERENCES:
- Any specific colors you want to use: [Colors]
- Any specific fonts or styles: [Fonts]
- Design aesthetic preferences: [Preferences]

Please use the Design System Builder skill to create a cohesive, professional design system.
```

### Quality Standards

- All colors meet WCAG AA contrast standards
- Typography hierarchy is clear and distinct
- Spacing system uses consistent base unit
- Component guidelines are comprehensive
- Documentation is professional and detailed
- All design tokens are machine-readable

---

## Skill 2: Component Library Generator

### Purpose

The Component Library Generator skill creates reusable React components for common UI patterns used in operational reference guides. It generates components with consistent styling, accessibility compliance, and comprehensive documentation.

### When to Use

- Building component libraries for design systems
- Creating reusable UI components for multiple projects
- Standardizing component implementations
- Generating component documentation and examples
- Ensuring accessibility compliance in components

### Skill Structure

**SKILL.md Content:**

The Component Library Generator skill provides:

**Part 1: Component Architecture**

The skill guides users through planning component hierarchies and defining component responsibilities. It emphasizes composition over inheritance, prop-based configuration, and clear separation of concerns.

The skill includes best practices for component naming, file organization, and prop typing. It provides templates for common component patterns including presentational components, container components, and compound components.

**Part 2: Core Component Templates**

The skill provides templates for essential components used in operational reference guides:

**Header Component** - Logo, title, navigation, and status display. The template includes responsive behavior, semantic HTML, and accessibility features.

**Persona Component** - Tabbed interface for displaying persona information including characteristics, process, and responsibilities. The template uses shadcn/ui Tabs component and includes smooth transitions.

**Search Component** - Real-time search with filtering, result display, and metadata. The template includes debouncing, keyboard navigation, and accessibility features.

**Command Palette Component** - Keyboard-accessible command interface using cmdk library. The template includes Cmd+K shortcut, fuzzy matching, and command grouping.

**Process Timeline Component** - Expandable stage cards with visual connectors and progress indicator. The template includes smooth animations and responsive design.

**Card Component** - Reusable card for displaying content with consistent styling. The template includes hover states, shadows, and responsive behavior.

**Part 3: Styling & Theming**

The skill provides guidelines for consistent component styling using Tailwind CSS and CSS variables. It emphasizes semantic color usage, spacing scale adherence, and typography hierarchy.

The skill includes patterns for implementing hover states, focus indicators, disabled states, and loading states. It provides examples of smooth transitions and micro-interactions.

**Part 4: Accessibility Guidelines**

The skill ensures all components meet WCAG AA standards. It includes guidelines for keyboard navigation, screen reader support, color contrast, and focus management.

Each component template includes ARIA labels, semantic HTML, and keyboard event handlers. The skill provides testing procedures for verifying accessibility compliance.

**Part 5: Component Documentation**

The skill generates comprehensive component documentation including component purpose, props documentation, usage examples, accessibility features, and styling guidelines.

### Output Deliverables

1. **Component Library** (components/ directory)
   - Header.tsx
   - Persona.tsx
   - Search.tsx
   - CommandPalette.tsx
   - ProcessTimeline.tsx
   - Card.tsx
   - Additional utility components

2. **Component Documentation** (5,000-8,000 words)
   - Component overview
   - Props documentation
   - Usage examples
   - Accessibility features
   - Styling guidelines
   - Customization patterns

3. **Storybook Configuration** (optional)
   - Component stories
   - Interactive examples
   - Prop controls
   - Accessibility checks

4. **Component Tests** (optional)
   - Unit tests
   - Accessibility tests
   - Integration tests

### How to Use

```
I need a reusable component library for my operational reference guide.

REQUIRED COMPONENTS:
- Header with logo and navigation
- Persona display with tabs
- Search functionality
- Command palette
- Process timeline
- Card component

STYLING REQUIREMENTS:
- Design system: [Design system name]
- Color palette: [Primary color], [Secondary color]
- Typography: [Display font], [Body font]
- Spacing scale: [Base unit]

Please use the Component Library Generator skill to create production-ready components.
```

### Quality Standards

- All components are fully functional and tested
- All components meet WCAG AA accessibility standards
- All components use semantic HTML
- All components are responsive
- All components are well-documented
- All components follow consistent patterns

---

## Skill 3: Feature Implementation Framework

### Purpose

The Feature Implementation Framework skill provides systematic processes for implementing advanced features like search, command palettes, timelines, and export functionality. It includes implementation patterns, testing procedures, and optimization techniques.

### When to Use

- Implementing search functionality
- Building command palettes
- Creating interactive timelines
- Implementing export features (PDF, CSV, etc.)
- Adding advanced UI interactions
- Optimizing feature performance

### Skill Structure

**SKILL.md Content:**

The Feature Implementation Framework skill provides:

**Part 1: Search Implementation**

The skill provides step-by-step guidance for implementing search functionality. It covers search index creation, real-time filtering, result ranking, and performance optimization.

The skill includes patterns for building searchable indexes from structured data. It provides algorithms for fuzzy matching, relevance scoring, and result ranking. It includes optimization techniques for handling large datasets.

The skill covers UI patterns for search including search input, result display, filtering, and empty states. It includes keyboard navigation patterns and accessibility features.

**Part 2: Command Palette Implementation**

The skill provides guidance for implementing keyboard-accessible command palettes. It covers command registration, keyboard shortcuts, fuzzy matching, and command execution.

The skill includes patterns for organizing commands into groups, providing command descriptions, and handling command execution. It provides examples of common commands like navigation, export, and help.

The skill covers keyboard event handling, focus management, and modal interactions. It includes accessibility features like screen reader support and keyboard navigation.

**Part 3: Interactive Timeline Implementation**

The skill provides guidance for implementing interactive timelines with expandable stages, visual connectors, and progress indicators.

The skill covers state management for expanded/collapsed stages, smooth animations, and responsive design. It includes patterns for displaying stage details, key activities, and decision points.

The skill provides performance optimization techniques for handling large timelines and smooth scrolling behavior.

**Part 4: Export Functionality**

The skill provides guidance for implementing export features including PDF export, CSV export, and other formats.

For PDF export, the skill covers HTML generation, styling for print, pagination, and metadata inclusion. It includes patterns for handling complex layouts and ensuring readable output.

The skill includes testing procedures for verifying export quality and handling edge cases.

**Part 5: Performance Optimization**

The skill provides techniques for optimizing feature performance including code splitting, lazy loading, debouncing, and caching.

The skill includes monitoring and profiling techniques for identifying performance bottlenecks. It provides optimization strategies for common issues.

### Output Deliverables

1. **Feature Implementation Guides** (10,000-15,000 words total)
   - Search implementation guide
   - Command palette implementation guide
   - Timeline implementation guide
   - Export functionality guide
   - Performance optimization guide

2. **Implementation Code Examples**
   - Search index creation
   - Search component implementation
   - Command palette component
   - Timeline component
   - Export utility functions

3. **Testing Procedures**
   - Functional testing checklist
   - Performance testing procedures
   - Accessibility testing procedures
   - Edge case testing

4. **Performance Benchmarks**
   - Search performance targets
   - Timeline rendering performance
   - Export generation time
   - Overall application performance

### How to Use

```
I need to implement advanced features for my operational reference guide.

REQUIRED FEATURES:
- Search with 50+ items
- Command palette with 5-6 commands
- Interactive 7-stage timeline
- PDF export

PERFORMANCE REQUIREMENTS:
- Search results appear instantly (< 100ms)
- Page loads in < 3 seconds
- Smooth 60 FPS interactions
- Mobile-friendly performance

Please use the Feature Implementation Framework skill to implement these features.
```

### Quality Standards

- All features are fully functional
- All features meet performance targets
- All features are accessible (WCAG AA)
- All features are well-tested
- All features are well-documented
- All features handle edge cases gracefully

---

## Skill Integration

These three skills can be used independently or in combination:

**Standalone Usage:**
- Use Design System Builder to create a design system for any project
- Use Component Library Generator to build reusable components
- Use Feature Implementation Framework to add advanced features

**Combined Usage:**
- Use Design System Builder → Component Library Generator → Feature Implementation Framework for complete project development
- Use with ARG-Builder agent for end-to-end project delivery

**With ARG-Builder Agent:**
- Phase 2 uses Design System Builder
- Phase 3 uses Component Library Generator
- Phase 4 uses Feature Implementation Framework

---

## Deployment Instructions

To deploy these skills:

1. **Create Skill Directories**
   ```
   /home/ubuntu/skills/design-system-builder/
   /home/ubuntu/skills/component-library-generator/
   /home/ubuntu/skills/feature-implementation-framework/
   ```

2. **Initialize Each Skill**
   - Use skill-creator to initialize each skill
   - Create SKILL.md with comprehensive documentation
   - Create reference materials and templates
   - Create example implementations

3. **Register Skills**
   - Add skills to skill registry
   - Make available to agents
   - Document skill usage

4. **Test Skills**
   - Test each skill independently
   - Test skill combinations
   - Verify outputs meet quality standards

---

## Next Steps

1. Create SKILL.md files for each skill
2. Develop reference materials and templates
3. Create example implementations
4. Test skills thoroughly
5. Document usage patterns
6. Integrate with ARG-Builder agent
