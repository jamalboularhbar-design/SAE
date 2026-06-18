# Component Reference Guide

This document provides template code and patterns for key components used in building operational reference guides.

## Search Component

### Purpose
Enable users to search across all personas, processes, and guidelines with real-time filtering.

### Key Features
- Real-time search as user types
- Category filtering (Travel, ArtKech, General)
- Type filtering (Characteristic, Process, Capability, Guideline)
- Result cards with metadata and badges

### Implementation Pattern
```typescript
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { buildSearchIndex, searchContent, filterByCategory } from '@/lib/searchIndex';

export default function Search() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const index = useMemo(() => buildSearchIndex(), []);
  
  const results = useMemo(() => {
    let filtered = searchContent(query, index);
    return filterByCategory(filtered, selectedCategory);
  }, [query, selectedCategory, index]);

  return (
    <div className="w-full space-y-4">
      <Input
        placeholder="Search personas, processes, capabilities..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      
      {/* Category filters */}
      <div className="flex gap-2">
        {['all', 'travel', 'artkech', 'general'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={selectedCategory === cat ? 'active' : ''}
          >
            {cat}
          </button>
        ))}
      </div>
      
      {/* Results */}
      <div className="space-y-3">
        {results.map((result) => (
          <Card key={result.id}>
            <h3>{result.title}</h3>
            <p>{result.description}</p>
            <Badge>{result.category}</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### Search Index Pattern
```typescript
export interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: 'travel' | 'artkech' | 'general';
  section: string;
  type: 'characteristic' | 'process' | 'capability' | 'guideline';
  content: string;
}

export function buildSearchIndex(): SearchResult[] {
  const results: SearchResult[] = [];
  
  // Add characteristics
  characteristics.forEach((char, idx) => {
    results.push({
      id: `char-${idx}`,
      title: char.title,
      description: char.description,
      category: 'travel', // or 'artkech'
      section: 'Characteristics',
      type: 'characteristic',
      content: `${char.title} ${char.description}`,
    });
  });
  
  return results;
}

