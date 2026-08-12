'use client';

import { SectionHeader } from '@/components/layout/section-header';
import { Card, CardContent } from '@/components/ui/card';
import { StatusPill } from '@/components/ui/status-pill';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  recentDeviceEvents,
  maintenanceSchedule,
  upcomingFirmwareUpdates,
  type DeviceEvent,
  type MaintenanceItem,
  type FirmwareUpdate,
} from '@/lib/devices-data';

const eventSeverityPill: Record<DeviceEvent['severity'], React.ReactNode> = {
  info: <StatusPill variant="info" size="sm">Info</StatusPill>,
  warning: <StatusPill variant="warning" size="sm">Warning</StatusPill>,
  critical: <StatusPill variant="danger" size="sm">Critical</StatusPill>,
};

const maintenanceStatusPill: Record<MaintenanceItem['status'], React.ReactNode> = {
  scheduled: <StatusPill variant="info" size="sm">Scheduled</StatusPill>,
  'in-progress': <StatusPill variant="warning" size="sm">In Progress</StatusPill>,
  overdue: <StatusPill variant="danger" size="sm">Overdue</StatusPill>,
};

const firmwareStatusPill: Record<FirmwareUpdate['status'], React.ReactNode> = {
  available: <StatusPill variant="info" size="sm">Available</StatusPill>,
  scheduled: <StatusPill variant="warning" size="sm">Scheduled</StatusPill>,
  'rolling-out': <StatusPill variant="success" size="sm">Rolling Out</StatusPill>,
};

function MiniTable({
  headers,
  children,
}: {
  headers: string[];
  children: React.ReactNode;
}) {
  return (
    <Card className="border-border shadow-none">
      <div className="overflow-x-auto scrollbar-thin">
        <Table>
          <TableHeader>
            <TableRow className="border-border bg-secondary/30 hover:bg-secondary/30">
              {headers.map((h) => (
                <TableHead
                  key={h}
                  className="h-10 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>{children}</TableBody>
        </Table>
      </div>
    </Card>
  );
}

export function DeviceBottomSection() {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      {/* Recent Device Events */}
      <div>
        <SectionHeader
          title="Recent Device Events"
          description="Latest fleet alerts"
          className="mb-3"
        />
        <MiniTable headers={['Device', 'Event', 'Severity', 'Time']}>
          {recentDeviceEvents.map((e) => (
            <TableRow key={e.id} className="border-border">
              <TableCell className="px-4 py-2.5 text-sm font-medium text-foreground">{e.device}</TableCell>
              <TableCell className="px-4 py-2.5 text-sm text-muted-foreground">{e.event}</TableCell>
              <TableCell className="px-4 py-2.5">{eventSeverityPill[e.severity]}</TableCell>
              <TableCell className="px-4 py-2.5 text-xs text-muted-foreground">{e.timestamp}</TableCell>
            </TableRow>
          ))}
        </MiniTable>
      </div>

      {/* Maintenance Schedule */}
      <div>
        <SectionHeader
          title="Maintenance Schedule"
          description="Upcoming service tasks"
          className="mb-3"
        />
        <MiniTable headers={['Device', 'Task', 'Scheduled', 'Status']}>
          {maintenanceSchedule.map((m) => (
            <TableRow key={m.id} className="border-border">
              <TableCell className="px-4 py-2.5 text-sm font-medium text-foreground">{m.device}</TableCell>
              <TableCell className="px-4 py-2.5 text-sm text-muted-foreground">{m.task}</TableCell>
              <TableCell className="px-4 py-2.5 text-xs text-muted-foreground">{m.scheduled}</TableCell>
              <TableCell className="px-4 py-2.5">{maintenanceStatusPill[m.status]}</TableCell>
            </TableRow>
          ))}
        </MiniTable>
      </div>

      {/* Upcoming Firmware Updates */}
      <div>
        <SectionHeader
          title="Upcoming Firmware"
          description="Pending firmware releases"
          className="mb-3"
        />
        <MiniTable headers={['Version', 'Devices', 'Release Date', 'Status']}>
          {upcomingFirmwareUpdates.map((f) => (
            <TableRow key={f.id} className="border-border">
              <TableCell className="px-4 py-2.5 text-sm font-medium text-foreground">{f.version}</TableCell>
              <TableCell className="px-4 py-2.5 text-sm text-muted-foreground">{f.devicesAffected}</TableCell>
              <TableCell className="px-4 py-2.5 text-xs text-muted-foreground">{f.releaseDate}</TableCell>
              <TableCell className="px-4 py-2.5">{firmwareStatusPill[f.status]}</TableCell>
            </TableRow>
          ))}
        </MiniTable>
      </div>
    </div>
  );
}
