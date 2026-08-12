'use client';

import {
  Check,
  Wifi,
  BatteryCharging,
  FileCheck,
  MapPin,
  type LucideIcon,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { StatusPill } from '@/components/ui/status-pill';
import {
  activityEvents,
  type ActivityEvent,
  type ActivityStatus,
} from '@/lib/dashboard-data';

const iconMap: Record<ActivityEvent['icon'], LucideIcon> = {
  check: Check,
  wifi: Wifi,
  battery: BatteryCharging,
  file: FileCheck,
  map: MapPin,
};

const statusMap: Record<
  ActivityStatus,
  { label: string; variant: 'success' | 'info' | 'warning' | 'neutral' }
> = {
  completed: { label: 'Completed', variant: 'success' },
  connected: { label: 'Connected', variant: 'info' },
  replaced: { label: 'Replaced', variant: 'neutral' },
  approved: { label: 'Approved', variant: 'success' },
  entered: { label: 'Entered', variant: 'warning' },
};

export function ActivityTimeline() {
  return (
    <Card className="border-border shadow-none">
      <CardContent className="p-4">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-foreground">
            Live Activity
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Recent events across all sites
          </p>
        </div>
        <ol className="relative space-y-1">
          {activityEvents.map((event, index) => {
            const Icon = iconMap[event.icon];
            const status = statusMap[event.status];
            const isLast = index === activityEvents.length - 1;
            return (
              <li key={event.id} className="relative flex gap-3 pb-4">
                {/* Timeline line */}
                {!isLast && (
                  <span className="absolute left-[15px] top-8 h-full w-px bg-border" />
                )}
                <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-secondary">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {event.title}
                    </p>
                    <span className="shrink-0 text-[11px] text-muted-foreground/70">
                      {event.timestamp}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{event.employee}</span>
                    <span className="text-muted-foreground/40">·</span>
                    <span>{event.location}</span>
                    <span className="text-muted-foreground/40">·</span>
                    <StatusPill variant={status.variant} size="sm" dot={false}>
                      {status.label}
                    </StatusPill>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
