'use client';

import * as React from 'react';
import { Battery, BatteryFull, BatteryLow, BatteryMedium, BatteryWarning, Plug, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { StatusPill } from '@/components/ui/status-pill';
import type { Device, BatteryLevel, ConnectionStatus } from '@/lib/devices-data';

const batteryConfig: Record<
  BatteryLevel,
  { icon: typeof Battery; color: string; pill: 'success' | 'warning' | 'danger' | 'info' }
> = {
  full: { icon: BatteryFull, color: 'text-success', pill: 'success' },
  medium: { icon: BatteryMedium, color: 'text-warning', pill: 'warning' },
  low: { icon: BatteryLow, color: 'text-destructive', pill: 'danger' },
  critical: { icon: BatteryWarning, color: 'text-destructive', pill: 'danger' },
  charging: { icon: Plug, color: 'text-info', pill: 'info' },
};

const connectionPill: Record<ConnectionStatus, React.ReactNode> = {
  online: <StatusPill variant="success" size="sm">Online</StatusPill>,
  offline: <StatusPill variant="danger" size="sm">Offline</StatusPill>,
  syncing: <StatusPill variant="warning" size="sm">Syncing</StatusPill>,
};

interface DeviceTableProps {
  devices: Device[];
  onRowClick: (device: Device) => void;
}

export function DeviceTable({ devices, onRowClick }: DeviceTableProps) {
  return (
    <div className="w-full rounded-sm border border-border bg-card">
      <div className="overflow-x-auto scrollbar-thin">
        <Table>
          <TableHeader>
            <TableRow className="border-border bg-secondary/30 hover:bg-secondary/30">
              <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Device ID</TableHead>
              <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Employee</TableHead>
              <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Site</TableHead>
              <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Battery</TableHead>
              <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Firmware</TableHead>
              <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Usage Session</TableHead>
              <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Connection</TableHead>
              <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Last Sync</TableHead>
              <TableHead className="h-11 px-4 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.length === 0 ? (
              <TableRow className="border-border hover:bg-transparent">
                <TableCell colSpan={9} className="h-24 text-center text-sm text-muted-foreground">
                  No devices match the current filters.
                </TableCell>
              </TableRow>
            ) : (
              devices.map((device) => {
                const bat = batteryConfig[device.batteryLevel];
                const BatIcon = bat.icon;
                return (
                  <TableRow
                    key={device.id}
                    onClick={() => onRowClick(device)}
                    className="cursor-pointer border-border"
                  >
                    <TableCell className="px-4 py-3 text-sm font-medium text-foreground">
                      {device.id}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                      {device.assignedEmployee}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                      {device.assignedSite}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <BatIcon className={cn('h-4 w-4', bat.color)} />
                        <span className="text-sm font-medium text-foreground">
                          {device.batteryLevel === 'charging'
                            ? 'Charging'
                            : `${device.batteryPercent}%`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-foreground">{device.firmware}</span>
                        {device.firmwareUpdateAvailable && (
                          <span className="rounded-sm bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                            UPDATE
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                      {device.usageSession}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {connectionPill[device.connection]}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                      {device.lastSync}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRowClick(device);
                        }}
                      >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
