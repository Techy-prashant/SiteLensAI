'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { navItems } from '@/lib/navigation';

function labelForPath(path: string): string {
  const item = navItems.find((n) => n.href === path);
  if (item) return item.title;
  const parent = navItems.find(
    (n) => path.startsWith(n.href + '/') && n.href !== '/'
  );
  if (parent) {
    const rest = path.slice(parent.href.length + 1);
    return rest.charAt(0).toUpperCase() + rest.slice(1);
  }
  return path.charAt(1).toUpperCase() + path.slice(2);
}

export function Breadcrumbs() {
  const pathname = usePathname();

  if (pathname === '/') return null;

  const segments = pathname.split('/').filter(Boolean);
  const crumbs = segments.map((seg, i) => {
    const href = '/' + segments.slice(0, i + 1).join('/');
    return { href, label: labelForPath(href) };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center">
      <ol className="flex items-center gap-1.5 text-sm">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-1.5">
              {i > 0 && (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
              )}
              {isLast ? (
                <span className="font-medium text-foreground">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
