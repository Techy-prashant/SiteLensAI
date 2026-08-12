'use client';

import * as React from 'react';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, UserCheck, Plus, Shield, Briefcase, Lock, User } from 'lucide-react';
import { useMockStore } from '@/lib/mock-store';
import { EmployeeProfileModal } from '@/components/EmployeeProfileModal';
import { EmployeeRecord } from '@/lib/types';
import { toast } from 'sonner';

// Modals
import { CreateSupervisorModal } from '@/components/forms/create-supervisor-modal';
import { CreateSiteManagerModal } from '@/components/forms/create-site-manager-modal';
import { CreateFieldWorkerModal } from '@/components/forms/create-field-worker-modal';

export default function EmployeesPage() {
  const {
    activeRoleId,
    activeEmpId,
    admins,
    supervisors,
    siteManagers,
    fieldWorkers,
    sites,
  } = useMockStore();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedEmp, setSelectedEmp] = React.useState<EmployeeRecord | null>(null);
  const [profileModalOpen, setProfileModalOpen] = React.useState(false);

  // Modals
  const [supModalOpen, setSupModalOpen] = React.useState(false);
  const [mgrModalOpen, setMgrModalOpen] = React.useState(false);
  const [wrkModalOpen, setWrkModalOpen] = React.useState(false);

  // Combine all employee records
  const allEmployees: EmployeeRecord[] = React.useMemo(() => {
    return [
      ...admins.map((a) => ({ type: 'Admin' as const, ...a })),
      ...supervisors.map((s) => ({ type: 'Supervisor' as const, ...s })),
      ...siteManagers.map((m) => ({ type: 'Site Manager' as const, ...m })),
      ...fieldWorkers.map((w) => ({ type: 'Field Worker' as const, ...w })),
    ];
  }, [admins, supervisors, siteManagers, fieldWorkers]);

  // RBAC Access Control Hierarchy
  const scopedEmployees = React.useMemo(() => {
    return allEmployees.filter((e) => {
      // 1. Super Admin: Global read access to all personnel records
      if (activeRoleId === 1) return true;

      // 2. Supervisor: Scoped access strictly limited to Site Managers (nothing else)
      if (activeRoleId === 2) return e.type === 'Site Manager';

      // 3. Site Manager: Scoped access strictly limited to Field Workers (nothing else)
      if (activeRoleId === 3) return e.type === 'Field Worker';

      return false;
    }).filter((e) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const dept = 'Sub_Role' in e ? e.Sub_Role : e.type;
      const site = sites.find((s) => s.Site_manager === e.Emp_id || s.site_supervisor === e.Emp_id)?.Site_id || 'SITE-101';
      return (
        e.Emp_id.toLowerCase().includes(q) ||
        e.Name.toLowerCase().includes(q) ||
        dept.toLowerCase().includes(q) ||
        site.toLowerCase().includes(q)
      );
    });
  }, [allEmployees, activeRoleId, searchQuery, sites]);

  const handleRowClick = (emp: EmployeeRecord) => {
    const canAccess =
      activeRoleId === 1 ||
      (activeRoleId === 2 && emp.type === 'Site Manager') ||
      (activeRoleId === 3 && emp.type === 'Field Worker');

    if (!canAccess) {
      toast.error('Access Restricted', {
        description:
          activeRoleId === 2
            ? 'Supervisors can only access Site Manager profile records.'
            : activeRoleId === 3
            ? 'Site Managers can only access Field Worker profile records.'
            : 'Employee profile records are restricted for this role.',
      });
      return;
    }
    setSelectedEmp(emp);
    setProfileModalOpen(true);
  };

  return (
    <PageContainer
      title="Employee Directory &amp; RBAC Hierarchy"
      description="Minimalist personnel grid with progressive data disclosure."
    >
      <div className="space-y-6">
        {/* Controls: Search & Role Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by Employee Number, Name, Department..."
              className="pl-9 h-9 text-xs"
            />
          </div>

          {activeRoleId === 1 && (
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => setSupModalOpen(true)} className="text-xs">
                <Plus className="mr-1 h-3.5 w-3.5" /> + Supervisor
              </Button>
              <Button size="sm" variant="outline" onClick={() => setMgrModalOpen(true)} className="text-xs">
                <Plus className="mr-1 h-3.5 w-3.5" /> + Manager
              </Button>
              <Button size="sm" variant="outline" onClick={() => setWrkModalOpen(true)} className="text-xs">
                <Plus className="mr-1 h-3.5 w-3.5" /> + Worker
              </Button>
            </div>
          )}
        </div>

        {/* Minimalist Data Presentation Table */}
        <Card className="border-border shadow-sm">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold">Personnel Data Grid</CardTitle>
              <Badge variant="outline" className="font-mono text-xs">
                Showing {scopedEmployees.length} Records (Role {activeRoleId} Scope)
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/40">
                  <TableHead className="text-xs font-bold uppercase">Employee_Number</TableHead>
                  <TableHead className="text-xs font-bold uppercase">Full_Name</TableHead>
                  <TableHead className="text-xs font-bold uppercase">Department / Sub_Role</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-right">Assigned_Site</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scopedEmployees.map((emp) => {
                  const dept = 'Sub_Role' in emp ? emp.Sub_Role : emp.type;
                  const assignedSite = sites.find((s) => s.Site_manager === emp.Emp_id || s.site_supervisor === emp.Emp_id)?.Site_id || ('assigned_site_id' in emp && emp.assigned_site_id ? emp.assigned_site_id : 'SITE-101');

                  return (
                    <TableRow
                      key={`${emp.type}-${emp.Emp_id}`}
                      onClick={() => handleRowClick(emp)}
                      className="cursor-pointer hover:bg-secondary/50 transition-colors"
                    >
                      <TableCell className="font-mono font-bold text-primary text-xs">
                        <div className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{emp.Emp_id}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-xs text-foreground">
                        {emp.Name}
                      </TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="secondary" className="font-medium">
                          {dept}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs text-indigo-400 font-semibold">
                        {assignedSite}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Staff Detailed Profile View Modal (Super Admin access enforced) */}
      <EmployeeProfileModal
        employee={selectedEmp}
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
      />

      {/* Modals */}
      <CreateSupervisorModal open={supModalOpen} onOpenChange={setSupModalOpen} />
      <CreateSiteManagerModal open={mgrModalOpen} onOpenChange={setMgrModalOpen} />
      <CreateFieldWorkerModal open={wrkModalOpen} onOpenChange={setWrkModalOpen} />
    </PageContainer>
  );
}
