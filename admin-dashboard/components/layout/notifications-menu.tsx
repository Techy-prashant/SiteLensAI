'use client';

import * as React from 'react';
import {
  Bell,
  AlertTriangle,
  BatteryWarning,
  UserPlus,
  WifiOff,
  FileCheck,
  ClipboardCheck,
  Check,
  type LucideIcon,
} from 'lucide-react';

import { toast } from 'sonner';
import { cn, showComingSoonToast } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { notifications as initialNotifications, type NotificationItem } from '@/lib/settings-data';
import { useVLMAlerts } from '@/hooks/use-vlm-alerts';

const categoryIcon: Record<NotificationItem['category'], LucideIcon> = {
  emergency: AlertTriangle,
  battery: BatteryWarning,
  employee: UserPlus,
  device: WifiOff,
  report: FileCheck,
  inspection: ClipboardCheck,
};

const severityBg: Record<NotificationItem['severity'], string> = {
  critical: 'bg-destructive/10 text-destructive',
  warning: 'bg-warning/10 text-warning',
  info: 'bg-info/10 text-info',
};

export function NotificationsMenu() {
  const [items, setItems] = React.useState(initialNotifications);
  const { alerts: vlmAlerts } = useVLMAlerts();

  React.useEffect(() => {
    if (vlmAlerts.length > 0) {
      const vlmNotifications: NotificationItem[] = vlmAlerts.map((a) => ({
        id: a.id,
        title: a.title,
        description: `${a.site}: ${a.hazards_detail}`,
        timestamp: a.timestamp,
        category: 'emergency',
        severity: a.severity === 'critical' ? 'critical' : a.severity === 'high' ? 'warning' : 'info',
        read: false,
      }));

      setItems((prev) => {
        const existingIds = new Set(prev.map((i) => i.id));
        const newItems = vlmNotifications.filter((n) => !existingIds.has(n.id));
        return [...newItems, ...prev];
      });
    }
  }, [vlmAlerts]);

  const unread = items.filter((n) => !n.read).length;

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  }

  function markRead(id: string) {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-96 p-0"
        sideOffset={8}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm font-semibold">Notifications</span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{unread} unread</span>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80"
              >
                <Check className="h-3 w-3" />
                Mark all read
              </button>
            )}
          </div>
        </div>
        <Separator />
        <div className="max-h-96 overflow-y-auto scrollbar-thin">
          {items.map((n) => {
            const Icon = categoryIcon[n.category];
            return (
              <div
                key={n.id}
                className={cn(
                  'flex gap-3 px-4 py-3 transition-colors hover:bg-secondary cursor-pointer',
                  !n.read && 'bg-accent/40'
                )}
                onClick={() => markRead(n.id)}
              >
                <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-sm', severityBg[n.severity])}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{n.description}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground/70">{n.timestamp}</p>
                </div>
              </div>
            );
          })}
        </div>
        <Separator />
        <button
          onClick={() => showComingSoonToast('View All Notifications')}
          className="w-full px-4 py-2.5 text-center text-xs font-medium text-primary transition-colors hover:bg-secondary"
        >
          View all notifications
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
