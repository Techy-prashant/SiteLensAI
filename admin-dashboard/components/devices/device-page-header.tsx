'use client';

import { Glasses, Plus, Download, Wifi, WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { devices } from '@/lib/devices-data';
import { showComingSoonToast } from '@/lib/utils';

export function DevicePageHeader() {
  const total = devices.length;
  const online = devices.filter((d) => d.connection === 'online').length;
  const offline = devices.filter((d) => d.connection === 'offline').length;
  const needUpdate = devices.filter((d) => d.firmwareUpdateAvailable).length;

  const stats = [
    { label: 'Total Devices', value: total, icon: Glasses, accent: false },
    { label: 'Online', value: online, icon: Wifi, accent: true },
    { label: 'Offline', value: offline, icon: WifiOff, accent: false },
    { label: 'Need Update', value: needUpdate, icon: AlertTriangle, accent: true },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Hardware &amp; Device Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enterprise inventory and telemetry for Meta Smart Glasses fleet.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => showComingSoonToast('Export Inventory')}>
            <Download className="mr-2 h-3.5 w-3.5" />
            Export Inventory
          </Button>
          <Button size="sm" onClick={() => showComingSoonToast('Register New Device')}>
            <Plus className="mr-2 h-3.5 w-3.5" />
            Register New Device
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="relative overflow-hidden border-border shadow-none">
              {stat.accent && (
                <div className="absolute left-0 top-0 h-full w-0.5 bg-primary/20" />
              )}
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                    {stat.value}
                  </p>
                </div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-border bg-secondary">
                  <Icon className="h-[18px] w-[18px] text-primary" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