export function searchContent(query: string, index: SearchResult[]): SearchResult[] {
  if (!query.trim()) return [];
  const lowerQuery = query.toLowerCase();
  return index.filter(item =>
    item.title.toLowerCase().includes(lowerQuery) ||
    item.description.toLowerCase().includes(lowerQuery)
  );
}
```

## Command Palette Component

### Purpose
Provide keyboard-driven access to key actions and navigation.

### Key Features
- Cmd+K keyboard shortcut
- Grouped commands (Navigation, Export, Tools)
- Fuzzy search within commands
- Quick persona switching

### Implementation Pattern
```typescript
import { useState, useEffect } from 'react';
import { Command, CommandInput, CommandItem, CommandList, CommandGroup } from '@/components/ui/command';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface Command {
  id: string;
  title: string;
  description: string;
  action: () => void;
  category: string;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);

  const commands: Command[] = [
    {
      id: 'travel',
      title: 'Switch to Luxury Travel',
      description: 'View travel persona',
      action: () => switchPersona('travel'),
      category: 'Navigation',
    },
    {
      id: 'export',
      title: 'Export as PDF',
      description: 'Download current guide',
      action: () => exportPDF(),
      category: 'Export',
    },
  ];

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const grouped = commands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {});

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <Command>
          <CommandInput placeholder="Search commands..." />
          <CommandList>
            {Object.entries(grouped).map(([category, cmds]) => (
              <CommandGroup key={category} heading={category}>
                {cmds.map((cmd) => (
                  <CommandItem
                    key={cmd.id}
                    onSelect={cmd.action}
                  >
                    <div>
                      <p>{cmd.title}</p>
                      <p className="text-sm text-muted">{cmd.description}</p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
```

## Process Timeline Component

### Purpose
Visualize and present the 7-stage operational workflow in an interactive format.

### Key Features
- Numbered stage badges
- Expandable stage details
- Key activities listing
- Progress indicator
- Visual connector lines between stages

### Implementation Pattern
```typescript
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown } from 'lucide-react';

interface Stage {
  number: number;
  title: string;
  description: string;
  details?: string[];
}

export default function ProcessTimeline({ stages, title }) {
  const [expandedStage, setExpandedStage] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">{title}</h3>
      
      {stages.map((stage, index) => (
        <div key={stage.number} className="relative">
          {/* Connector line */}
          {index < stages.length - 1 && (
            <div className="absolute left-6 top-16 w-0.5 h-8 bg-gradient-to-b from-accent to-accent/20" />
          )}

          {/* Stage card */}
          <button
            onClick={() => setExpandedStage(
              expandedStage === stage.number ? null : stage.number
            )}
            className="w-full text-left"
          >
            <Card className="hover:border-accent/50">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <Badge className="w-12 h-12 flex items-center justify-center">
                    {stage.number}
                  </Badge>
                  <div className="flex-1">
                    <CardTitle>{stage.title}</CardTitle>
                    <p className="text-sm text-muted">{stage.description}</p>
                  </div>
                  <ChevronDown
                    className={`transform transition-transform ${
                      expandedStage === stage.number ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </CardHeader>

              {expandedStage === stage.number && (
                <CardContent className="border-t pt-4">
                  {stage.details && (
                    <ul className="space-y-2">
                      {stage.details.map((detail, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-accent">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              )}
            </Card>
          </button>
        </div>
      ))}

      {/* Progress indicator */}
      <div className="flex items-center gap-2 pt-4 border-t">
        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all"
            style={{ width: `${((expandedStage || 0) / stages.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-muted">{stages.length} Stages</span>
      </div>
    </div>
  );
}
```

## Persona Component

### Purpose
Display comprehensive information about a specific business persona.

### Key Features
- Tabbed interface (Characteristics, Process, Responsibilities)
- Characteristic badges
- Communication style section
- Process flow overview

### Implementation Pattern
```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Persona {
  name: string;
  subtitle: string;
  characteristics: Array<{ title: string; description: string }>;
  communicationStyle: string[];
  processStages: Array<{ title: string; description: string }>;
  responsibilities: string[];
}

export default function PersonaComponent({ persona }: { persona: Persona }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold mb-2">{persona.name}</h2>
        <p className="text-muted">{persona.subtitle}</p>
      </div>

      <Tabs defaultValue="characteristics">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="characteristics">Characteristics</TabsTrigger>
          <TabsTrigger value="process">Process Flow</TabsTrigger>
          <TabsTrigger value="responsibilities">Responsibilities</TabsTrigger>
        </TabsList>

        <TabsContent value="characteristics" className="space-y-4">
          {persona.characteristics.map((char, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle className="text-lg">{char.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted">{char.description}</p>
              </CardContent>
            </Card>
          ))}
          
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">Communication Style</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {persona.communicationStyle.map((style, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-accent">•</span>
                    <span>{style}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="process">
          {/* Process stages */}
        </TabsContent>

        <TabsContent value="responsibilities">
          {/* Responsibilities list */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

## Header Component

### Purpose
Display branding, navigation, and status information.

### Key Features
- Logo/title
- Subtitle/tagline
- Status badge (e.g., "Manus & Claude Compatible")
- Navigation indicators

### Implementation Pattern
```typescript
export default function Header() {
  return (
    <header className="border-b border-border/50 py-6">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
            {/* Logo */}
          </div>
          <div>
            <h1 className="text-2xl font-bold">Agent Guide</h1>
            <p className="text-sm text-muted">Operational Reference System</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="outline">Manus & Claude Compatible</Badge>
        </div>
      </div>
    </header>
  );
}
```

## Styling Patterns

### Color Consistency
```css
/* Use semantic colors throughout */
.accent-element {
  background-color: var(--accent);
  color: var(--accent-foreground);
}

.secondary-element {
  background-color: var(--secondary);
  color: var(--secondary-foreground);
}

.muted-element {
  background-color: var(--muted);
  color: var(--muted-foreground);
}
```

### Responsive Patterns
```typescript
// Mobile-first approach
<div className="
  grid grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-3 
  gap-4
">
  {/* Content */}
</div>
```

### Animation Patterns
```typescript
// Smooth transitions
<div className="
  transition-all 
  duration-300 
  ease-in-out
  hover:border-accent/50
">
  {/* Content */}
</div>
```
