'use client';

import * as React from 'react';
import {
  Shield,
  KeyRound,
  Lock,
  Check,
  X,
  Search,
  SlidersHorizontal,
  UserCheck,
  Briefcase,
  HardHat,
  Activity,
  FileText,
  AlertTriangle,
  Clock,
  Sparkles,
  RotateCcw,
  Building2,
  MapPin,
  Sliders,
  Plus,
  Zap,
  Glasses,
  Users,
  Cpu,
  ShieldCheck,
  CheckSquare,
} from 'lucide-react';

import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusPill } from '@/components/ui/status-pill';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useMockStore } from '@/lib/mock-store';
import { cn } from '@/lib/utils';

// --- DATA STRUCTURES ---

interface RoleDefinition {
  id: string;
  name: string;
  code: string;
  level: number;
  badgeVariant: 'danger' | 'info' | 'warning' | 'neutral' | 'success';
  usersCount: number;
  description: string;
  scopeText: string;
}

interface PermissionModule {
  id: string;
  category: string;
  name: string;
  description: string;
  roles: Record<string, boolean>; // roleId -> true/false
}

interface DynamicPolicy {
  id: string;
  title: string;
  category: 'security' | 'geo' | 'time' | 'device';
  description: string;
  enabled: boolean;
  severity: 'high' | 'medium' | 'low';
  lastEvaluated: string;
}

interface AccessAuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  module: string;
  action: string;
  status: 'allowed' | 'blocked' | 'escalated';
  reason: string;
}

// Initial Mock Data
const initialRoles: RoleDefinition[] = [
  {
    id: 'super_admin',
    name: 'Super Admin',
    code: 'ADM-001',
    level: 4,
    badgeVariant: 'danger',
    usersCount: 2,
    description: 'Unrestricted master control over workspace configuration, roles, and audit security.',
    scopeText: 'Global (All Systems & Sites)',
  },
  {
    id: 'supervisor',
    name: 'Supervisor',
    code: 'SUP-001',
    level: 3,
    badgeVariant: 'info',
    usersCount: 5,
    description: 'Manages site safety managers, operational site logs, and safety compliance policies.',
    scopeText: 'Site Managers & Safety Records',
  },
  {
    id: 'site_manager',
    name: 'Site Manager',
    code: 'MGR-001',
    level: 2,
    badgeVariant: 'warning',
    usersCount: 12,
    description: 'Oversees field workers, assigns daily tasks, and manages smart glasses telematics.',
    scopeText: 'Assigned Field Workers & Tasks',
  },
  {
    id: 'field_worker',
    name: 'Field Worker',
    code: 'WRK-001',
    level: 1,
    badgeVariant: 'neutral',
    usersCount: 48,
    description: 'Receives real-time smart glass safety alerts and submits incident field updates.',
    scopeText: 'Personal Telematics & Incident Log',
  },
];

const initialModules: PermissionModule[] = [
  {
    id: 'mod_telematics',
    category: 'Computer Vision & AI',
    name: 'Live Vision Telematics',
    description: 'View real-time video stream & smart glasses HUD feeds',
    roles: { super_admin: true, supervisor: true, site_manager: true, field_worker: false },
  },
  {
    id: 'mod_incidents',
    category: 'Computer Vision & AI',
    name: 'Incident Alert Override',
    description: 'Acknowledge, mute, or escalate fall/ppe hazard alerts',
    roles: { super_admin: true, supervisor: true, site_manager: true, field_worker: false },
  },
  {
    id: 'mod_emp_search',
    category: 'Workforce Directory',
    name: 'Scoped Employee Search',
    description: 'Search personnel profiles based on role hierarchy boundaries',
    roles: { super_admin: true, supervisor: true, site_manager: true, field_worker: false },
  },
  {
    id: 'mod_emp_edit',
    category: 'Workforce Directory',
    name: 'Personnel Profile Editor',
    description: 'Create, update, or assign workers to active site shifts',
    roles: { super_admin: true, supervisor: true, site_manager: false, field_worker: false },
  },
  {
    id: 'mod_rbac_admin',
    category: 'Administration & Security',
    name: 'Role & RBAC Management',
    description: 'Configure access permissions, role scopes, and system guards',
    roles: { super_admin: true, supervisor: false, site_manager: false, field_worker: false },
  },
  {
    id: 'mod_sys_config',
    category: 'Administration & Security',
    name: 'System Global Configuration',
    description: 'Manage API integrations, telemetry thresholds, and audit rules',
    roles: { super_admin: true, supervisor: false, site_manager: false, field_worker: false },
  },
  {
    id: 'mod_audit_logs',
    category: 'Administration & Security',
    name: 'Security Audit Inspection',
    description: 'Inspect non-repudiable access logs and authentication triggers',
    roles: { super_admin: true, supervisor: false, site_manager: false, field_worker: false },
  },
  {
    id: 'mod_task_assign',
    category: 'Site Operations',
    name: 'Daily Task Dispatch',
    description: 'Create, schedule, and reassign hazard abatement checklists',
    roles: { super_admin: true, supervisor: true, site_manager: true, field_worker: false },
  },
];

