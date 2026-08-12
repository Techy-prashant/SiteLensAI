'use client';

import * as React from 'react';
import { Search, Filter, X } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { firmwareVersions, siteLocations, type ConnectionStatus } from '@/lib/devices-data';

export interface DeviceFilters {
  search: string;
  battery: string;
  firmware: string;
  employee: string;
  site: string;
  connection: string;
}

interface DeviceFilterBarProps {
  filters: DeviceFilters;
  onChange: (filters: DeviceFilters) => void;
}

export function DeviceFilterBar({ filters, onChange }: DeviceFilterBarProps) {
  function update(key: keyof DeviceFilters, value: string) {
    onChange({ ...filters, [key]: value });
  }

  function clearAll() {
    onChange({
      search: '',
      battery: 'all',
      firmware: 'all',
      employee: 'all',
      site: 'all',
      connection: 'all',
    });
  }

  const hasActiveFilters =
    filters.search !== '' ||
    filters.battery !== 'all' ||
    filters.firmware !== 'all' ||
    filters.employee !== 'all' ||
    filters.site !== 'all' ||
    filters.connection !== 'all';

  return (
    <div className="flex flex-col gap-3 rounded-sm border border-border bg-card p-4 lg:flex-row lg:items-center">
      <div className="relative w-full lg:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search device ID or model…"
          value={filters.search}
          onChange={(e) => update('search', e.target.value)}
          className="h-9 pl-9"
        />
      </div>

      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Select value={filters.battery} onValueChange={(v) => update('battery', v)}>
          <SelectTrigger className="h-9 w-full sm:w-[140px]">
            <SelectValue placeholder="Battery" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Battery</SelectItem>
            <SelectItem value="full">Full (60%+)</SelectItem>
            <SelectItem value="medium">Medium (20-59%)</SelectItem>
            <SelectItem value="low">Low (1-19%)</SelectItem>
            <SelectItem value="critical">Critical (0%)</SelectItem>
            <SelectItem value="charging">Charging</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.firmware} onValueChange={(v) => update('firmware', v)}>
          <SelectTrigger className="h-9 w-full sm:w-[130px]">
            <SelectValue placeholder="Firmware" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Firmware</SelectItem>
            {firmwareVersions.map((v) => (
              <SelectItem key={v} value={v}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Employee"
          value={filters.employee === 'all' ? '' : filters.employee}
          onChange={(e) => update('employee', e.target.value || 'all')}
          className="h-9 w-full sm:w-[140px]"
        />

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

        <Select value={filters.connection} onValueChange={(v) => update('connection', v)}>
          <SelectTrigger className="h-9 w-full sm:w-[140px]">
            <SelectValue placeholder="Connection" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
            <SelectItem value="syncing">Syncing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearAll} className="h-9 shrink-0">
          <X className="mr-1.5 h-3.5 w-3.5" />
          Clear
        </Button>
      )}
    </div>
  );
}
