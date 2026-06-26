# Agent Reference Guide Builder: 5-Phase Workflow - Detailed Explanation

## Overview

The 5-phase workflow transforms your business operational knowledge into a professional, interactive web application. Each phase builds upon the previous one, creating a cohesive system that serves as a centralized reference for your team.

---

## Phase 1: System Prompt & Content Development

### Purpose

Establish the foundational content that defines how your business operates. This phase is purely about documentation and strategy—no coding involved.

### What You're Creating

A comprehensive **system prompt** document that serves as the source of truth for your operational reference guide. This document will later be transformed into an interactive website.

### Detailed Steps

#### Step 1.1: Define Your Personas

**What is a persona?**A persona is a distinct operational role or archetype within your business. Each persona has its own characteristics, communication style, and workflow. For example:

- **Atlas Elite Concierge** (Luxury Travel): Sophisticated, detail-oriented, resourceful

- **ArtKech Lead Designer** (Creative Studio): Visionary, strategic, meticulous

**How to define each persona:**

1. **Identify the persona's name and title**
  - Make it memorable and descriptive
  - Example: "Atlas Elite Concierge" vs. just "Travel Agent"

1. **Document 5 core characteristics**
  - Each characteristic should be a distinct trait
  - Include both what the trait is AND why it matters
    - Example:
    
       ```
       Sophisticated & Discreet
       → Communicates with refined tone, understanding privacy and exclusivity needs
       ```

1. **Define communication style** (3-4 approaches)
  - How does this persona interact with clients?
  - How does this persona communicate internally?
    - Examples:
    
       ```
       - Formal yet personable, using precise language
       - Emphasizes exclusivity and bespoke experiences
       - Clear & concise updates with confirmations
       - Utmost confidentiality in all interactions
       ```

1. **List responsibilities**
  - What is this persona accountable for?
  - What decisions do they make?
  - What outcomes do they own?
    - Examples:
    
       ```
       - Client relationship management
       - Itinerary design and customization
       - Vendor coordination and negotiation
       - Quality assurance of all deliverables
       ```

#### Step 1.2: Document Process Flows

**Why 7 stages?**Seven stages provide enough granularity to capture the complete lifecycle of a project or engagement without becoming overwhelming. This structure works across industries.

**How to document each stage:**

1. **Create a numbered sequence (1-7)**
  - Each number represents a distinct phase
  - Stages should be sequential and logical
  - No skipping or jumping around

1. **For each stage, define:**
    - **Title**: Clear, action-oriented name
      - Example: "Inquiry & Qualification" (not just "Inquiry")
    - **Description**: 1-2 sentences explaining what happens
      - Example: "Receive initial inquiry, assess client profile (net worth, travel history, preferences), and determine fit for exclusive services."
    - **Key activities**: 2-3 specific deliverables or actions
        - Example:
        
           ```
           - Profile assessment
           - Service fit analysis
           - Initial consultation scheduling
           ```

1. **Example workflow (Luxury Travel):**

   ```
   1. Inquiry & Qualification
      → Receive inquiry, assess profile, determine fit
      
   2. Consultation & Proposal
      → Conduct consultation, present bespoke itinerary
      
   3. Itinerary Refinement
      → Iterate on proposal, secure tentative holds
      
   4. Booking & Confirmation
      → Finalize bookings, provide comprehensive itinerary
      
   5. Pre-Trip Preparation
      → Coordinate logistics, share recommendations
      
   6. In-Trip Concierge
      → Provide 24/7 support, manage adjustments
      
   7. Post-Trip Follow-up
      → Gather feedback, nurture relationship
   ```

#### Step 1.3: List General Capabilities

**What are general capabilities?**Capabilities are competencies or skills that apply across all personas. They represent what your business can do at a systemic level.

**How to identify capabilities:**

1. **Think cross-persona**
  - What can ANY persona in your business do?
  - What skills are universal?

