'use client';

import * as React from 'react';
import { ArrowDown, ArrowUp, ChevronsUpDown, MoreHorizontal } from 'lucide-react';

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from '@/components/ui/pagination';

export type SortDirection = 'asc' | 'desc';

export interface SortableColumn<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  className?: string;
  render?: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number;
}

interface SortableDataTableProps<T> {
  columns: SortableColumn<T>[];
  data: T[];
  rowKey: (row: T, index: number) => string;
  pageSize?: number;
  actionItems?: { label: string; onClick: (row: T) => void }[];
  emptyMessage?: string;
}

export function SortableDataTable<T>({
  columns,
  data,
  rowKey,
  pageSize = 5,
  actionItems = [
    { label: 'View details', onClick: () => {} },
    { label: 'Edit', onClick: () => {} },
  ],
  emptyMessage = 'No records found.',
}: SortableDataTableProps<T>) {
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<SortDirection>('asc');
  const [page, setPage] = React.useState(1);

  const sortedData = React.useMemo(() => {
    if (!sortKey) return data;
    const col = columns.find((c) => String(c.key) === sortKey);
    if (!col) return data;
    const getVal = col.sortValue
      ? col.sortValue
      : (row: T) => String((row as Record<string, unknown>)[sortKey] ?? '');
    return [...data].sort((a, b) => {
      const av = getVal(a);
      const bv = getVal(b);
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  }

  const allColumns = [...columns];
  const hasActions = actionItems.length > 0;

  return (
    <div className="w-full rounded-sm border border-border bg-card">
      <div className="overflow-x-auto scrollbar-thin">
        <Table>
          <TableHeader>
            <TableRow className="border-border bg-secondary/30 hover:bg-secondary/30">
              {allColumns.map((col) => {
                const keyStr = String(col.key);
                const isSorted = sortKey === keyStr;
                return (
                  <TableHead
                    key={keyStr}
                    className={cn(
                      'h-11 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground',
                      col.sortable && 'cursor-pointer select-none hover:text-foreground',
                      col.className
                    )}
                    onClick={col.sortable ? () => toggleSort(keyStr) : undefined}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.header}
                      {col.sortable && (
                        <span className="text-muted-foreground/50">
                          {isSorted ? (
                            sortDir === 'asc' ? (
                              <ArrowUp className="h-3 w-3" />
                            ) : (
                              <ArrowDown className="h-3 w-3" />
                            )
                          ) : (
                            <ChevronsUpDown className="h-3 w-3" />
                          )}
                        </span>
                      )}
                    </span>
                  </TableHead>
                );
              })}
              {hasActions && (
                <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <span className="sr-only">Actions</span>
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagedData.length === 0 ? (
              <TableRow className="border-border hover:bg-transparent">
                <TableCell
                  colSpan={allColumns.length + (hasActions ? 1 : 0)}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              pagedData.map((row, i) => (
                <TableRow key={rowKey(row, i)} className="border-border">
                  {allColumns.map((col) => (
                    <TableCell
                      key={String(col.key)}
                      className={cn('px-4 py-3 text-sm', col.className)}
                    >
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key as string] ?? '')}
                    </TableCell>
                  ))}
                  {hasActions && (
                    <TableCell className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {actionItems.map((item) => (
                            <DropdownMenuItem
                              key={item.label}
                              onClick={() => item.onClick(row)}
                            >
                              {item.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={cn(
                    currentPage === 1 && 'pointer-events-none opacity-50'
                  )}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={p === currentPage}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={cn(
                    currentPage === totalPages && 'pointer-events-none opacity-50'
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
