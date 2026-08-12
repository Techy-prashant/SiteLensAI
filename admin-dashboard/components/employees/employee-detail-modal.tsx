'use client';

import * as React from 'react';
import {
  Clock,
  Glasses,
  ClipboardCheck,
  MapPin,
  MapPinOff,
  FileText,
  Package,
  CheckCircle2,
  XCircle,
  type LucideIcon,
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusPill } from '@/components/ui/status-pill';
import { Separator } from '@/components/ui/separator';
import { showComingSoonToast } from '@/lib/utils';
import {
  accessLevelOptions,
  employeeActivity,
  type Employee,
  type AccessLevel,
  type EmployeeStatus,
  type ActivityIconType,
} from '@/lib/employees-data';

const statusConfig: Record<EmployeeStatus, { label: string; variant: 'success' | 'neutral' | 'warning' | 'info' | 'danger' }> = {
  'on-site': { label: 'On Site', variant: 'success' },
  'off-site': { label: 'Off Site', variant: 'neutral' },
  'on-leave': { label: 'On Leave', variant: 'warning' },
  training: { label: 'Training', variant: 'info' },
  emergency: { label: 'Emergency Response', variant: 'danger' },
};

const activityIconMap: Record<ActivityIconType, LucideIcon> = {
  'clock-in': Clock,
  device: Glasses,
  inspection: ClipboardCheck,
  enter: MapPin,
  exit: MapPinOff,
  report: FileText,
};

interface EmployeeDetailModalProps {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (employee: Employee) => void;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground text-right">{value}</span>
    </div>
  );
}

export function EmployeeDetailModal({
  employee,
  open,
  onOpenChange,
  onEdit,
}: EmployeeDetailModalProps) {
  if (!employee) return null;
  const status = statusConfig[employee.status];
  const hasGlasses = employee.smartGlasses !== 'None';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border border-border">
              <AvatarFallback className="bg-secondary text-sm font-semibold text-foreground">
                {employee.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-lg">{employee.name}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {employee.role} · {employee.department} · {employee.id}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5">
          {/* Status + Access badges */}
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill variant={status.variant} size="md">{status.label}</StatusPill>
            <StatusPill variant="info" size="md" dot={false}>
              {employee.accessLevel.replace('-', ' ')}
            </StatusPill>
            <Button variant="outline" size="sm" className="ml-auto" onClick={() => onEdit(employee)}>
              Edit Employee
            </Button>
          </div>

          {/* Personal & Contact */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h4 className="mb-2 text-sm font-semibold text-foreground">Personal Information</h4>
              <div className="rounded-sm border border-border bg-card px-4">
                <InfoRow label="Employee ID" value={employee.id} />
                <Separator />
                <InfoRow label="Name" value={employee.name} />
                <Separator />
                <InfoRow label="Role" value={employee.role} />
                <Separator />
                <InfoRow label="Department" value={employee.department} />
              </div>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-semibold text-foreground">Contact Information</h4>
              <div className="rounded-sm border border-border bg-card px-4">
                <InfoRow label="Email" value={employee.email} />
                <Separator />
                <InfoRow label="Phone" value={employee.phone} />
                <Separator />
                <InfoRow label="Emergency Contact" value={employee.emergencyContact} />
                <Separator />
                <InfoRow label="Emergency Phone" value={employee.emergencyPhone} />
              </div>
            </div>
          </div>

          {/* Assignment & Shift */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h4 className="mb-2 text-sm font-semibold text-foreground">Assignment</h4>
              <div className="rounded-sm border border-border bg-card px-4">
                <InfoRow label="Assigned Site" value={employee.assignedSite} />
                <Separator />
                <InfoRow label="Current Shift" value={employee.todayShift} />
                <Separator />
                <InfoRow label="Training Status" value={employee.trainingStatus} />
              </div>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-semibold text-foreground">Safety Certifications</h4>
              <div className="rounded-sm border border-border bg-card px-4 py-2">
                {employee.certifications.map((cert, i) => (
                  <div key={cert.name}>
                    {i > 0 && <Separator />}
                    <div className="flex items-center justify-between gap-3 py-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">{cert.name}</p>
                        <p className="text-xs text-muted-foreground">Expires: {cert.expiry}</p>
                      </div>
                      {cert.valid ? (
                        <StatusPill variant="success" size="sm" dot={false}>
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Valid
                        </StatusPill>
                      ) : (
                        <StatusPill variant="danger" size="sm" dot={false}>
                          <XCircle className="mr-1 h-3 w-3" />
                          Expired
                        </StatusPill>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Smart Glasses Assignment */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-foreground">Smart Glasses Assignment</h4>
            {hasGlasses ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="border-border shadow-none">
                  <CardContent className="p-3">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Current Device</p>
                    <p className="mt-1 text-sm font-semibold text-foreground">{employee.smartGlasses}</p>
                  </CardContent>
                </Card>
                <Card className="border-border shadow-none">
                  <CardContent className="p-3">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Device Status</p>
                    <p className="mt-1 text-sm font-semibold text-foreground">{employee.deviceStatus}</p>
                  </CardContent>
                </Card>
                <Card className="border-border shadow-none">
                  <CardContent className="p-3">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Last Sync</p>
                    <p className="mt-1 text-sm font-semibold text-foreground">{employee.deviceLastSync}</p>
                  </CardContent>
                </Card>
                <Card className="border-border shadow-none">
                  <CardContent className="p-3">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Battery</p>
                    <p className="mt-1 text-sm font-semibold text-foreground">{employee.deviceBattery}</p>
                  </CardContent>
                </Card>
                <Card className="border-border shadow-none">
                  <CardContent className="p-3">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Usage Hours</p>
                    <p className="mt-1 text-sm font-semibold text-foreground">{employee.deviceUsageHours}</p>
                  </CardContent>
                </Card>
                <div className="flex items-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => showComingSoonToast('Revoke Smart Glasses')}>Revoke Glasses</Button>
                  <Button variant="outline" size="sm" onClick={() => showComingSoonToast('Reassign Smart Glasses')}>Reassign</Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-start gap-3 rounded-sm border border-border bg-card p-4">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No smart glasses assigned to this employee.</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => showComingSoonToast('Assign Smart Glasses')}>
                  <Glasses className="mr-2 h-3.5 w-3.5" />
                  Assign Smart Glasses
                </Button>
              </div>
            )}
          </div>

          {/* Access Level */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-foreground">Access Level</h4>
            <div className="flex flex-wrap gap-2">
              {accessLevelOptions.map((opt) => (
                <button
                  key={opt.value}
                  disabled
                  className={
                    'flex items-center gap-1.5 rounded-sm border px-3 py-1.5 text-xs font-medium transition-colors ' +
                    (employee.accessLevel === opt.value
                      ? 'border-primary/40 bg-primary/10 text-primary'
                      : 'border-border bg-secondary text-muted-foreground')
                  }
                >
                  {employee.accessLevel === opt.value && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Employee Activity Timeline */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-foreground">Employee Activity</h4>
            <ol className="relative">
              {employeeActivity.map((event, index) => {
                const Icon = activityIconMap[event.icon];
                const isLast = index === employeeActivity.length - 1;
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
                        <p className="text-sm font-medium text-foreground">{event.title}</p>
                        <span className="shrink-0 text-[11px] text-muted-foreground/70">
                          {event.timestamp}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{event.detail}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
