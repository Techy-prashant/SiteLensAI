'use client';

import { SortableDataTable, type SortableColumn } from '@/components/ui/sortable-data-table';
import { StatusPill } from '@/components/ui/status-pill';
import {
  completedTasks,
  type CompletedTask,
  type TaskStatus,
} from '@/lib/dashboard-data';

const statusPill: Record<TaskStatus, React.ReactNode> = {
  completed: <StatusPill variant="success" size="sm">Completed</StatusPill>,
  'in-progress': <StatusPill variant="warning" size="sm">In Progress</StatusPill>,
  overdue: <StatusPill variant="danger" size="sm">Overdue</StatusPill>,
};

const columns: SortableColumn<CompletedTask>[] = [
  { key: 'id', header: 'ID', sortable: true, className: 'font-medium' },
  { key: 'task', header: 'Task', sortable: true },
  { key: 'assignee', header: 'Assignee', sortable: true },
  { key: 'zone', header: 'Zone', sortable: true },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (row) => statusPill[row.status],
    sortValue: (row) => row.status,
  },
  { key: 'completedAt', header: 'Completed', sortable: true },
];

export function CompletedTasksTable() {
  return (
    <SortableDataTable
      columns={columns}
      data={completedTasks}
      rowKey={(row) => row.id}
      pageSize={5}
      actionItems={[
        { label: 'View details', onClick: () => {} },
        { label: 'Reassign', onClick: () => {} },
        { label: 'Export', onClick: () => {} },
      ]}
    />
  );
}
