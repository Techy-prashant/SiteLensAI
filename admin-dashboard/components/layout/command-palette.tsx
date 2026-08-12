'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Glasses,
  Users,
  BarChart3,
  Settings,
  KeyRound,
  ShieldHalf,
  SlidersHorizontal,
  User,
  FileText,
  AlertTriangle,
  Moon,
  PanelLeft,
  UserPlus,
  Plus,
  Radio,
  type LucideIcon,
} from 'lucide-react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useUIStore } from '@/lib/stores/ui-store';
import { commandItems } from '@/lib/settings-data';

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Glasses,
  Users,
  BarChart3,
  Settings,
  KeyRound,
  ShieldHalf,
  SlidersHorizontal,
  User,
  FileText,
  AlertTriangle,
  Moon,
  PanelLeft,
  UserPlus,
  Plus,
  Radio,
};

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  const categories = Array.from(new Set(commandItems.map((c) => c.category)));

  function handleSelect(item: typeof commandItems[number]) {
    onOpenChange(false);
    if (item.action === 'toggle-theme') {
      return;
    }
    if (item.action === 'toggle-sidebar') {
      toggleSidebar();
      return;
    }
    if (item.href) {
      router.push(item.href);
    }
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search pages, employees, devices, commands…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {categories.map((cat, idx) => {
          const items = commandItems.filter((c) => c.category === cat);
          return (
            <React.Fragment key={cat}>
              {idx > 0 && <CommandSeparator />}
              <CommandGroup heading={cat}>
                {items.map((item) => {
                  const Icon = iconMap[item.icon] ?? User;
                  return (
                    <CommandItem
                      key={item.id}
                      value={`${item.label} ${item.category}`}
                      onSelect={() => handleSelect(item)}
                    >
                      <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{item.label}</span>
                      {item.shortcut && (
                        <span className="ml-auto text-xs tracking-widest text-muted-foreground">
                          {item.shortcut}
                        </span>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </React.Fragment>
          );
        })}
      </CommandList>
    </CommandDialog>
  );
}