1. **Document 6-8 capabilities**
  - Each with a title and brief description
    - Examples:
    
       ```
       Context Switching
       → Seamlessly transition between personas based on task context
       
       Client Communication
       → Professional interactions with exceptional service focus
       
       Project Management
       → Track progress, manage timelines, allocate resources
       
       Information Synthesis
       → Access and process information from multiple sources
       
       Automation & Efficiency
       → Streamline workflows and improve operational efficiency
       
       Quality Assurance
       → Ensure deliverables meet highest standards
       ```

#### Step 1.4: Define Operational Guidelines

**What are operational guidelines?**Guidelines are principles that govern how your business operates. They ensure consistency, quality, and alignment across all activities.

**How to define guidelines:**

1. **Identify 6-8 core principles**
  - These should be non-negotiable
  - They should guide decision-making

1. **Document each guideline**
  - Title: Clear principle name
  - Description: Why it matters and how it's applied
    - Examples:
    
       ```
       Prioritization
       → Tasks prioritized by urgency, client value, and strategic importance
       
       Confidentiality
       → All client information handled with utmost security
       
       Brand Alignment
       → Communications adhere to brand voice and quality standards
       
       Escalation
       → Complex issues promptly escalated to appropriate team members
       
       Feedback Integration
       → Continuously improve through client and team feedback
       
       Proactive Problem Solving
       → Identify issues before they arise and implement preventative measures
       ```

### Output of Phase 1

A complete markdown or YAML document containing:

- 2-3 fully defined personas

- 7-stage process flows for each persona

- 6-8 general capabilities

- 6-8 operational guidelines

**Example structure:**

```markdown
# Agent System Prompt

## Persona 1: Atlas Elite Concierge
### Characteristics
- Sophisticated & Discreet: ...
- Knowledgeable: ...
- Proactive & Detail-Oriented: ...
- Resourceful: ...
- Empathetic: ...

### Communication Style
- Formal yet personable, using precise language
- Emphasizes exclusivity and bespoke experiences
- Clear & concise updates with confirmations
- Utmost confidentiality in all interactions

### Process Flow
1. Inquiry & Qualification: ...
2. Consultation & Proposal: ...
... (7 stages total)

## Persona 2: ArtKech Lead Designer
### Characteristics
...

## General Capabilities
- Context Switching: ...
- Client Communication: ...
...

## Operational Guidelines
- Prioritization: ...
- Confidentiality: ...
...
```

### Time Investment

**Estimated time: 2-4 hours**

- Persona definition: 30-45 minutes per persona

- Process flow documentation: 1-1.5 hours

- Capabilities & guidelines: 30-45 minutes

---

## Phase 2: Web Project Initialization & Design

### Purpose

Set up the technical foundation and establish a cohesive visual design system that will guide all UI/UX decisions.

### What You're Creating

A React web project with a complete design system (colors, typography, spacing, shadows) that reflects your brand and operational philosophy.

### Detailed Steps

#### Step 2.1: Initialize Web Project

**What happens:**You create a new web project using the Manus webdev system with a static frontend template.

**How to do it:**

1. **Trigger project initialization**
  - Use `webdev_init_project` with your desired project name
  - Example: `agent-reference-guide`, `operational-playbook`, `team-guide`

1. **Select the template**
  - Choose: **Static Frontend** (React 19 + Tailwind 4 + shadcn/ui)
    - This provides:
      - React for component-based UI
      - Tailwind CSS for styling
      - shadcn/ui for pre-built accessible components

1. **Project structure created:**

   ```
   project-name/
   ├── client/
   │   ├── src/
   │   │   ├── pages/        (Page components)
   │   │   ├── components/   (Reusable components)
   │   │   ├── lib/          (Utilities and helpers)
   │   │   ├── App.tsx       (Main app component)
   │   │   └── index.css     (Global styles)
   │   ├── index.html        (HTML entry point)
   │   └── public/           (Static assets)
   └── package.json          (Dependencies)
   ```

