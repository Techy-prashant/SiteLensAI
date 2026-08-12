'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useUIStore } from '@/lib/stores/ui-store';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { SearchCommand } from '@/components/SearchCommand';
import { NotificationsMenu } from '@/components/layout/notifications-menu';
import { UserProfileMenu } from '@/components/layout/user-profile-menu';
import { MobileSidebar } from '@/components/layout/mobile-sidebar';

export function Header() {
  const pathname = usePathname();
  const toggle = useUIStore((s) => s.toggleSidebar);

  // Hide nav search bar unconditionally on Home page ('/home' or '/')
  const isHomePage = pathname === '/home' || pathname === '/';

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur support-[backdrop-filter]:bg-background/60">
      {/* Left: Mobile Sidebar toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="hidden h-9 w-9 md:flex"
          onClick={toggle}
        >
          <Menu className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>

        <div className="md:hidden">
          <MobileSidebar />
        </div>

        <div className="hidden xl:block">
          <Breadcrumbs />
        </div>
      </div>

      {/* Center: Gemini Universal Search Bar (Hidden unconditionally on /home and /) */}
      {!isHomePage && (
        <div className="flex-1 max-w-xl mx-4">
          <SearchCommand />
        </div>
      )}

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-1.5 ml-auto">
        <NotificationsMenu />
        <div className="mx-1 hidden h-6 w-px bg-border sm:block" />
        <UserProfileMenu />
      </div>
    </header>
  );
}