const initialPolicies: DynamicPolicy[] = [
  {
    id: 'pol_1',
    title: 'Strict Supervisory Hierarchy Boundary',
    category: 'security',
    description: 'Enforces Supervisors access strictly to Site Managers and Site Managers to Field Workers.',
    enabled: true,
    severity: 'high',
    lastEvaluated: '2 mins ago',
  },
  {
    id: 'pol_2',
    title: 'Geo-Fenced Active Site Radius Lock',
    category: 'geo',
    description: 'Restricts sensitive telematics feed access to devices within 500m of site coordinates.',
    enabled: true,
    severity: 'high',
    lastEvaluated: '5 mins ago',
  },
  {
    id: 'pol_3',
    title: 'Shift Hours Access Window (06:00 - 20:00)',
    category: 'time',
    description: 'Restricts non-admin operational changes outside scheduled site operating shifts.',
    enabled: false,
    severity: 'medium',
    lastEvaluated: '12 mins ago',
  },
  {
    id: 'pol_4',
    title: 'Smart Glasses Biometric Binding Required',
    category: 'device',
    description: 'Mandates device hardware key pairing before granting live HUD telemetry access.',
    enabled: true,
    severity: 'medium',
    lastEvaluated: '1 min ago',
  },
];

const initialAuditLogs: AccessAuditLog[] = [
  {
    id: 'log_1',
    timestamp: '18:42:10',
    user: 'Sarah Jenkins (MGR-001)',
    role: 'Site Manager',
    module: 'Workforce Directory',
    action: 'Open Staff Profile (David Kim)',
    status: 'allowed',
    reason: 'Target is Field Worker (Scoped)',
  },
  {
    id: 'log_2',
    timestamp: '18:35:44',
    user: 'Robert Vance (SUP-001)',
    role: 'Supervisor',
    module: 'Administration',
    action: 'Access /permissions',
    status: 'blocked',
    reason: 'Role level insufficient (Level 3 < Level 4)',
  },
  {
    id: 'log_3',
    timestamp: '18:20:15',
    user: 'Elena Rostova (ADM-001)',
    role: 'Super Admin',
    module: 'Role Management',
    action: 'Updated Telematics Permission',
    status: 'allowed',
    reason: 'Super Admin credentials verified',
  },
  {
    id: 'log_4',
    timestamp: '17:58:02',
    user: 'Marcus Vance (WRK-001)',
    role: 'Field Worker',
    module: 'System Configuration',
    action: 'Modify API Keys',
    status: 'blocked',
    reason: '403 Forbidden Access Guard',
  },
];

const moduleIconMap: Record<string, React.ReactNode> = {
  mod_telematics: <Glasses className="h-4 w-4 text-primary" />,
  mod_incidents: <AlertTriangle className="h-4 w-4 text-amber-400" />,
  mod_emp_search: <Users className="h-4 w-4 text-blue-400" />,
  mod_emp_edit: <UserCheck className="h-4 w-4 text-indigo-400" />,
  mod_rbac_admin: <ShieldCheck className="h-4 w-4 text-rose-400" />,
  mod_sys_config: <Cpu className="h-4 w-4 text-purple-400" />,
  mod_audit_logs: <FileText className="h-4 w-4 text-emerald-400" />,
  mod_task_assign: <CheckSquare className="h-4 w-4 text-cyan-400" />,
};

