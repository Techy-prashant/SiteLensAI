'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, Clock, TrendingUp, Pin, ArrowRight } from 'lucide-react';

import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { recentSearches, popularCommands, pinnedActions } from '@/lib/settings-data';
import { showComingSoonToast } from '@/lib/utils';

export function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full max-w-md cursor-pointer">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search employees, devices, zones…"
            className="h-9 cursor-pointer border-border bg-secondary/50 pl-9 text-sm placeholder:text-muted-foreground focus-visible:bg-background"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            readOnly
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground sm:flex">
            ⌘K
          </kbd>
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[400px] p-0"
        sideOffset={8}
      >
        <div className="border-b border-border p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search anything…"
              className="h-9 border-0 bg-secondary/50 pl-9 text-sm focus-visible:ring-0"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto scrollbar-thin p-2">
          {/* Pinned Actions */}
          <div className="mb-2">
            <p className="flex items-center gap-1.5 px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              <Pin className="h-3 w-3" />
              Pinned Actions
            </p>
            {pinnedActions.map((action) => (
              <button
                key={action.label}
                onClick={() => {
                  setOpen(false);
                  showComingSoonToast(action.label);
                }}
                className="flex w-full items-center gap-2.5 rounded-sm px-2 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-sm border border-border bg-secondary text-xs font-medium text-primary">
                  +
                </span>
                {action.label}
                <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground/50" />
              </button>
            ))}
          </div>

          {/* Recent Searches */}
          <div className="mb-2">
            <p className="flex items-center gap-1.5 px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              <Clock className="h-3 w-3" />
              Recent Searches
            </p>
            {recentSearches.map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="flex w-full items-center gap-2.5 rounded-sm px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <Clock className="h-3.5 w-3.5 text-muted-foreground/50" />
                {term}
              </button>
            ))}
          </div>

          {/* Quick Navigation */}
          <div>
            <p className="flex items-center gap-1.5 px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              Quick Navigation
            </p>
            {popularCommands.map((cmd) => (
              <button
                key={cmd.label}
                onClick={() => {
                  setOpen(false);
                  if (cmd.href) {
                    router.push(cmd.href);
                  } else {
                    showComingSoonToast(cmd.label);
                  }
                }}
                className="flex w-full items-center gap-2.5 rounded-sm px-2 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-sm border border-border bg-secondary text-xs font-medium text-primary">
                  {cmd.label.charAt(0)}
                </span>
                {cmd.label}
                <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground/50" />
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
