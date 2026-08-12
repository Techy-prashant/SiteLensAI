'use client';

import * as React from 'react';
import {
  Shield,
  Briefcase,
  Building,
  Users,
  Glasses,
  Plus,
  FileText,
  Send,
  UserCheck,
  Building2,
  Sparkles,
  Lock,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { PageContainer } from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useMockStore } from '@/lib/mock-store';
import { EmployeeProfileModal } from '@/components/EmployeeProfileModal';
import { EmployeeRecord, Task } from '@/lib/types';

// Modals
import { CreateSupervisorModal } from '@/components/forms/create-supervisor-modal';
import { CreateSiteManagerModal } from '@/components/forms/create-site-manager-modal';
import { CreateFieldWorkerModal } from '@/components/forms/create-field-worker-modal';
import { CreateSiteModal } from '@/components/forms/create-site-modal';
import { CreateTaskModal } from '@/components/forms/create-task-modal';
import { SubmitReportModal } from '@/components/forms/submit-report-modal';
import { EmergencyAlertsBanner } from '@/components/dashboard/emergency-alerts-banner';

export default function DashboardPage() {
  const {
    activeRoleId,
    activeEmpId,
    setActiveRole,
    supervisors,
    siteManagers,
    fieldWorkers,
    sites,
    tasks,
    reports,
    glasses,
    getSiteEmployeeCount,
    getSiteGlassesCount,
    updateTaskStatus,
    toggleGlassesSession,
  } = useMockStore();

  // Selected Employee Profile Modal state (Super Admin ONLY)
  const [selectedEmp, setSelectedEmp] = React.useState<EmployeeRecord | null>(null);
  const [profileModalOpen, setProfileModalOpen] = React.useState(false);

  // Form Modals state
  const [supModalOpen, setSupModalOpen] = React.useState(false);
  const [mgrModalOpen, setMgrModalOpen] = React.useState(false);
  const [wrkModalOpen, setWrkModalOpen] = React.useState(false);
  const [siteModalOpen, setSiteModalOpen] = React.useState(false);
  const [taskModalOpen, setTaskModalOpen] = React.useState(false);
  const [reportModalOpen, setReportModalOpen] = React.useState(false);

  // Directive 5: Mandatory Task Completion Confirmation Modal
  const [confirmTask, setConfirmTask] = React.useState<Task | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);

  const activeGlassesCount = glasses.filter((g) => g.Logout_dt === null).length;

  const handleOpenEmployeeProfile = (emp: EmployeeRecord) => {
    if (activeRoleId !== 1) {
      toast.error('Access Restricted', {
        description: 'Detailed employee profile records are accessible to Super Admin users only.',
      });
      return;
    }
    setSelectedEmp(emp);
    setProfileModalOpen(true);
  };

  // Directive 5 logic: Initiating 'Completed' interrupts workflow with mandatory confirmation modal
  const handleInitiateCompleteTask = (task: Task) => {
    setConfirmTask(task);
    setConfirmDialogOpen(true);
  };

  const handleConfirmTaskCompletion = () => {
    if (confirmTask) {
      updateTaskStatus(confirmTask.Task_id, 'Completed');
      toast.success('Task Completed', {
        description: `Task ${confirmTask.Task_id} (${confirmTask.TaskName}) has been marked as Completed.`,
      });
    }
    setConfirmDialogOpen(false);
    setConfirmTask(null);
  };

  // Directive 5 logic: Reverting from 'Completed' back to 'In Progress' is done SILENTLY with no pop-up!
  const handleRevertTaskStatus = (taskId: string) => {
    updateTaskStatus(taskId, 'In Progress');
    toast.success(`Task status reverted to In Progress.`);
  };

  return (
    <PageContainer
      title="SiteLens AI Dashboard"
      description="Database-driven industrial safety & smart glasses telematics."
    >
      {/* VLM Live Emergency Alerts & Database Synchronization Banner */}
      <EmergencyAlertsBanner />

      {/* Role Session Selector */}
      <div className="mb-6 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold tracking-tight text-foreground uppercase">
                Active Role Scope Simulator
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono">
              Role {activeRoleId} Session: {activeEmpId}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant={activeRoleId === 1 ? 'default' : 'outline'}
              onClick={() => setActiveRole(1)}
              className="text-xs h-8"
            >
              <Shield className="mr-1.5 h-3.5 w-3.5 text-rose-500" />
              Super Admin
            </Button>
            <Button
              size="sm"
              variant={activeRoleId === 2 ? 'default' : 'outline'}
              onClick={() => setActiveRole(2)}
              className="text-xs h-8"
            >
              <Briefcase className="mr-1.5 h-3.5 w-3.5 text-blue-500" />
              Supervisor
            </Button>
            <Button
              size="sm"
              variant={activeRoleId === 3 ? 'default' : 'outline'}
              onClick={() => setActiveRole(3)}
              className="text-xs h-8"
            >
              <Building className="mr-1.5 h-3.5 w-3.5 text-indigo-500" />
              Site Manager
            </Button>
          </div>
        </div>
      </div>

      {/* SUPER ADMIN VIEW (Role_id = 1) */}
      {activeRoleId === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Supervisors</CardTitle>
                <Briefcase className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{supervisors.length}</div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Site Managers</CardTitle>
                <UserCheck className="h-4 w-4 text-indigo-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{siteManagers.length}</div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Field Workers</CardTitle>
                <Users className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{fieldWorkers.length}</div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Active Sites</CardTitle>
                <Building2 className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sites.length}</div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Glasses In Use</CardTitle>
                <Glasses className="h-4 w-4 text-rose-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-rose-500">{activeGlassesCount}</div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase mr-2">Actions:</span>
            <Button size="sm" onClick={() => setSupModalOpen(true)}>
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Create Supervisor
            </Button>
            <Button size="sm" variant="outline" onClick={() => setMgrModalOpen(true)}>
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Create Site Manager
            </Button>
            <Button size="sm" variant="outline" onClick={() => setWrkModalOpen(true)}>
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Create Field Worker
            </Button>
            <Button size="sm" variant="outline" onClick={() => setSiteModalOpen(true)}>
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Create Site
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setTaskModalOpen(true)}>
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Assign Top Task
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Construction Sites Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Site ID</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Client Name</TableHead>
                    <TableHead>Supervisor (FK)</TableHead>
                    <TableHead>Manager (FK)</TableHead>
                    <TableHead className="text-center">No.of_employees</TableHead>
                    <TableHead className="text-center">No._of_glasses_used</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sites.map((s) => (
                    <TableRow key={s.Site_id}>
                      <TableCell className="font-mono font-bold text-primary">{s.Site_id}</TableCell>
                      <TableCell className="font-medium max-w-xs truncate">{s.Site_Location}</TableCell>
                      <TableCell>{s.client_name}</TableCell>
                      <TableCell className="font-mono text-xs">{s.site_supervisor}</TableCell>
                      <TableCell className="font-mono text-xs">{s.Site_manager}</TableCell>
                      <TableCell className="text-center font-bold">
                        <Badge variant="outline">{getSiteEmployeeCount(s.Site_id)} Workers</Badge>
                      </TableCell>
                      <TableCell className="text-center font-bold">
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30">
                          {getSiteGlassesCount(s.Site_id)} Active
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SUPERVISOR VIEW (Role_id = 2) */}
      {activeRoleId === 2 && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={() => setMgrModalOpen(true)}>
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Assign Site Manager
            </Button>
            <Button size="sm" variant="outline" onClick={() => setTaskModalOpen(true)}>
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Assign Site Task
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Supervised Sites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {sites
                  .filter((s) => s.site_supervisor === activeEmpId)
                  .map((s) => (
                    <div key={s.Site_id} className="rounded-lg border border-border bg-card p-4 space-y-2">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-primary font-mono">{s.Site_id}</span>
                        <Badge variant="outline">{s.client_name}</Badge>
                      </div>
                      <p className="text-sm font-semibold">{s.Site_Location}</p>
                      <p className="text-xs text-muted-foreground">{s.Site_Description}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                        <span>Assigned Manager: <strong className="font-mono">{s.Site_manager}</strong></span>
                        <span className="text-emerald-500 font-bold">{getSiteGlassesCount(s.Site_id)} Smart Glasses Active</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SITE MANAGER & TASK ASSIGNMENT WORKFLOW (Role_id = 3 & Tasks) */}
      {(activeRoleId === 3 || activeRoleId === 1) && (
        <div className="space-y-6 pt-4">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Task Assignment Work Orders</CardTitle>
                <CardDescription className="text-xs">
                  Directive 5: Marking as Completed triggers mandatory confirmation modal. Reverting to incomplete runs silently.
                </CardDescription>
              </div>
              <Button size="sm" onClick={() => setTaskModalOpen(true)}>
                <Plus className="mr-1.5 h-3.5 w-3.5" /> Assign Task
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task ID</TableHead>
                    <TableHead>Task Name</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action Mutation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((t) => (
                    <TableRow key={t.Task_id}>
                      <TableCell className="font-mono font-bold text-primary">{t.Task_id}</TableCell>
                      <TableCell className="font-semibold text-sm">{t.TaskName}</TableCell>
                      <TableCell className="font-mono text-xs">{t.Assigned_to}</TableCell>
                      <TableCell className="text-xs">{t.Due_date}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            t.Status === 'Completed'
                              ? 'default'
                              : t.Status === 'In Progress'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {t.Status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {t.Status !== 'Completed' ? (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleInitiateCompleteTask(t)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
                          >
                            <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Mark Completed
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRevertTaskStatus(t.Task_id)}
                            className="text-xs h-8"
                          >
                            Revert to Incomplete (Silent)
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MANDATORY TASK COMPLETION CONFIRMATION ALERT DIALOG            */}
      {/* ------------------------------------------------------------- */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent className="sm:max-w-[420px]">
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-amber-500" />
              <AlertDialogTitle>Task Completion Confirmation</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-xs pt-1">
              Are you sure the task <strong className="text-foreground">{confirmTask?.Task_id} ({confirmTask?.TaskName})</strong> is completed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-3">
            <AlertDialogCancel onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmTaskCompletion} className="bg-emerald-600 hover:bg-emerald-700">
              Yes, Mark Completed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Employee Profile Modal */}
      <EmployeeProfileModal
        employee={selectedEmp}
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
      />

      {/* Modals */}
      <CreateSupervisorModal open={supModalOpen} onOpenChange={setSupModalOpen} />
      <CreateSiteManagerModal open={mgrModalOpen} onOpenChange={setMgrModalOpen} />
      <CreateFieldWorkerModal open={wrkModalOpen} onOpenChange={setWrkModalOpen} />
      <CreateSiteModal open={siteModalOpen} onOpenChange={setSiteModalOpen} />
      <CreateTaskModal open={taskModalOpen} onOpenChange={setTaskModalOpen} />
      <SubmitReportModal open={reportModalOpen} onOpenChange={setReportModalOpen} />
    </PageContainer>
  );
}
