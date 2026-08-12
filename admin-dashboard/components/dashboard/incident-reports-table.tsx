'use client';

import { SortableDataTable, type SortableColumn } from '@/components/ui/sortable-data-table';
import { StatusPill } from '@/components/ui/status-pill';
import {
  incidentReports,
  type IncidentReport,
  type IncidentSeverity,
  type IncidentStatus,
} from '@/lib/dashboard-data';

const severityPill: Record<IncidentSeverity, React.ReactNode> = {
  critical: <StatusPill variant="danger" size="sm">Critical</StatusPill>,
  high: <StatusPill variant="warning" size="sm">High</StatusPill>,
  medium: <StatusPill variant="info" size="sm">Medium</StatusPill>,
  low: <StatusPill variant="neutral" size="sm">Low</StatusPill>,
};

const statusPill: Record<IncidentStatus, React.ReactNode> = {
  open: <StatusPill variant="danger" size="sm">Open</StatusPill>,
  investigating: <StatusPill variant="warning" size="sm">Investigating</StatusPill>,
  resolved: <StatusPill variant="success" size="sm">Resolved</StatusPill>,
};

const columns: SortableColumn<IncidentReport>[] = [
  { key: 'id', header: 'ID', sortable: true, className: 'font-medium' },
  { key: 'category', header: 'Category', sortable: true },
  { key: 'site', header: 'Site', sortable: true },
  { key: 'reportedBy', header: 'Reported By', sortable: true },
  {
    key: 'severity',
    header: 'Severity',
    sortable: true,
    render: (row) => severityPill[row.severity],
    sortValue: (row) => row.severity,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (row) => statusPill[row.status],
    sortValue: (row) => row.status,
  },
  { key: 'timestamp', header: 'Timestamp', sortable: true },
];

export function IncidentReportsTable() {
  return (
    <SortableDataTable
      columns={columns}
      data={incidentReports}
      rowKey={(row) => row.id}
      pageSize={5}
      actionItems={[
        { label: 'View details', onClick: () => {} },
        { label: 'Investigate', onClick: () => {} },
        { label: 'Mark resolved', onClick: () => {} },
      ]}
    />
  );
}
