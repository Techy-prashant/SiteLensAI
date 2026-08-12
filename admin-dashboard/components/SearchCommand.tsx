'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import {
  Search,
  UserCheck,
  PlusCircle,
  Shield,
  FileText,
  Glasses,
  Building,
  CheckSquare,
  Sparkles,
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  KeyRound,
  ShieldHalf,
  SlidersHorizontal,
  Moon,
  Sun,
  AlertTriangle,
  Radio,
  FileSpreadsheet,
  Lock,
} from 'lucide-react';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command';
import { useMockStore } from '@/lib/mock-store';
import { useUIStore } from '@/lib/stores/ui-store';
import { EmployeeRecord } from '@/lib/types';
import { EmployeeProfileModal } from '@/components/EmployeeProfileModal';
import { CreateSupervisorModal } from '@/components/forms/create-supervisor-modal';
import { CreateSiteManagerModal } from '@/components/forms/create-site-manager-modal';
import { CreateFieldWorkerModal } from '@/components/forms/create-field-worker-modal';
import { CreateSiteModal } from '@/components/forms/create-site-modal';
import { CreateTaskModal } from '@/components/forms/create-task-modal';
import { SubmitReportModal } from '@/components/forms/submit-report-modal';

export function SearchCommand() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [selectedEmp, setSelectedEmp] = React.useState<EmployeeRecord | null>(null);
  const [profileModalOpen, setProfileModalOpen] = React.useState(false);

  // Modals
  const [supervisorModalOpen, setSupervisorModalOpen] = React.useState(false);
  const [siteManagerModalOpen, setSiteManagerModalOpen] = React.useState(false);
  const [fieldWorkerModalOpen, setFieldWorkerModalOpen] = React.useState(false);
  const [siteModalOpen, setSiteModalOpen] = React.useState(false);
  const [taskModalOpen, setTaskModalOpen] = React.useState(false);
  const [reportModalOpen, setReportModalOpen] = React.useState(false);

  const {
    activeRoleId,
    admins,
    supervisors,
    siteManagers,
    fieldWorkers,
    glasses,
    reports,
  } = useMockStore();

  // Listen for single Ctrl+K / Cmd+K shortcut
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Scoped employee records based on RBAC hierarchy:
  // - Super Admin (1): Access to all employee records
  // - Supervisor (2): Access to Site Managers only (nothing else)
  // - Site Manager (3): Access to Field Workers only (nothing else)
  // - Field Worker (4): None
  const accessibleEmployees: EmployeeRecord[] = React.useMemo(() => {
    if (activeRoleId === 1) {
      return [
        ...admins.map((a) => ({ type: 'Admin' as const, ...a })),
        ...supervisors.map((s) => ({ type: 'Supervisor' as const, ...s })),
        ...siteManagers.map((m) => ({ type: 'Site Manager' as const, ...m })),
        ...fieldWorkers.map((w) => ({ type: 'Field Worker' as const, ...w })),
      ];
    }
    if (activeRoleId === 2) {
      return siteManagers.map((m) => ({ type: 'Site Manager' as const, ...m }));
    }
    if (activeRoleId === 3) {
      return fieldWorkers.map((w) => ({ type: 'Field Worker' as const, ...w }));
    }
    return [];
  }, [activeRoleId, admins, supervisors, siteManagers, fieldWorkers]);

  // Requirement: Show employee results ONLY when query contains '@'
  const isMentionSearch = searchValue.includes('@');

  const handleSelectEmployee = (emp: EmployeeRecord) => {
    setOpen(false);
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

  const handleNavigatePage = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const handleSelectFeature = (actionKey: string) => {
    setOpen(false);
    if (actionKey === 'create_supervisor') setSupervisorModalOpen(true);
    if (actionKey === 'create_site_manager') setSiteManagerModalOpen(true);
    if (actionKey === 'create_field_worker') setFieldWorkerModalOpen(true);
    if (actionKey === 'create_site') setSiteModalOpen(true);
    if (actionKey === 'create_task') setTaskModalOpen(true);
    if (actionKey === 'submit_report') setReportModalOpen(true);
  };

  const handleToggleTheme = () => {
    setOpen(false);
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    toast.success(`Theme switched to ${newTheme.toUpperCase()} mode.`);
  };

  return (
    <>
      {/* Floating Search Bar */}
      <button
        onClick={() => setOpen(true)}
        className="relative flex w-full max-w-xl items-center gap-2.5 rounded-full border border-border/80 bg-gradient-to-r from-secondary/60 to-secondary/30 px-4 py-2 text-sm text-muted-foreground shadow-sm transition-all hover:border-primary/50 hover:bg-secondary/80 focus:outline-none"
      >
        <Sparkles className="h-4 w-4 text-primary animate-pulse" />
        <span className="flex-1 text-left font-medium truncate">
          Search commands, pages, devices or type <code className="text-xs text-primary font-mono font-bold">@name</code>...
        </span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-2 font-mono text-[10px] font-semibold text-muted-foreground sm:flex">
          ⌘K
        </kbd>
      </button>

      {/* Single Unified Command Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search commands, pages, devices, reports or type @employee..."
          value={searchValue}
          onValueChange={setSearchValue}
        />
        <CommandList className="max-h-[420px] scrollbar-thin">
          <CommandEmpty>No matching commands, pages, or @mention employees found.</CommandEmpty>

          {/* If search query contains '@', strictly show ONLY Employee Directory */}
          {isMentionSearch ? (
            <CommandGroup heading="Employee Directory (@mention Lookup)">
              {accessibleEmployees.map((emp) => (
                <CommandItem
                  key={`mention-${emp.type}-${emp.Emp_id}`}
                  value={`@${emp.Emp_id} @${emp.Name} ${emp.type}`}
                  onSelect={() => handleSelectEmployee(emp)}
                  className="flex items-center justify-between py-2 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {emp.Name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">{emp.Name}</span>
                      <span className="ml-2 font-mono text-xs text-muted-foreground">({emp.Emp_id})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeRoleId !== 1 && <Lock className="h-3 w-3 text-amber-500/80" />}
                    <span className="text-xs rounded-md bg-secondary px-2 py-0.5 font-medium text-muted-foreground">
                      {emp.type}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : (
            <>
              {/* SECTION B: Feature & Action Commands */}
              <CommandGroup heading="⚡ Feature & Action Commands">
                <CommandItem value="Create Construction Site Location" onSelect={() => handleSelectFeature('create_site')}>
                  <Building className="mr-2 h-4 w-4 text-amber-500" />
                  <span>Create Construction Site</span>
                </CommandItem>

                <CommandItem value="Assign New Task Work Order" onSelect={() => handleSelectFeature('create_task')}>
                  <CheckSquare className="mr-2 h-4 w-4 text-purple-500" />
                  <span>Assign New Task</span>
                </CommandItem>

                <CommandItem value="Create Supervisor Role 2" onSelect={() => handleSelectFeature('create_supervisor')}>
                  <PlusCircle className="mr-2 h-4 w-4 text-blue-500" />
                  <span>Create Supervisor (Role 2)</span>
                </CommandItem>

                <CommandItem value="Create Site Manager Role 3" onSelect={() => handleSelectFeature('create_site_manager')}>
                  <UserCheck className="mr-2 h-4 w-4 text-indigo-500" />
                  <span>Create Site Manager (Role 3)</span>
                </CommandItem>

                <CommandItem value="Create Field Worker Role 4" onSelect={() => handleSelectFeature('create_field_worker')}>
                  <Shield className="mr-2 h-4 w-4 text-emerald-500" />
                  <span>Create Field Worker (Role 4)</span>
                </CommandItem>

                <CommandItem value="Submit End of Day Report AI" onSelect={() => handleSelectFeature('submit_report')}>
                  <FileText className="mr-2 h-4 w-4 text-rose-500" />
                  <span>Submit End-of-Day Report</span>
                </CommandItem>
              </CommandGroup>

              <CommandSeparator />

              {/* SECTION C: Select Pages */}
              <CommandGroup heading="📍 Select Pages & Navigation">
                <CommandItem value="Dashboard Overview Site Safety" onSelect={() => handleNavigatePage('/dashboard')}>
                  <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
                  <span>Dashboard</span>
                </CommandItem>
                <CommandItem value="Meta Glasses Smart Glasses Fleet" onSelect={() => handleNavigatePage('/meta-glasses')}>
                  <Glasses className="mr-2 h-4 w-4 text-emerald-500" />
                  <span>Meta Glasses</span>
                </CommandItem>
                <CommandItem value="Employees Workforce Directory" onSelect={() => handleNavigatePage('/employees')}>
                  <Users className="mr-2 h-4 w-4 text-blue-500" />
                  <span>Employees</span>
                </CommandItem>
                <CommandItem value="Analytics Safety Metrics" onSelect={() => handleNavigatePage('/analytics')}>
                  <BarChart3 className="mr-2 h-4 w-4 text-purple-500" />
                  <span>Analytics</span>
                </CommandItem>
                <CommandItem value="Settings Workspace Configuration" onSelect={() => handleNavigatePage('/settings')}>
                  <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Settings</span>
                </CommandItem>
                {activeRoleId === 1 && (
                  <>
                    <CommandItem value="Permissions Policy Access Rights" onSelect={() => handleNavigatePage('/permissions')}>
                      <KeyRound className="mr-2 h-4 w-4 text-amber-500" />
                      <span>Permissions</span>
                    </CommandItem>
                    <CommandItem value="System Configuration System Settings" onSelect={() => handleNavigatePage('/system-configuration')}>
                      <SlidersHorizontal className="mr-2 h-4 w-4 text-sky-500" />
                      <span>System Configuration</span>
                    </CommandItem>
                    <CommandItem value="Role Management User Roles Authority" onSelect={() => handleNavigatePage('/role-management')}>
                      <ShieldHalf className="mr-2 h-4 w-4 text-indigo-500" />
                      <span>Role Management</span>
                    </CommandItem>
                  </>
                )}
              </CommandGroup>

              <CommandSeparator />

              {/* SECTION D: Connected Devices & Hardware Telematics */}
              <CommandGroup heading="🥽 Connected Devices & Hardware">
                {glasses.map((g) => (
                  <CommandItem
                    key={g.Glasses_id}
                    value={`Device ${g.Glasses_id} Smart Glasses Site ${g.Site_id}`}
                    onSelect={() => handleNavigatePage('/meta-glasses')}
                  >
                    <Glasses className="mr-2 h-4 w-4 text-emerald-500" />
                    <span>{g.Glasses_id} (Smart Glasses - Site {g.Site_id})</span>
                    <span className="ml-auto text-xs font-mono text-muted-foreground">
                      {g.Logout_dt === null ? 'ACTIVE LIVE' : 'OFFLINE'}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>

              <CommandSeparator />

              {/* SECTION E: Reports & Incident Logs */}
              <CommandGroup heading="📄 Reports & Incident Logs">
                {reports.map((r) => (
                  <CommandItem
                    key={r.Report_id}
                    value={`Report ${r.Report_id} ${r.Summary} ${r.site_id}`}
                    onSelect={() => handleNavigatePage('/analytics')}
                  >
                    <FileSpreadsheet className="mr-2 h-4 w-4 text-blue-400" />
                    <span className="truncate max-w-sm">{r.Report_id}: {r.Summary}</span>
                  </CommandItem>
                ))}
                <CommandItem value="Incident Log Scaffolding Hazard Tie Down" onSelect={() => handleNavigatePage('/analytics')}>
                  <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                  <span>Hazard Warning Log: Scaffolding Anchor Torque</span>
                </CommandItem>
              </CommandGroup>

              <CommandSeparator />

              {/* SECTION F: Commands & Theme Toggle Switcher */}
              <CommandGroup heading="⚙️ Commands & Controls">
                <CommandItem value="Toggle Theme Switch Light Dark Mode" onSelect={handleToggleTheme}>
                  {theme === 'dark' ? <Sun className="mr-2 h-4 w-4 text-amber-400" /> : <Moon className="mr-2 h-4 w-4 text-indigo-400" />}
                  <span>Toggle Theme (Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode)</span>
                </CommandItem>
                <CommandItem value="Toggle Sidebar Collapse Left Menu" onSelect={() => { setOpen(false); toggleSidebar(); }}>
                  <Radio className="mr-2 h-4 w-4 text-sky-500" />
                  <span>Toggle Sidebar Menu</span>
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>

      {/* Employee Profile Modal (Accessible to Super Admin ONLY) */}
      <EmployeeProfileModal
        employee={selectedEmp}
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
      />

      {/* Action Modals */}
      <CreateSupervisorModal open={supervisorModalOpen} onOpenChange={setSupervisorModalOpen} />
      <CreateSiteManagerModal open={siteManagerModalOpen} onOpenChange={setSiteManagerModalOpen} />
      <CreateFieldWorkerModal open={fieldWorkerModalOpen} onOpenChange={setFieldWorkerModalOpen} />
      <CreateSiteModal open={siteModalOpen} onOpenChange={setSiteModalOpen} />
      <CreateTaskModal open={taskModalOpen} onOpenChange={setTaskModalOpen} />
      <SubmitReportModal open={reportModalOpen} onOpenChange={setReportModalOpen} />
    </>
  );
}
