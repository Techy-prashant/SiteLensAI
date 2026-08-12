'use client';

import * as React from 'react';
import {
  Battery,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  BatteryWarning,
  Plug,
  Cpu,
  MemoryStick,
  Camera,
  Mic,
  MapPin,
  Wifi,
  Download,
  RotateCw,
  PackageCheck,
  UserCheck,
  PackageX,
  ClipboardCheck,
  ClipboardList,
  type LucideIcon,
} from 'lucide-react';

import { cn, showComingSoonToast } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusPill } from '@/components/ui/status-pill';
import { Separator } from '@/components/ui/separator';
import {
  telemetryData,
  deviceHistory,
  type Device,
  type BatteryLevel,
  type HistoryIcon,
  type TelemetryCard,
} from '@/lib/devices-data';

const batteryIcon: Record<BatteryLevel, LucideIcon> = {
  full: BatteryFull,
  medium: BatteryMedium,
  low: BatteryLow,
  critical: BatteryWarning,
  charging: Plug,
};

const telemetryIcon: Record<TelemetryCard['icon'], LucideIcon> = {
  battery: Battery,
  cpu: Cpu,
  memory: MemoryStick,
  camera: Camera,
  mic: Mic,
  gps: MapPin,
  wifi: Wifi,
};

const historyIcon: Record<HistoryIcon, LucideIcon> = {
  firmware: Download,
  battery: RotateCw,
  assigned: UserCheck,
  returned: PackageX,
  'inspection-start': ClipboardList,
  'inspection-end': PackageCheck,
};

interface DeviceDetailSheetProps {
  device: Device | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

export function DeviceDetailSheet({ device, open, onOpenChange }: DeviceDetailSheetProps) {
  if (!device) return null;
  const BatIcon = batteryIcon[device.batteryLevel];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto scrollbar-thin p-0 sm:max-w-lg"
      >
        <SheetHeader className="border-b border-border p-6 pb-4">
          <SheetTitle className="flex items-center gap-2">
            <span className="text-lg font-semibold">{device.id}</span>
            <StatusPill
              variant={device.connection === 'online' ? 'success' : device.connection === 'syncing' ? 'warning' : 'danger'}
              size="sm"
            >
              {device.connection === 'online' ? 'Online' : device.connection === 'syncing' ? 'Syncing' : 'Offline'}
            </StatusPill>
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            {device.model} · {device.assignedSite}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 p-6">
          {/* Device Information */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              Device Information
            </h3>
            <div className="rounded-sm border border-border bg-card px-4">
              <InfoRow label="Device ID" value={device.id} />
              <Separator />
              <InfoRow label="Model" value={device.model} />
              <Separator />
              <InfoRow label="Assigned Employee" value={device.assignedEmployee} />
              <Separator />
              <InfoRow label="Assigned Site" value={device.assignedSite} />
              <Separator />
              <div className="flex items-center justify-between gap-3 py-2">
                <span className="text-xs text-muted-foreground">Battery</span>
                <div className="flex items-center gap-2">
                  <BatIcon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {device.batteryLevel === 'charging' ? 'Charging' : `${device.batteryPercent}%`}
                  </span>
                </div>
              </div>
              <Separator />
              <InfoRow label="Firmware Version" value={device.firmware} />
              <Separator />
              <InfoRow label="Connection" value={device.connection} />
              <Separator />
              <InfoRow label="Storage Usage" value={`${device.storageUsed} GB / ${device.storageTotal} GB`} />
              <Separator />
              <InfoRow label="Network Signal" value={`${device.networkSignal}%`} />
              <Separator />
              <InfoRow label="Temperature" value={device.temperature} />
              <Separator />
              <InfoRow label="Today's Usage" value={device.todayUsage} />
              <Separator />
              <InfoRow label="Last Sync" value={device.lastSync} />
            </div>
          </div>

          {/* Telemetry */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              Telemetry
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {telemetryData.map((t) => {
                const Icon = telemetryIcon[t.icon];
                return (
                  <Card key={t.id} className="border-border shadow-none">
                    <CardContent className="flex items-center gap-2.5 p-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-border bg-secondary">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          {t.active && (
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          )}
                          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                            {t.label}
                          </p>
                        </div>
                        <p className="truncate text-sm font-medium text-foreground">
                          {t.value}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Device History Timeline */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              Device History
            </h3>
            <ol className="relative">
              {deviceHistory.map((event, index) => {
                const Icon = historyIcon[event.icon];
                const isLast = index === deviceHistory.length - 1;
                return (
                  <li key={event.id} className="relative flex gap-3 pb-4">
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
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {event.detail}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Footer actions */}
          <div className="flex gap-2 border-t border-border pt-4">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => showComingSoonToast('Firmware Update')}>
              <Download className="mr-2 h-3.5 w-3.5" />
              Update Firmware
            </Button>
            <Button variant="outline" size="sm" className="flex-1" onClick={() => showComingSoonToast('Restart Device')}>
              <RotateCw className="mr-2 h-3.5 w-3.5" />
              Restart Device
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