export default function PermissionsPage() {
  const { activeRoleId } = useMockStore();

  // Page State
  const [roleList] = React.useState<RoleDefinition[]>(initialRoles);
  const [modules, setModules] = React.useState<PermissionModule[]>(initialModules);
  const [policies, setPolicies] = React.useState<DynamicPolicy[]>(initialPolicies);
  const [auditLogs, setAuditLogs] = React.useState<AccessAuditLog[]>(initialAuditLogs);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = React.useState<string | null>(null);

  // Access Restriction Guard (Only Super Admin - Role ID 1)
  if (activeRoleId !== 1) {
    return (
      <PageContainer
        title="Permissions Control Center"
        description="Manage roles, permissions, RBAC matrices, and access policies."
      >
        <Card className="border-destructive/30 bg-destructive/5 p-12 text-center shadow-xl max-w-xl mx-auto my-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4 ring-8 ring-destructive/5">
            <Lock className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-extrabold text-foreground mb-2">Access Restricted (403)</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The Governance &amp; Permissions Control Center is strictly locked to <strong className="text-foreground">Super Admin</strong> profile credentials.
          </p>
          <div className="mt-6 flex justify-center">
            <Badge variant="outline" className="border-destructive/30 text-destructive bg-destructive/10 px-3 py-1 font-mono text-xs">
              REQUIRED_ROLE: SUPER_ADMIN (LEVEL_4)
            </Badge>
          </div>
        </Card>
      </PageContainer>
    );
  }

  // Handle matrix permission toggle
  const handleTogglePermission = (moduleId: string, roleId: string) => {
    if (roleId === 'super_admin') {
      toast.warning('Action Blocked', {
        description: 'Super Admin permissions are locked to full system access.',
      });
      return;
    }

    setModules((prev) =>
      prev.map((mod) => {
        if (mod.id === moduleId) {
          const current = mod.roles[roleId];
          const updated = !current;
          const roleObj = roleList.find((r) => r.id === roleId);

          toast.success('RBAC Matrix Updated', {
            description: `${mod.name} set to ${updated ? 'ALLOWED' : 'DENIED'} for ${roleObj?.name}.`,
          });

          // Log Audit Trigger
          const newLog: AccessAuditLog = {
            id: `log_${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            user: 'Elena Rostova (ADM-001)',
            role: 'Super Admin',
            module: mod.name,
            action: `Set ${roleObj?.name} access to ${updated ? 'ON' : 'OFF'}`,
            status: 'allowed',
            reason: 'Live Matrix Matrix Override',
          };
          setAuditLogs((prevLogs) => [newLog, ...prevLogs]);

          return {
            ...mod,
            roles: {
              ...mod.roles,
              [roleId]: updated,
            },
          };
        }
        return mod;
      })
    );
  };

  // Handle policy toggle
  const handleTogglePolicy = (policyId: string) => {
    setPolicies((prev) =>
      prev.map((pol) => {
        if (pol.id === policyId) {
          const next = !pol.enabled;
          toast.success('Access Policy Updated', {
            description: `${pol.title} is now ${next ? 'Active & Enforced' : 'Disabled'}.`,
          });
          return { ...pol, enabled: next, lastEvaluated: 'Just now' };
        }
        return pol;
      })
    );
  };

  // Reset matrix to default
  const handleResetMatrix = () => {
    setModules(initialModules);
    toast.info('RBAC Matrix Reset', {
      description: 'Permissions matrix restored to default enterprise baseline.',
    });
  };

  // Filter modules by initial starting text/letters of title permission (e.g. "R" -> "Role & RBAC Management")
  const filteredModules = modules.filter((mod) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return mod.name.toLowerCase().startsWith(query);
  });

  return (
    <PageContainer
      title="Governance & Permissions Matrix"
      description="Real-time Role-Based Access Control (RBAC), security boundaries, and enforcement policies."
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleResetMatrix} className="gap-1.5 text-xs">
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Baseline
          </Button>
          <Button size="sm" onClick={() => toast.success('Policy Exported', { description: 'RBAC policy manifest downloaded as JSON.' })} className="gap-1.5 text-xs">
            <Zap className="h-3.5 w-3.5" />
            Export Manifest
          </Button>
        </div>
      }
    >
      <Tabs defaultValue="matrix" className="space-y-6">
        <TabsList className="h-auto flex-wrap gap-1 bg-secondary/50 p-1">
          <TabsTrigger value="matrix" className="gap-1.5 text-xs font-semibold">
            <Shield className="h-3.5 w-3.5 text-primary" />
            Interactive RBAC Matrix
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-1.5 text-xs font-semibold">
            <UserCheck className="h-3.5 w-3.5 text-blue-400" />
            Role Hierarchy &amp; Scopes
          </TabsTrigger>
          <TabsTrigger value="policies" className="gap-1.5 text-xs font-semibold">
            <Lock className="h-3.5 w-3.5 text-amber-400" />
            Security Guard Policies
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-1.5 text-xs font-semibold">
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
            Live Access Audit Log
          </TabsTrigger>
        </TabsList>

        {/* ------------------------------------------------------------------- */}
        {/* TAB 1: INTERACTIVE RBAC MATRIX                                      */}
        {/* ------------------------------------------------------------------- */}
        <TabsContent value="matrix" className="space-y-6">
          {/* Role Filter & Matrix Header Bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by initial letter of title (e.g. 'R' or 'Live')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Role Filter:</span>
              <Button
                variant={selectedRoleFilter === null ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedRoleFilter(null)}
                className="text-xs h-7 px-2.5"
              >
                All Roles
              </Button>
              {roleList.map((r) => (
                <Button
                  key={r.id}
                  variant={selectedRoleFilter === r.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedRoleFilter(selectedRoleFilter === r.id ? null : r.id)}
                  className="text-xs h-7 px-2.5 gap-1"
                >
                  {r.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Matrix Card */}
          <Card className="border-border shadow-none overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin">
              <Table>
                <TableHeader>
                  <TableRow className="border-border bg-secondary/40 hover:bg-secondary/40">
                    <TableHead className="h-12 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground min-w-[340px] w-[360px]">
                      Capability Module
                    </TableHead>
                    {roleList.map((role) => {
                      const isFiltered = selectedRoleFilter && selectedRoleFilter !== role.id;
                      return (
                        <TableHead
                          key={role.id}
                          className={cn(
                            'h-12 px-4 text-center text-xs font-bold tracking-tight transition-opacity',
                            isFiltered ? 'opacity-30' : 'opacity-100'
                          )}
                        >
                          <div className="flex flex-col items-center justify-center gap-0.5">
                            <span className="text-foreground font-extrabold">{role.name}</span>
                            <span className="font-mono text-[10px] text-muted-foreground">{role.code}</span>
                          </div>
                        </TableHead>
                      );
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredModules.map((mod) => (
                    <TableRow key={mod.id} className="border-border hover:bg-secondary/20 transition-colors">
                      <TableCell className="px-4 py-3.5 min-w-[340px]">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/80 border border-border mt-0.5 shadow-xs">
                            {moduleIconMap[mod.id] || <Shield className="h-4 w-4 text-primary" />}
                          </div>
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-sm text-foreground tracking-tight">{mod.name}</span>
                              <Badge variant="secondary" className="text-[10px] font-mono px-2 py-0.5 bg-secondary text-muted-foreground border border-border">
                                {mod.category}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground leading-normal">{mod.description}</p>
                          </div>
                        </div>
                      </TableCell>

                      {roleList.map((role) => {
                        const isAllowed = mod.roles[role.id] ?? false;
                        const isFiltered = selectedRoleFilter && selectedRoleFilter !== role.id;
                        const isSuperAdmin = role.id === 'super_admin';

                        return (
                          <TableCell
                            key={role.id}
                            className={cn(
                              'px-4 py-3.5 text-center transition-opacity',
                              isFiltered ? 'opacity-30' : 'opacity-100'
                            )}
                          >
                            <button
                              type="button"
                              onClick={() => handleTogglePermission(mod.id, role.id)}
                              disabled={isSuperAdmin}
                              className={cn(
                                'inline-flex items-center justify-center h-8 w-8 rounded-lg border transition-all duration-200',
                                isAllowed
                                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 shadow-sm'
                                  : 'border-border bg-secondary/50 text-muted-foreground/60 hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive',
                                isSuperAdmin && 'cursor-not-allowed opacity-80'
                              )}
                              title={
                                isSuperAdmin
                                  ? 'Super Admin permissions cannot be modified.'
                                  : `Click to ${isAllowed ? 'deny' : 'grant'} permission.`
                              }
                            >
                              {isAllowed ? <Check className="h-4 w-4 stroke-[3]" /> : <X className="h-3.5 w-3.5 stroke-[2.5]" />}
                            </button>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* ------------------------------------------------------------------- */}
        {/* TAB 2: ROLE HIERARCHY & SCOPES                                      */}
        {/* ------------------------------------------------------------------- */}
        <TabsContent value="roles" className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {roleList.map((r) => {
              const activePermsCount = modules.filter((m) => m.roles[r.id]).length;
              return (
                <Card key={r.id} className="border-border shadow-none hover:border-primary/40 transition-colors">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <StatusPill variant={r.badgeVariant} size="sm" dot={false}>
                        {r.name}
                      </StatusPill>
                      <span className="text-xs font-mono font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded border border-border">
                        Level {r.level}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">{r.description}</p>

                    <Separator />

                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Active Users:</span>
                        <span className="font-bold text-foreground">{r.usersCount} Assigned</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Capabilities:</span>
                        <span className="font-bold text-primary">{activePermsCount} / {modules.length} Enabled</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Enforcement Scope:</span>
                        <span className="font-semibold text-foreground truncate max-w-[140px]">{r.scopeText}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* ------------------------------------------------------------------- */}
        {/* TAB 3: SECURITY GUARD POLICIES                                     */}
        {/* ------------------------------------------------------------------- */}
        <TabsContent value="policies" className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {policies.map((pol) => (
              <Card key={pol.id} className="border-border shadow-none">
                <CardContent className="p-4 flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-foreground">{pol.title}</h4>
                      <StatusPill variant={pol.enabled ? 'success' : 'neutral'} size="sm" dot={false}>
                        {pol.enabled ? 'Active' : 'Disabled'}
                      </StatusPill>
                    </div>
                    <p className="text-xs text-muted-foreground">{pol.description}</p>
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-muted-foreground/80 font-mono">
                      <span>Category: {pol.category.toUpperCase()}</span>
                      <span>•</span>
                      <span>Evaluated: {pol.lastEvaluated}</span>
                    </div>
                  </div>
                  <Switch checked={pol.enabled} onCheckedChange={() => handleTogglePolicy(pol.id)} />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ------------------------------------------------------------------- */}
        {/* TAB 4: LIVE ACCESS AUDIT LOG                                        */}
        {/* ------------------------------------------------------------------- */}
        <TabsContent value="audit" className="space-y-4">
          <Card className="border-border shadow-none">
            <div className="overflow-x-auto scrollbar-thin">
              <Table>
                <TableHeader>
                  <TableRow className="border-border bg-secondary/40 hover:bg-secondary/40">
                    <TableHead className="h-11 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Time</TableHead>
                    <TableHead className="h-11 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">User &amp; Role</TableHead>
                    <TableHead className="h-11 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Capability / Action</TableHead>
                    <TableHead className="h-11 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Decision</TableHead>
                    <TableHead className="h-11 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Evaluated Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id} className="border-border">
                      <TableCell className="px-4 py-3 font-mono text-xs text-muted-foreground">{log.timestamp}</TableCell>
                      <TableCell className="px-4 py-3 text-xs">
                        <span className="font-semibold text-foreground">{log.user}</span>
                        <span className="ml-1.5 text-muted-foreground">({log.role})</span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-xs">
                        <span className="font-medium text-foreground">{log.module}</span>
                        <span className="block text-[11px] text-muted-foreground">{log.action}</span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <StatusPill
                          variant={log.status === 'allowed' ? 'success' : log.status === 'blocked' ? 'danger' : 'warning'}
                          size="sm"
                          dot={false}
                        >
                          {log.status.toUpperCase()}
                        </StatusPill>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-xs text-muted-foreground">{log.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
