'use client';

import {
  Sun,
  Cloud,
  CloudRain,
  Wind,
  CheckCircle2,
  Clock,
  MapPinned,
  Cpu,
  type LucideIcon,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { StatusPill } from '@/components/ui/status-pill';
import { siteStatus, type SiteStatus } from '@/lib/dashboard-data';

const weatherIconMap: Record<SiteStatus['weatherIcon'], LucideIcon> = {
  sun: Sun,
  cloud: Cloud,
  rain: CloudRain,
  wind: Wind,
};

interface StatusRow {
  icon: LucideIcon;
  label: string;
  value: string;
  badge?: React.ReactNode;
}

export function SiteStatusCard() {
  const WeatherIcon = weatherIconMap[siteStatus.weatherIcon];

  const rows: StatusRow[] = [
    {
      icon: WeatherIcon,
      label: 'Weather',
      value: siteStatus.weather,
    },
    {
      icon: CheckCircle2,
      label: 'Site Condition',
      value: siteStatus.siteCondition,
      badge: <StatusPill variant="success" size="sm" dot={false}>Operational</StatusPill>,
    },
    {
      icon: Clock,
      label: "Today's Shift",
      value: siteStatus.shift,
    },
    {
      icon: MapPinned,
      label: 'Active Zones',
      value: `${siteStatus.activeZones} zones`,
    },
    {
      icon: Cpu,
      label: 'Connected Devices',
      value: `${siteStatus.connectedDevices} devices`,
    },
  ];

  return (
    <Card className="border-border shadow-none">
      <CardContent className="p-4">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-foreground">Site Status</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Current operational overview
          </p>
        </div>
        <ul className="space-y-3">
          {rows.map((row) => {
            const Icon = row.icon;
            return (
              <li
                key={row.label}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-border bg-secondary">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      {row.label}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {row.value}
                    </p>
                  </div>
                </div>
                {row.badge}
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
