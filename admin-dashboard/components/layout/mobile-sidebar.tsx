'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ShieldCheck } from 'lucide-react';

import { cn } from '@/lib/utils';
import { getNavItemsForRole } from '@/lib/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Button } from '@/components/ui/button';
import { SiteLensLogo } from '@/components/ui/site-lens-logo';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';

export function MobileSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const user = useAuthStore((s) => s.user);
  const items = getNavItemsForRole(user?.role ?? null);
  const adminItems = items.filter((i) => i.roles);
  const standardItems = items.filter((i) => !i.roles);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Menu className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <div className="flex h-16 items-center gap-3 border-b border-border px-4">
          <SiteLensLogo size={44} showText textClassName="text-lg font-extrabold" />
        </div>
        <nav className="px-2 py-4">
          <ul className="space-y-1">
            {standardItems.map((item) => {
              const active =
                pathname === item.href ||
                pathname.startsWith(item.href + '/');
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex h-10 items-center rounded-sm px-3 text-sm font-medium transition-colors',
                      active
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-[18px] w-[18px]',
                        active && 'text-primary'
                      )}
                    />
                    <span className="ml-3">{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          {adminItems.length > 0 && (
            <>
              <div className="mb-1 mt-6 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                Administration
              </div>
              <ul className="space-y-1">
                {adminItems.map((item) => {
                  const active =
                    pathname === item.href ||
                    pathname.startsWith(item.href + '/');
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'flex h-10 items-center rounded-sm px-3 text-sm font-medium transition-colors',
                          active
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                        )}
                      >
                        <Icon
                          className={cn(
                            'h-[18px] w-[18px]',
                            active && 'text-primary'
                          )}
                        />
                        <span className="ml-3">{item.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
