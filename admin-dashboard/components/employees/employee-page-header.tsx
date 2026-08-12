'use client';

import { Users, UserCheck, Briefcase, Glasses, Plus, Download } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { employees } from '@/lib/employees-data';
import { showComingSoonToast } from '@/lib/utils';

export function EmployeePageHeader({ onAdd }: { onAdd: () => void }) {
  const total = employees.length;
  const active = employees.filter((e) => e.status === 'on-site' || e.status === 'emergency').length;
  const managers = employees.filter((e) => e.accessLevel === 'manager' || e.accessLevel === 'site-admin' || e.accessLevel === 'supervisor').length;
  const withGlasses = employees.filter((e) => e.smartGlasses !== 'None').length;

  const stats = [
    { label: 'Total Employees', value: total, icon: Users, accent: false },
    { label: 'Active Workers', value: active, icon: UserCheck, accent: true },
    { label: 'Managers', value: managers, icon: Briefcase, accent: false },
    { label: 'Wearing Glasses', value: withGlasses, icon: Glasses, accent: true },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Employee &amp; Roster Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Workforce directory, assignments, and safety compliance overview.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => showComingSoonToast('Export Employees')}>
            <Download className="mr-2 h-3.5 w-3.5" />
            Export Employees
          </Button>
          <Button size="sm" onClick={onAdd}>
            <Plus className="mr-2 h-3.5 w-3.5" />
            Add Employee
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
