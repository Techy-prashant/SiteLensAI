'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronsLeft, ShieldCheck, Sparkles, LogOut, ChevronUp, UserCheck, Shield, Briefcase } from 'lucide-react';

import { cn } from '@/lib/utils';
import { getNavItemsForRole } from '@/lib/navigation';
import { useUIStore } from '@/lib/stores/ui-store';
import { useAuthStore, demoCredentialsList } from '@/lib/stores/auth-store';
import { useMockStore } from '@/lib/mock-store';
import { Button } from '@/components/ui/button';
import { SiteLensLogo } from '@/components/ui/site-lens-logo';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggle = useUIStore((s) => s.toggleSidebar);
  const sidebarStyle = useUIStore((s) => s.sidebarStyle);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const login = useAuthStore((s) => s.login);
  const setActiveRole = useMockStore((s) => s.setActiveRole);

  const items = getNavItemsForRole(user?.role ?? null);
  const adminItems = items.filter((i) => i.roles);
  const standardItems = items.filter((i) => !i.roles);

  const handleSwitchAccount = (demoEmail: string, demoPass: string, roleId: number) => {
    login(demoEmail, demoPass);
    setActiveRole(roleId as any);
  };

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  // Dynamic Sidebar Styles based on user setting
  const sidebarWidthClass = collapsed
    ? 'w-[68px]'
    : sidebarStyle === 'compact'
    ? 'w-[236px]'
    : sidebarStyle === 'minimal'
    ? 'w-60'
    : 'w-64';

  const sidebarBgClass =
    sidebarStyle === 'minimal'
      ? 'bg-[#09090b] border-white/5'
      : sidebarStyle === 'compact'
      ? 'bg-[#18181c] border-white/10'
      : 'bg-[#131314] border-border/50';

  const itemHeightClass = sidebarStyle === 'compact' ? 'h-9 text-xs' : 'h-10 text-sm';
  const itemSpacingClass = sidebarStyle === 'compact' ? 'space-y-1' : 'space-y-1';
  const logoSize = sidebarStyle === 'compact' ? 40 : 44;

  const getItemStyle = (active: boolean) => {
    if (!active) {
      return sidebarStyle === 'minimal'
        ? 'text-muted-foreground hover:bg-white/[0.04] hover:text-white'
        : 'text-muted-foreground hover:bg-white/5 hover:text-white';
    }
    if (sidebarStyle === 'minimal') {
      return 'bg-primary/10 text-white font-bold border-l-2 border-primary pl-2.5 rounded-r-lg';
    }
    if (sidebarStyle === 'compact') {
      return 'bg-primary/20 text-primary font-bold shadow-sm';
    }
    return 'bg-primary/15 text-primary font-semibold';
  };

  return (
    <aside
      data-collapsed={collapsed}
      className={cn(
        'group/sidebar relative z-30 hidden h-screen shrink-0 border-r transition-[width] duration-200 ease-in-out md:block text-foreground',
        sidebarBgClass,
        sidebarWidthClass
      )}
    >
      <div className="flex h-full flex-col">
        {/* Brand Header */}
        <div
          className={cn(
            'flex h-16 items-center border-b border-border/50 px-3.5',
            collapsed ? 'justify-center' : 'justify-start'
          )}
        >
          <Link href="/home" className="flex items-center gap-3">
            <SiteLensLogo size={logoSize} showText={!collapsed} textClassName="text-lg font-extrabold text-white tracking-tight" />
          </Link>
        </div>

        {/* Navigation List */}
        <nav className="scrollbar-thin flex-1 overflow-y-auto px-2 py-4">
          <TooltipProvider delayDuration={0}>
            <ul className={itemSpacingClass}>
              {standardItems.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== '/' && item.href !== '/home' && pathname.startsWith(item.href + '/'));
                const Icon = item.icon;
                const link = (
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center rounded-lg font-medium transition-colors',
                      itemHeightClass,
                      collapsed ? 'justify-center px-0' : 'px-3',
                      getItemStyle(active)
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-[18px] w-[18px] shrink-0',
                        active && 'text-primary'
                      )}
                    />
                    {!collapsed && <span className="ml-3 truncate">{item.title}</span>}
                  </Link>
                );
                return (
                  <li key={item.href}>
                    {collapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>{link}</TooltipTrigger>
                        <TooltipContent side="right" className="font-medium">
                          {item.title}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      link
                    )}
                  </li>
                );
              })}
            </ul>

            {adminItems.length > 0 && (
              <>
                <div
                  className={cn(
                    'mb-1 mt-6 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60',
                    collapsed && 'sr-only'
                  )}
                >
                  Administration
                </div>
                <ul className={itemSpacingClass}>
                  {adminItems.map((item) => {
                    const active =
                      pathname === item.href ||
                      pathname.startsWith(item.href + '/');
                    const Icon = item.icon;
                    const link = (
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center rounded-lg font-medium transition-colors',
                          itemHeightClass,
                          collapsed ? 'justify-center px-0' : 'px-3',
                          getItemStyle(active)
                        )}
                      >
                        <Icon
                          className={cn(
                            'h-[18px] w-[18px] shrink-0',
                            active && 'text-primary'
                          )}
                        />
                        {!collapsed && <span className="ml-3 truncate">{item.title}</span>}
                      </Link>
                    );
                    return (
                      <li key={item.href}>
                        {collapsed ? (
                          <Tooltip>
                            <TooltipTrigger asChild>{link}</TooltipTrigger>
                            <TooltipContent side="right" className="font-medium">
                              {item.title}
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          link
                        )}
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </TooltipProvider>
        </nav>

        <Separator className="bg-border/50" />

        {/* Bottom Profile Menu (Matching Screenshot 3) */}
        {user && (
          <div className="p-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    'flex w-full items-center rounded-xl border border-white/5 bg-[#1e1f20] p-2 text-left text-xs transition-colors hover:border-white/20 hover:bg-white/10',
                    collapsed ? 'justify-center' : 'justify-between'
                  )}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <Avatar className="h-7 w-7 border border-primary/40 shrink-0">
                      <AvatarFallback className="bg-primary/20 text-xs font-bold text-primary">
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                    {!collapsed && (
                      <div className="truncate leading-tight">
                        <p className="font-semibold text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{user.roleLabel}</p>
                      </div>
                    )}
                  </div>
                  {!collapsed && <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 bg-[#1e1f20] border-white/10 text-white" sideOffset={8}>
                <DropdownMenuLabel className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-white">Hi, {user.name}!</span>
                  <span className="text-xs text-muted-foreground font-mono">{user.email}</span>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-white/10" />

                <div className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  Switch Active Role Profile:
                </div>

                <DropdownMenuItem
                  onClick={() => handleSwitchAccount('admin@sitelens.ai', 'admin123', 1)}
                  className="flex items-center justify-between text-xs cursor-pointer focus:bg-white/10"
                >
                  <span className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5 text-rose-400" /> Super Admin (ADM-001)
                  </span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleSwitchAccount('supervisor@sitelens.ai', 'super123', 2)}
                  className="flex items-center justify-between text-xs cursor-pointer focus:bg-white/10"
                >
                  <span className="flex items-center gap-2">
                    <Briefcase className="h-3.5 w-3.5 text-blue-400" /> Supervisor (SUP-001)
                  </span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleSwitchAccount('manager@sitelens.ai', 'manager123', 3)}
                  className="flex items-center justify-between text-xs cursor-pointer focus:bg-white/10"
                >
                  <span className="flex items-center gap-2">
                    <UserCheck className="h-3.5 w-3.5 text-indigo-400" /> Site Manager (MGR-001)
                  </span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-white/10" />

                <DropdownMenuItem
                  className="text-destructive focus:bg-destructive/20 focus:text-destructive cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out of all accounts</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Collapse toggle */}
        <div className={cn('px-2 pb-2', collapsed ? 'flex justify-center' : 'flex justify-end')}>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <ChevronsLeft
              className={cn(
                'h-4 w-4 transition-transform',
                collapsed && 'rotate-180'
              )}
            />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
