'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeCustomizer } from '@/components/theme-customizer';
import { AppShell } from '@/components/layout/app-shell';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Toaster } from '@/components/ui/sonner';

const authRoutes = ['/login', '/forgot-password'];

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = authRoutes.includes(pathname);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      forcedTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <ThemeCustomizer>
        {isAuthRoute ? (
          <>{children}</>
        ) : (
          <AppShell>
            <AuthGuard>{children}</AuthGuard>
          </AppShell>
        )}
        <Toaster position="top-right" closeButton />
      </ThemeCustomizer>
    </ThemeProvider>
  );
}
