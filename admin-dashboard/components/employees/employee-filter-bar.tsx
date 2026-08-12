'use client';

import { Search, X } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  departments,
  roleOptions,
  siteLocations,
} from '@/lib/employees-data';

export interface EmployeeFilters {
  search: string;
  department: string;
  role: string;
  site: string;
  glasses: string;
  status: string;
}

interface EmployeeFilterBarProps {
  filters: EmployeeFilters;
  onChange: (filters: EmployeeFilters) => void;
}

export function EmployeeFilterBar({ filters, onChange }: EmployeeFilterBarProps) {
  function update(key: keyof EmployeeFilters, value: string) {
    onChange({ ...filters, [key]: value });
  }

  function clearAll() {
    onChange({
      search: '',
      department: 'all',
      role: 'all',
      site: 'all',
      glasses: 'all',
      status: 'all',
    });
  }

  const hasActive =
    filters.search !== '' ||
    filters.department !== 'all' ||
    filters.role !== 'all' ||
    filters.site !== 'all' ||
    filters.glasses !== 'all' ||
    filters.status !== 'all';

  return (
    <div className="flex flex-col gap-3 rounded-sm border border-border bg-card p-4 lg:flex-row lg:items-center">
      <div className="relative w-full lg:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search employee name or ID…"
          value={filters.search}
          onChange={(e) => update('search', e.target.value)}
          className="h-9 pl-9"
        />
      </div>

      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Select value={filters.department} onValueChange={(v) => update('department', v)}>
          <SelectTrigger className="h-9 w-full sm:w-[150px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.role} onValueChange={(v) => update('role', v)}>
          <SelectTrigger className="h-9 w-full sm:w-[170px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {roleOptions.map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.site} onValueChange={(v) => update('site', v)}>
          <SelectTrigger className="h-9 w-full sm:w-[160px]">
            <SelectValue placeholder="Site" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sites</SelectItem>
            {siteLocations.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.glasses} onValueChange={(v) => update('glasses', v)}>
          <SelectTrigger className="h-9 w-full sm:w-[150px]">
            <SelectValue placeholder="Glasses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Glasses</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="none">Unassigned</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.status} onValueChange={(v) => update('status', v)}>
          <SelectTrigger className="h-9 w-full sm:w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="on-site">On Site</SelectItem>
            <SelectItem value="off-site">Off Site</SelectItem>
            <SelectItem value="on-leave">On Leave</SelectItem>
            <SelectItem value="training">Training</SelectItem>
            <SelectItem value="emergency">Emergency Response</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActive && (
        <Button variant="ghost" size="sm" onClick={clearAll} className="h-9 shrink-0">
          <X className="mr-1.5 h-3.5 w-3.5" />
          Clear
        </Button>
      )}
    </div>
  );
}
