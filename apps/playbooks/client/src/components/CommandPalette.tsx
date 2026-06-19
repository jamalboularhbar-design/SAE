import { useState, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Plane, Palette, Zap, Download, Search as SearchIcon } from 'lucide-react';

interface Command {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
}

interface CommandPaletteProps {
  onExport?: () => void;
  onSwitchPersona?: (persona: 'travel' | 'artkech') => void;
}

export default function CommandPalette({ onExport, onSwitchPersona }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);

  const commands: Command[] = [
    {
      id: 'travel-persona',
      title: 'Switch to Horizon Concierge',
      description: 'View Horizon Concierge Concierge persona',
      icon: <Plane className="w-4 h-4" />,
      action: () => {
        onSwitchPersona?.('travel');
        setOpen(false);
      },
      category: 'Navigation',
    },
    {
      id: 'artkech-persona',
      title: 'Switch to Meridian Creative Studio',
      description: 'View Meridian Creative Lead workspace',
      icon: <Palette className="w-4 h-4" />,
      action: () => {
        onSwitchPersona?.('artkech');
        setOpen(false);
      },
      category: 'Navigation',
    },
    {
      id: 'export-pdf',
      title: 'Export as PDF',
      description: 'Download current guide as PDF',
      icon: <Download className="w-4 h-4" />,
      action: () => {
        onExport?.();
        setOpen(false);
      },
      category: 'Export',
    },
    {
      id: 'search',
      title: 'Open Search',
      description: 'Search all content',
      icon: <SearchIcon className="w-4 h-4" />,
      action: () => {
        // Focus search input
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        searchInput?.focus();
        setOpen(false);
      },
      category: 'Tools',
    },
  ];

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const groupedCommands = commands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = [];
    }
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, Command[]>);

  return (
    <>
      {/* Keyboard shortcut indicator */}
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border/50 text-muted-foreground hover:border-accent/50 transition-colors text-sm"
      >
        <Zap className="w-4 h-4" />
        <span>Cmd+K</span>
      </button>

      {/* Command Palette Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 shadow-lg">
          <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:pl-8 [&_[cmdk-group]:overflow-hidden [&_[cmdk-group]]:p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-input-wrapper_svg]]:h-5 [&_[cmdk-input-wrapper_svg]]:w-5 [&_[cmdk-input]]:h-12">
            <CommandInput placeholder="Search commands..." />
            <CommandList>
              <CommandEmpty>No commands found.</CommandEmpty>
              {Object.entries(groupedCommands).map(([category, cmds]) => (
                <CommandGroup key={category} heading={category}>
                  {cmds.map((cmd) => (
                    <CommandItem
                      key={cmd.id}
                      value={cmd.id}
                      onSelect={cmd.action}
                      className="cursor-pointer"
                    >
                      <div className="flex items-start gap-3 w-full">
                        <div className="mt-1 text-accent">{cmd.icon}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{cmd.title}</p>
                          <p className="text-xs text-muted-foreground">{cmd.description}</p>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
