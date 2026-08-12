'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { useAuthStore } from '@/lib/stores/auth-store';
import { navItems } from '@/lib/navigation';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    // RBAC route protection
    const currentItem = navItems.find(
      (n) => pathname === n.href || pathname.startsWith(n.href + '/')
    );
    if (currentItem?.roles && !currentItem.roles.includes(user.role)) {
      router.replace('/dashboard');
    }
  }, [hydrated, user, pathname, router]);

  if (!hydrated || !user) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
