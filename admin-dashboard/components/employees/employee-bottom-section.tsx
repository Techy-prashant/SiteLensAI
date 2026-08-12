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
  recentNewEmployees,
  upcomingCertifications,
  trainingSchedule,
  safetyCompliance,
  type CertificationItem,
  type TrainingItem,
  type NewEmployee,
} from '@/lib/employees-data';

const certStatusPill: Record<CertificationItem['status'], React.ReactNode> = {
  valid: <StatusPill variant="success" size="sm">Valid</StatusPill>,
  expiring: <StatusPill variant="warning" size="sm">Expiring</StatusPill>,
  expired: <StatusPill variant="danger" size="sm">Expired</StatusPill>,
};

const trainingStatusPill: Record<TrainingItem['status'], React.ReactNode> = {
  scheduled: <StatusPill variant="info" size="sm">Scheduled</StatusPill>,
  'in-progress': <StatusPill variant="warning" size="sm">In Progress</StatusPill>,
  completed: <StatusPill variant="success" size="sm">Completed</StatusPill>,
};

const newEmpStatusPill: Record<NewEmployee['status'], React.ReactNode> = {
  active: <StatusPill variant="success" size="sm">Active</StatusPill>,
  onboarding: <StatusPill variant="info" size="sm">Onboarding</StatusPill>,
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

export function EmployeeBottomSection() {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      {/* Recent New Employees */}
      <div>
        <SectionHeader
          title="Recent New Employees"
          description="Latest additions to the workforce"
          className="mb-3"
        />
        <MiniTable headers={['ID', 'Name', 'Role', 'Start Date', 'Status']}>
          {recentNewEmployees.map((emp) => (
            <TableRow key={emp.id} className="border-border">
              <TableCell className="px-4 py-2.5 text-sm font-medium text-foreground">{emp.id}</TableCell>
              <TableCell className="px-4 py-2.5 text-sm text-foreground">{emp.name}</TableCell>
              <TableCell className="px-4 py-2.5 text-sm text-muted-foreground">{emp.role}</TableCell>
              <TableCell className="px-4 py-2.5 text-xs text-muted-foreground">{emp.startDate}</TableCell>
              <TableCell className="px-4 py-2.5">{newEmpStatusPill[emp.status]}</TableCell>
            </TableRow>
          ))}
        </MiniTable>
      </div>

      {/* Upcoming Certifications */}
      <div>
        <SectionHeader
          title="Upcoming Certifications"
          description="Certifications needing attention"
          className="mb-3"
        />
        <MiniTable headers={['Employee', 'Certification', 'Expiry', 'Status']}>
          {upcomingCertifications.map((cert) => (
            <TableRow key={cert.id} className="border-border">
              <TableCell className="px-4 py-2.5 text-sm font-medium text-foreground">{cert.employee}</TableCell>
              <TableCell className="px-4 py-2.5 text-sm text-muted-foreground">{cert.certification}</TableCell>
              <TableCell className="px-4 py-2.5 text-xs text-muted-foreground">{cert.expiry}</TableCell>
              <TableCell className="px-4 py-2.5">{certStatusPill[cert.status]}</TableCell>
            </TableRow>
          ))}
        </MiniTable>
      </div>

      {/* Training Schedule */}
      <div>
        <SectionHeader
          title="Training Schedule"
          description="Upcoming and in-progress training"
          className="mb-3"
        />
        <MiniTable headers={['Training', 'Assigned To', 'Scheduled', 'Status']}>
          {trainingSchedule.map((item) => (
            <TableRow key={item.id} className="border-border">
              <TableCell className="px-4 py-2.5 text-sm font-medium text-foreground">{item.training}</TableCell>
              <TableCell className="px-4 py-2.5 text-sm text-muted-foreground">{item.assignedTo}</TableCell>
              <TableCell className="px-4 py-2.5 text-xs text-muted-foreground">{item.scheduled}</TableCell>
              <TableCell className="px-4 py-2.5">{trainingStatusPill[item.status]}</TableCell>
            </TableRow>
          ))}
        </MiniTable>
      </div>

      {/* Safety Compliance */}
      <div>
        <SectionHeader
          title="Safety Compliance"
          description="Workforce compliance by category"
          className="mb-3"
        />
        <Card className="border-border shadow-none">
          <CardContent className="space-y-4 p-4">
            {safetyCompliance.map((item) => (
              <div key={item.id}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{item.category}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.compliant}/{item.total} ({item.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