#### Step 2.2: Choose Design Philosophy

**What is a design philosophy?**A design philosophy is a cohesive set of aesthetic and interaction principles that guide all design decisions. It ensures visual and experiential consistency.

**Example philosophies:**

1. **Premium Minimalism**
  - Elegant simplicity with sophisticated details
  - Lots of whitespace
  - Subtle colors and shadows
  - High-quality typography
  - Best for: Luxury brands, professional services

1. **Modern Professional**
  - Clean, contemporary aesthetic
  - Bold accent colors
  - Clear hierarchy
  - Geometric layouts
  - Best for: Tech companies, consultancies

1. **Warm & Approachable**
  - Friendly, inviting feel
  - Earthy color palettes
  - Rounded corners
  - Generous spacing
  - Best for: Creative studios, wellness brands

**How to choose:**

1. **Consider your brand**
  - What feeling do you want to evoke?
  - What's your target audience?
  - What's your industry?

1. **Define your color palette**
    - **Primary accent**: Your main brand color
      - Example: Gold (#D4A574) for luxury travel
    - **Secondary accent**: A complementary color
      - Example: Sage green (#9CAF88) for creative studio
    - **Semantic colors**: Functional colors
      - Muted (grays for secondary content)
      - Border (for dividers and outlines)
      - Ring (for focus states)

1. **Select typography**
    - **Display font**: For headings and titles
      - Example: Playfair Display (elegant, serif)
    - **Body font**: For content and descriptions
      - Example: Inter (clean, sans-serif)

**Example design system:**

```
Philosophy: Premium Minimalism

Colors:
- Primary Accent: #D4A574 (Gold)
- Secondary Accent: #9CAF88 (Sage Green)
- Muted: #A0A0A0 (Gray)
- Border: #E0E0E0 (Light Gray)
- Background: #0A0A0A (Dark)
- Foreground: #F5F5F5 (Light)

Typography:
- Display: Playfair Display (700 weight for headers)
- Body: Inter (400 weight for content)
- Spacing: 4px, 8px, 16px, 24px, 32px
- Shadows: Subtle (0 2px 4px rgba(0,0,0,0.1))
```

#### Step 2.3: Update Global Styling

**What you're doing:**Configuring the CSS variables and Tailwind theme to match your design system.

**Key files to update:**

1. **`client/src/index.css`**
  - Define CSS variables for colors
  - Set Tailwind theme tokens
    - Example:
    
       ```css
       :root {
         --primary: #D4A574;
         --primary-foreground: #FFFFFF;
         --accent: #9CAF88;
         --accent-foreground: #FFFFFF;
         --muted: #A0A0A0;
         --border: #E0E0E0;
         --background: #0A0A0A;
         --foreground: #F5F5F5;
       }
       ```

1. **`client/index.html`**
  - Add Google Fonts links
    - Example:
    
       ```html
       <link rel="preconnect" href="https://fonts.googleapis.com">
       <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
       <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
       ```

1. **Tailwind configuration**
  - Ensure theme tokens match your CSS variables
  - This ensures consistency across all components

### Design Considerations

**Color Consistency**

- Use semantic color names throughout

- Never hardcode colors; always use CSS variables

- This makes future theme changes easy

**Typography Hierarchy**

- Display font for h1, h2 (headers )

- Body font for p, span (content)

- Use font weights to create hierarchy

- Example:

   ```
   h1: Playfair Display 700 (32px)
   h2: Playfair Display 700 (24px)
   p: Inter 400 (16px)
   ```

**Spacing System**

- Use consistent spacing increments

- 4px base unit (4px, 8px, 16px, 24px, 32px)

- Apply to margins, padding, gaps

- Creates visual rhythm and alignment

**Depth & Shadows**

- Use subtle shadows for hierarchy

- Avoid harsh shadows

- Example:

   ```
   Box shadow: 0 2px 4px rgba(0,0,0,0.1)
   Border: 1px solid var(--border)
   ```

### Output of Phase 2

A fully configured React project with:

- Design system defined in CSS variables

- Google Fonts loaded

- Tailwind theme configured

- Color palette established

- Typography system ready

### Time Investment

**Estimated time: 1-2 hours**

- Project initialization: 10 minutes

- Design philosophy selection: 30 minutes

- Color palette definition: 30 minutes

- CSS and Tailwind configuration: 30 minutes

---

## Phase 3: Core Components & Page Structure

### Purpose

Build the fundamental UI components and establish the page layout that will display your operational content.

### What You're Creating

Reusable React components that structure and display your persona information, processes, and guidelines.

### Detailed Steps

#### Step 3.1: Create Header Component

**Purpose:** Display branding and navigation context

**What it includes:**

- Logo or icon

- Title and subtitle

- Status badge (e.g., "Manus & Claude Compatible")

- Optional: Navigation links

**Example structure:**

```typescript
<Header>
  <Logo />
  <div>
    <h1>Agent Guide</h1>
    <p>Operational Reference System</p>
  </div>
  <Badge>Manus & Claude Compatible</Badge>
</Header>
```

#### Step 3.2: Create Persona Components

**Purpose:** Display comprehensive information about each business persona

**What each persona component includes:**

1. **Persona title and subtitle**
  - Example: "Atlas Elite Concierge" + "Luxury Travel Company - Moroccan Experiences for HNW Americans"

1. **Tabbed interface** with three tabs:
    - **Characteristics tab**
      - Display 5 characteristics as cards
      - Each card shows title and description
    - **Process Flow tab**
      - Show 7-stage process overview
      - Link to detailed timeline (Phase 4)
    - **Responsibilities tab**
      - List key responsibilities
      - Show communication style

1. **Communication style section**
  - Display 3-4 communication approaches
  - Use bullet points or cards

**Example structure:**

```typescript
<Persona name="Atlas Elite Concierge">
  <Tabs>
    <Tab name="Characteristics">
      {characteristics.map(char => (
        <Card>
          <h3>{char.title}</h3>
          <p>{char.description}</p>
        </Card>
      ))}
    </Tab>
    <Tab name="Process Flow">
      {/* Process overview */}
    </Tab>
    <Tab name="Responsibilities">
      {/* Responsibilities list */}
    </Tab>
  </Tabs>
</Persona>
```

#### Step 3.3: Create Search Component

**Purpose:** Enable real-time search across all content

**What it includes:**

1. **Search input field**
  - Placeholder: "Search personas, processes, capabilities..."
  - Real-time search as user types

1. **Category filters**
  - All, Travel, ArtKech, General
  - Click to filter results

1. **Type filters**
  - All, Characteristic, Process, Capability, Guideline
  - Click to filter results

1. **Result display**
  - Show matching items as cards
  - Include title, description, category, type
  - Show count of results

**Example structure:**

```typescript
<Search>
  <Input placeholder="Search..." />
  <CategoryFilters />
  <TypeFilters />
  <ResultsList>
    {results.map(result => (
      <ResultCard key={result.id}>
        <h3>{result.title}</h3>
        <p>{result.description}</p>
        <Badge>{result.category}</Badge>
      </ResultCard>
    ))}
  </ResultsList>
</Search>
```

#### Step 3.4: Create Command Palette Component

**Purpose:** Provide keyboard-driven access to key actions

**What it includes:**

1. **Keyboard shortcut trigger**
  - Listen for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
  - Open modal dialog

1. **Command input**
  - Search/filter commands as user types

1. **Grouped commands**
  - Navigation (Switch to Travel, Switch to ArtKech)
  - Export (Export as PDF)
  - Tools (Open Search)

1. **Command actions**
  - Each command has an associated action
  - Actions execute when command is selected

**Example structure:**

```typescript
<CommandPalette>
  <Dialog>
    <CommandInput placeholder="Search commands..." />
    <CommandGroup heading="Navigation">
      <CommandItem>Switch to Luxury Travel</CommandItem>
      <CommandItem>Switch to ArtKech Studio</CommandItem>
    </CommandGroup>
    <CommandGroup heading="Export">
      <CommandItem>Export as PDF</CommandItem>
    </CommandGroup>
    <CommandGroup heading="Tools">
      <CommandItem>Open Search</CommandItem>
    </CommandGroup>
  </Dialog>
</CommandPalette>
```

#### Step 3.5: Create Process Timeline Component

**Purpose:** Visualize 7-stage workflows in an interactive format

**What it includes:**

1. **Stage cards** (one per stage)
  - Numbered badge (1-7)
  - Stage title
  - Stage description
  - Expandable details

1. **Visual connectors**
  - Lines connecting stages
  - Gradient effect (solid to faded)

1. **Key activities**
  - When stage is expanded, show 2-3 key activities
  - Bullet points or list items

1. **Progress indicator**
  - Visual progress bar
  - Shows how many stages have been viewed

**Example structure:**

```typescript
<ProcessTimeline>
  {stages.map((stage, index) => (
    <div key={stage.number}>
      {/* Connector line to next stage */}
      <Card onClick={() => toggleStage(stage.number)}>
        <Badge>{stage.number}</Badge>
        <h3>{stage.title}</h3>
        <p>{stage.description}</p>
        {isExpanded && (
          <ul>
            {stage.details.map(detail => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  ))}
  <ProgressBar value={expandedCount / stages.length} />
</ProcessTimeline>
```

#### Step 3.6: Build Page Layout

**Purpose:** Assemble all components into a cohesive page

**Page structure:**

```
┌─────────────────────────────────────────┐
│ Header (Logo, Title, Status Badge)      │
├─────────────────────────────────────────┤
│ Hero Section (Title, Subtitle)          │
├─────────────────────────────────────────┤
│ Toolbar (Search Button, Cmd+K Button)   │
├─────────────────────────────────────────┤
│ Persona Tabs                            │
│ ┌─────────────────────────────────────┐ │
│ │ [Luxury Travel] [ArtKech Studio]    │ │
│ ├─────────────────────────────────────┤ │
│ │ Persona Content (Tabs)              │ │
│ │ ┌───────────────────────────────┐   │ │
│ │ │ [Characteristics] [Process]   │   │ │
│ │ │ [Responsibilities]            │   │ │
│ │ ├───────────────────────────────┤   │ │
│ │ │ Persona Details               │   │ │
│ │ └───────────────────────────────┘   │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ General Capabilities (6-8 cards)        │
├─────────────────────────────────────────┤
│ Operational Guidelines (6-8 cards)      │
└─────────────────────────────────────────┘
```

### Output of Phase 3

Fully functional React components:

- Header component

- 2-3 Persona components

- Search component

- Command Palette component

- Process Timeline component

- Complete Home page with all components integrated

### Time Investment

**Estimated time: 4-6 hours**

- Header component: 30 minutes

- Persona components: 1.5-2 hours

- Search component: 1-1.5 hours

- Command Palette component: 1 hour

- Process Timeline component: 1-1.5 hours

- Page assembly and integration: 1 hour

---

## Phase 4: Advanced Features Implementation

### Purpose

Add sophisticated functionality that enhances usability and provides power-user capabilities.

### What You're Creating

Four advanced features that transform the basic reference guide into a professional knowledge management tool.

### Detailed Steps

#### Feature 1: Advanced Search with Indexing

**What it does:**Enables users to search across all content (personas, processes, capabilities, guidelines) with real-time results and filtering.

**How it works:**

1. **Build search index**
  - Create array of searchable items
  - Each item has: id, title, description, category, section, type
    - Example:
    
       ```typescript
       {
         id: "travel-char-0",
         title: "Sophisticated & Discreet",
         description: "Communicates with refined tone...",
         category: "travel",
         section: "Characteristics",
         type: "characteristic"
       }
       ```

1. **Implement search functions**
  - `searchContent(query, index)`: Filter by text match
  - `filterByCategory(results, category)`: Filter by business area
  - `filterByType(results, type)`: Filter by content type

1. **Create Search component UI**
  - Search input with real-time filtering
  - Category filter buttons
  - Type filter buttons
  - Result cards with metadata

**Implementation example:**

```typescript
// Build index from all content
const index = buildSearchIndex();

// Search and filter
const results = searchContent("itinerary", index);
const filtered = filterByCategory(results, "travel");
const finalResults = filterByType(filtered, "process");

// Display results
results.map(result => (
  <ResultCard key={result.id}>
    <h3>{result.title}</h3>
    <p>{result.description}</p>
    <Badge>{result.category}</Badge>
  </ResultCard>
))
```

#### Feature 2: Command Palette (Cmd+K)

**What it does:**Provides keyboard-driven access to key actions for power users.

**How it works:**

1. **Listen for keyboard shortcut**
  - Detect Cmd+K (Mac) or Ctrl+K (Windows/Linux)
  - Open modal dialog

1. **Display grouped commands**
  - Navigation: Switch personas, go to sections
  - Export: Export as PDF
  - Tools: Open search, view help

1. **Allow command search**
  - User can type to filter commands
  - Fuzzy matching for easy discovery

1. **Execute commands**
  - Click or press Enter to execute
  - Each command has associated action

**Implementation example:**

```typescript
// Define commands
const commands = [
  {
    id: "travel",
    title: "Switch to Luxury Travel",
    category: "Navigation",
    action: () => setActivePersona("travel")
  },
  {
    id: "export",
    title: "Export as PDF",
    category: "Export",
    action: () => exportPDF()
  }
];

// Listen for keyboard shortcut
useEffect(() => {
  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setOpen(true);
    }
  };
  document.addEventListener('keydown', handleKeyDown);
}, []);

// Display command palette
<CommandPalette commands={commands} />
```

#### Feature 3: Interactive Process Timeline

**What it does:**Visualizes 7-stage workflows with expandable details and visual progress tracking.

**How it works:**

1. **Display stage cards**
  - Each card shows stage number, title, description
  - Numbered badge (1-7) with color accent

1. **Make stages expandable**
  - Click card to expand/collapse
  - Show key activities when expanded
  - Smooth animation

1. **Add visual connectors**
  - Lines between stages
  - Gradient effect (solid to faded)

1. **Show progress**
  - Progress bar showing viewed stages
  - Stage count indicator

**Implementation example:**

```typescript
const [expandedStage, setExpandedStage] = useState(null);

{stages.map((stage, index) => (
  <div key={stage.number}>
    {/* Connector line */}
    {index < stages.length - 1 && (
      <div className="connector-line" />
    )}
    
    {/* Stage card */}
    <Card onClick={() => toggleStage(stage.number)}>
      <Badge>{stage.number}</Badge>
      <h3>{stage.title}</h3>
      <p>{stage.description}</p>
      
      {/* Expanded details */}
      {expandedStage === stage.number && (
        <ul>
          {stage.details.map(detail => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      )}
    </Card>
  </div>
))}

{/* Progress bar */}
<ProgressBar 
  value={(expandedStage / stages.length) * 100} 
/>
```

#### Feature 4: PDF Export

**What it does:**Allows users to download the current persona guide as a printable PDF.

**How it works:**

1. **Generate HTML content**
  - Create formatted HTML with styling
  - Include title, metadata, content
  - Apply print-friendly CSS

1. **Trigger browser print dialog**
  - Create iframe with HTML
  - Call print() method
  - User selects printer or "Save as PDF"

1. **Include metadata**
  - Generated date
  - Persona name
  - Company/project name
  - Footer with copyright

**Implementation example:**

```typescript
function exportToPDF(persona, content) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Inter, sans-serif; }
        h1 { font-family: 'Playfair Display'; }
        .header { border-bottom: 2px solid #D4A574; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${persona} Guide</h1>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
      </div>
      <div class="content">${content}</div>
    </body>
    </html>
  `;
  
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement('iframe');
  iframe.src = url;
  document.body.appendChild(iframe);
  iframe.contentWindow.print();
}
```

### Output of Phase 4

Fully implemented advanced features:

- Search index with 50+ searchable items

- Real-time search with filtering

- Command Palette with 4-6 commands

- Interactive Process Timeline for each persona

- PDF export functionality

### Time Investment

**Estimated time: 3-4 hours**

- Search index creation: 45 minutes

- Search component implementation: 1 hour

- Command Palette implementation: 45 minutes

- Process Timeline implementation: 1 hour

- PDF export implementation: 45 minutes

---

## Phase 5: Polish & Refinement

### Purpose

Ensure the website is production-ready with excellent user experience, visual polish, and comprehensive testing.

### What You're Doing

Fine-tuning every aspect of the application to deliver a professional, polished product.

### Detailed Steps

#### Step 5.1: Visual Refinement

**Color & Contrast**

- Verify WCAG AA color contrast (4.5:1 for text)

- Test with contrast checker tools

- Ensure text is readable on all backgrounds

**Spacing & Alignment**

- Verify consistent spacing throughout

- Check alignment of elements

- Ensure visual rhythm

**Typography**

- Verify font sizes are readable

- Check line heights (1.5-1.6 for body text)

- Ensure hierarchy is clear

**Shadows & Depth**

- Review all shadows for subtlety

- Ensure shadows enhance hierarchy

- Remove harsh or distracting shadows

#### Step 5.2: Interaction Refinement

**Hover States**

- All interactive elements should have hover effects

- Hover effects should be subtle but clear

- Example: `hover:border-accent/50`, `hover:bg-muted`

**Focus Indicators**

- Keyboard focus must be visible

- Use outline or border

- Ensure sufficient contrast

**Button Feedback**

- Click feedback (slight scale or color change)

- Disabled state styling

- Loading state indicators

**Animations**

- Smooth transitions (200-300ms)

- Easing functions (ease-in-out)

- No jarring or distracting animations

#### Step 5.3: Responsive Design

**Mobile (320px - 640px)**

- Single column layout

- Touch-friendly button sizes (44px minimum)

- Readable text sizes

- Collapsed navigation

**Tablet (641px - 1024px)**

- Two-column layout where appropriate

- Larger touch targets

- Optimized spacing

**Desktop (1025px+)**

- Full-featured layout

- Sidebar navigation

- Optimized for mouse interaction

#### Step 5.4: Accessibility

**Keyboard Navigation**

- Tab through all interactive elements

- Logical tab order

- Escape to close modals

**Screen Reader Support**

- Semantic HTML elements

- ARIA labels where needed

- Alt text for images

**Color Independence**

- Don't rely solely on color to convey information

- Use text labels, icons, or patterns

#### Step 5.5: Content Review

**Text Quality**

- Check for typos and grammar

- Verify consistency of terminology

- Ensure clarity and conciseness

**Accuracy**

- Verify all information is current

- Check process flows for accuracy

- Validate all links and references

**Completeness**

- Ensure all personas are documented

- Verify all 7 stages are present

- Check all capabilities and guidelines are included

#### Step 5.6: Testing

**Functional Testing**

- Test search with various queries

- Verify all command palette actions work

- Test persona switching

- Validate PDF export

- Test all interactive elements

**Browser Testing**

- Chrome/Edge (Chromium)

- Firefox

- Safari

- Mobile browsers (iOS Safari, Chrome Mobile)

**Performance Testing**

- Page load time < 3 seconds

- Search results appear instantly

- Smooth scrolling and interactions

- No lag when expanding timeline stages

### Quality Checklist

Before publishing, verify:

- [ ] All colors meet WCAG AA contrast standards

- [ ] All interactive elements have hover states

- [ ] Keyboard navigation works throughout

- [ ] All pages are responsive on mobile/tablet/desktop

- [ ] Search functionality works with various queries

- [ ] Command Palette triggers with Cmd+K

- [ ] Timeline stages expand/collapse smoothly

- [ ] PDF export generates valid files

- [ ] All text is accurate and polished

- [ ] No typos or grammatical errors

- [ ] All links are valid

- [ ] Page loads in under 3 seconds

- [ ] No console errors or warnings

- [ ] Works in Chrome, Firefox, Safari

### Output of Phase 5

A production-ready website that:

- Meets accessibility standards

- Provides excellent user experience

- Performs well on all devices

- Contains no errors or broken features

- Is ready for team use or client presentation

### Time Investment

**Estimated time: 2-3 hours**

- Visual refinement: 45 minutes

- Interaction refinement: 45 minutes

- Responsive design testing: 30 minutes

- Accessibility review: 30 minutes

- Content review: 30 minutes

- Comprehensive testing: 1 hour

---

## Summary: Total Time Investment

| Phase | Time | Focus |
| --- | --- | --- |
| Phase 1: Content Development | 2-4 hours | Strategy, personas, processes |
| Phase 2: Design & Setup | 1-2 hours | Visual system, colors, typography |
| Phase 3: Core Components | 4-6 hours | Building UI components |
| Phase 4: Advanced Features | 3-4 hours | Search, timeline, export |
| Phase 5: Polish & Refinement | 2-3 hours | Quality, testing, refinement |
| **TOTAL** | **12-19 hours** | **Complete operational reference guide** |

---

## Key Principles Across All Phases

### 1. Progressive Complexity

Each phase builds on the previous one. Don't skip phases; they're sequential for a reason.

### 2. Consistency

Use the design system established in Phase 2 throughout Phases 3-5. This ensures visual cohesion.

### 3. User-Centric Design

Every feature (search, command palette, timeline) is designed around how users actually work.

### 4. Quality Over Speed

Invest time in Phase 5 (Polish & Refinement). This is what separates professional from amateur.

### 5. Documentation

Keep your content from Phase 1 updated as your business evolves. The website reflects your operational reality.

---

## Common Mistakes to Avoid

### Phase 1 Mistakes

- ❌ Defining too many personas (stick to 2-3)

- ❌ Process flows that don't follow a logical sequence

- ❌ Vague or unclear descriptions

- ✅ Keep it focused and specific

### Phase 2 Mistakes

- ❌ Choosing too many colors (stick to 3-4 main colors)

- ❌ Using fonts that don't match your brand

- ❌ Inconsistent spacing

- ✅ Simplicity and consistency win

### Phase 3 Mistakes

- ❌ Hardcoding colors instead of using CSS variables

- ❌ Duplicating component code

- ❌ Overly complex component logic

- ✅ Keep components simple and reusable

### Phase 4 Mistakes

- ❌ Search index that's incomplete or inaccurate

- ❌ Command Palette with too many commands

- ❌ Timeline that doesn't expand smoothly

- ✅ Test each feature thoroughly

### Phase 5 Mistakes

- ❌ Skipping accessibility review

- ❌ Not testing on mobile devices

- ❌ Publishing with typos or errors

- ✅ Take time for quality assurance

---

## Next Steps After Completion

Once your reference guide is complete and published:

1. **Gather team feedback** - How are people using it?

1. **Identify gaps** - What information is missing?

1. **Track usage** - Which sections are most accessed?

1. **Iterate** - Update content and features based on feedback

1. **Expand** - Add new features (team roles, client intake forms, analytics)

The reference guide is a living document that should evolve with your business.
