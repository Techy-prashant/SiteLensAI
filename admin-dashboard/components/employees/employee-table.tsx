'use client';

import { MoreHorizontal, Eye, Pencil, Copy, Trash2 } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { StatusPill } from '@/components/ui/status-pill';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Employee, EmployeeStatus } from '@/lib/employees-data';

const statusConfig: Record<EmployeeStatus, { label: string; variant: 'success' | 'neutral' | 'warning' | 'info' | 'danger' }> = {
  'on-site': { label: 'On Site', variant: 'success' },
  'off-site': { label: 'Off Site', variant: 'neutral' },
  'on-leave': { label: 'On Leave', variant: 'warning' },
  training: { label: 'Training', variant: 'info' },
  emergency: { label: 'Emergency Response', variant: 'danger' },
};

interface EmployeeTableProps {
  employees: Employee[];
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDuplicate: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export function EmployeeTable({
  employees,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
}: EmployeeTableProps) {
  return (
    <div className="w-full rounded-sm border border-border bg-card">
      <div className="overflow-x-auto scrollbar-thin">
        <Table>
          <TableHeader>
            <TableRow className="border-border bg-secondary/30 hover:bg-secondary/30">
              <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">ID</TableHead>
              <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Employee</TableHead>
              <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Role</TableHead>
              <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Department</TableHead>
              <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Site</TableHead>
              <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Glasses</TableHead>
              <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Shift</TableHead>
              <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</TableHead>
              <TableHead className="h-11 px-4 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow className="border-border hover:bg-transparent">
                <TableCell colSpan={9} className="h-24 text-center text-sm text-muted-foreground">
                  No employees match the current filters.
                </TableCell>
              </TableRow>
            ) : (
              employees.map((emp) => {
                const status = statusConfig[emp.status];
                return (
                  <TableRow
                    key={emp.id}
                    onClick={() => onView(emp)}
                    className="cursor-pointer border-border"
                  >
                    <TableCell className="px-4 py-3 text-sm font-medium text-foreground">
                      {emp.id}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8 border border-border">
                          <AvatarFallback className="bg-secondary text-xs font-semibold text-foreground">
                            {emp.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-foreground">
                          {emp.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                      {emp.role}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                      {emp.department}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                      {emp.assignedSite}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {emp.smartGlasses === 'None' ? (
                        <span className="text-xs text-muted-foreground/60">Unassigned</span>
                      ) : (
                        <span className="text-sm font-medium text-foreground">
                          {emp.smartGlasses}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                      {emp.todayShift}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <StatusPill variant={status.variant} size="sm">
                        {status.label}
                      </StatusPill>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => { e.stopPropagation(); onView(emp); }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => { e.stopPropagation(); onEdit(emp); }}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => { e.stopPropagation(); onDuplicate(emp); }}
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={(e) => { e.stopPropagation(); onDelete(emp); }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
