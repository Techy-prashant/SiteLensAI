export interface AuditLogEntry {
  id: string;
  user: string;
  action: string;
  resource: string;
  timestamp: string;
  ip: string;
  status: 'success' | 'failed';
}

export const auditLogs: AuditLogEntry[] = [
  { id: 'al-1', user: 'Alex Mercer', action: 'Updated role permissions', resource: 'Role: Manager', timestamp: 'Aug 2, 10:32 AM', ip: '192.168.1.24', status: 'success' },
  { id: 'al-2', user: 'Dana Patel', action: 'Registered new device', resource: 'Device: MG-008', timestamp: 'Aug 2, 09:15 AM', ip: '192.168.1.40', status: 'success' },
  { id: 'al-3', user: 'Unknown', action: 'Failed login attempt', resource: 'Account: admin@sitelens.ai', timestamp: 'Aug 2, 08:50 AM', ip: '203.0.113.55', status: 'failed' },
  { id: 'al-4', user: 'Alex Mercer', action: 'Exported employee roster', resource: 'Employees (CSV)', timestamp: 'Aug 1, 05:22 PM', ip: '192.168.1.24', status: 'success' },
  { id: 'al-5', user: 'Dana Patel', action: 'Assigned smart glasses', resource: 'MG-005 → S. Okoro', timestamp: 'Aug 1, 03:10 PM', ip: '192.168.1.40', status: 'success' },
  { id: 'al-6', user: 'Alex Mercer', action: 'Changed notification settings', resource: 'System Notifications', timestamp: 'Aug 1, 01:45 PM', ip: '192.168.1.24', status: 'success' },
  { id: 'al-7', user: 'Unknown', action: 'Failed login attempt', resource: 'Account: manager@sitelens.ai', timestamp: 'Aug 1, 11:20 AM', ip: '198.51.100.12', status: 'failed' },
  { id: 'al-8', user: 'Dana Patel', action: 'Approved inspection report', resource: 'IR-2404', timestamp: 'Aug 1, 09:30 AM', ip: '192.168.1.40', status: 'success' },
];

export interface RoleEntry {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: number;
  color: 'neutral' | 'info' | 'warning' | 'success' | 'danger';
}

export const roles: RoleEntry[] = [
  { id: 'r1', name: 'Super Admin', description: 'Full platform access including system configuration', userCount: 1, permissions: 48, color: 'danger' },
  { id: 'r2', name: 'Site Manager', description: 'Manage sites, devices, and employees within assigned sites', userCount: 4, permissions: 32, color: 'info' },
  { id: 'r3', name: 'Supervisor', description: 'Oversee workers and inspections, approve reports', userCount: 6, permissions: 20, color: 'warning' },
  { id: 'r4', name: 'Worker', description: 'Use smart glasses, complete assigned tasks and inspections', userCount: 136, permissions: 8, color: 'neutral' },
];

export interface PermissionEntry {
  id: string;
  module: string;
  action: string;
  roles: string[];
}

export const permissions: PermissionEntry[] = [
  { id: 'p1', module: 'Dashboard', action: 'View dashboard', roles: ['Super Admin', 'Site Manager', 'Supervisor', 'Worker'] },
  { id: 'p2', module: 'Dashboard', action: 'Export reports', roles: ['Super Admin', 'Site Manager', 'Supervisor'] },
  { id: 'p3', module: 'Devices', action: 'View devices', roles: ['Super Admin', 'Site Manager', 'Supervisor'] },
  { id: 'p4', module: 'Devices', action: 'Register device', roles: ['Super Admin', 'Site Manager'] },
  { id: 'p5', module: 'Devices', action: 'Revoke device', roles: ['Super Admin'] },
  { id: 'p6', module: 'Employees', action: 'View employees', roles: ['Super Admin', 'Site Manager', 'Supervisor'] },
  { id: 'p7', module: 'Employees', action: 'Add employee', roles: ['Super Admin', 'Site Manager'] },
  { id: 'p8', module: 'Employees', action: 'Delete employee', roles: ['Super Admin'] },
  { id: 'p9', module: 'Incidents', action: 'View incident reports', roles: ['Super Admin', 'Site Manager', 'Supervisor', 'Worker'] },
  { id: 'p10', module: 'Incidents', action: 'Resolve incident', roles: ['Super Admin', 'Site Manager'] },
  { id: 'p11', module: 'Settings', action: 'Manage system settings', roles: ['Super Admin'] },
  { id: 'p12', module: 'Settings', action: 'Manage roles', roles: ['Super Admin'] },
];

export interface DepartmentEntry {
  id: string;
  name: string;
  head: string;
  employeeCount: number;
  site: string;
}

export const departments: DepartmentEntry[] = [
  { id: 'd1', name: 'Safety', head: 'M. Rivera', employeeCount: 34, site: 'Site A' },
  { id: 'd2', name: 'Operations', head: 'L. Chen', employeeCount: 52, site: 'Site B' },
  { id: 'd3', name: 'Construction', head: 'K. Vance', employeeCount: 48, site: 'Site B' },
  { id: 'd4', name: 'Electrical', head: 'N. Aldrich', employeeCount: 13, site: 'Site A' },
];

export interface SiteEntry {
  id: string;
  name: string;
  location: string;
  manager: string;
  devices: number;
  workers: number;
  status: 'active' | 'maintenance' | 'offline';
}

export const sites: SiteEntry[] = [
  { id: 's1', name: 'Site A — Tower 3', location: 'Downtown, Block 12', manager: 'M. Rivera', devices: 8, workers: 52, status: 'active' },
  { id: 's2', name: 'Site B — Sub-level 2', location: 'Harbor District', manager: 'L. Chen', devices: 10, workers: 48, status: 'active' },
  { id: 's3', name: 'Site C — Perimeter', location: 'North Industrial Zone', manager: 'D. Patel', devices: 6, workers: 34, status: 'maintenance' },
  { id: 's4', name: 'Site C — Tunnel', location: 'North Industrial Zone', manager: 'J. Hayes', devices: 4, workers: 13, status: 'active' },
];

export interface AccessPolicy {
  id: string;
  name: string;
  description: string;
  scope: string;
  enabled: boolean;
}

export const accessPolicies: AccessPolicy[] = [
  { id: 'ap1', name: 'Site-Restricted Access', description: 'Users can only access resources within their assigned site', scope: 'All Sites', enabled: true },
  { id: 'ap2', name: 'Device Assignment Required', description: 'Smart glasses data requires an active device assignment', scope: 'Devices', enabled: true },
  { id: 'ap3', name: 'Manager Approval for Reports', description: 'Incident reports require manager approval before resolution', scope: 'Incidents', enabled: true },
  { id: 'ap4', name: 'Off-Hours Read-Only', description: 'Workers have read-only access outside scheduled shifts', scope: 'All Modules', enabled: false },
  { id: 'ap5', name: 'MFA for Admin Actions', description: 'Multi-factor authentication required for admin-level operations', scope: 'Administration', enabled: true },
];

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  severity: 'info' | 'warning' | 'critical';
  category: 'emergency' | 'battery' | 'employee' | 'device' | 'report' | 'inspection';
}

export const notifications: NotificationItem[] = [
  { id: 'n1', title: 'Emergency: Worker without helmet', description: 'Zone B — employee detected without hard hat', timestamp: '2 min ago', read: false, severity: 'critical', category: 'emergency' },
  { id: 'n2', title: 'Battery Warning', description: 'Device MG-006 at 12% battery', timestamp: '8 min ago', read: false, severity: 'warning', category: 'battery' },
  { id: 'n3', title: 'New Employee Onboarded', description: 'Oscar Fernandez added to Safety department', timestamp: '25 min ago', read: false, severity: 'info', category: 'employee' },
  { id: 'n4', title: 'Device Offline', description: 'MG-004 lost connection at Site C', timestamp: '45 min ago', read: false, severity: 'warning', category: 'device' },
  { id: 'n5', title: 'Report Approved', description: 'Daily safety summary approved by L. Chen', timestamp: '1 hr ago', read: true, severity: 'info', category: 'report' },
  { id: 'n6', title: 'Inspection Completed', description: 'PPE compliance check — 12 workers, Zone A', timestamp: '2 hr ago', read: true, severity: 'info', category: 'inspection' },
  { id: 'n7', title: 'Fall Detection Triggered', description: 'Site A — Scaffold 5, auto-alert sent', timestamp: '3 hr ago', read: true, severity: 'critical', category: 'emergency' },
];

export interface CommandItem {
  id: string;
  label: string;
  category: string;
  icon: string;
  shortcut?: string;
  href?: string;
  action?: string;
}

export const commandItems: CommandItem[] = [
  { id: 'c1', label: 'Dashboard', category: 'Pages', icon: 'LayoutDashboard', href: '/dashboard' },
  { id: 'c2', label: 'Meta Glasses', category: 'Pages', icon: 'Glasses', href: '/meta-glasses' },
  { id: 'c3', label: 'Employees', category: 'Pages', icon: 'Users', href: '/employees' },
  { id: 'c4', label: 'Analytics', category: 'Pages', icon: 'BarChart3', href: '/analytics' },
  { id: 'c5', label: 'Settings', category: 'Pages', icon: 'Settings', href: '/settings' },
  { id: 'c6', label: 'Permissions', category: 'Pages', icon: 'KeyRound', href: '/permissions' },
  { id: 'c7', label: 'Role Management', category: 'Pages', icon: 'ShieldHalf', href: '/role-management' },
  { id: 'c8', label: 'System Configuration', category: 'Pages', icon: 'SlidersHorizontal', href: '/system-configuration' },
  { id: 'c9', label: 'Marcus Rivera', category: 'Employees', icon: 'User', href: '/employees' },
  { id: 'c10', label: 'Linda Chen', category: 'Employees', icon: 'User', href: '/employees' },
  { id: 'c11', label: 'Dana Patel', category: 'Employees', icon: 'User', href: '/employees' },
  { id: 'c12', label: 'MG-001 — Meta Glasses Pro', category: 'Devices', icon: 'Glasses', href: '/meta-glasses' },
  { id: 'c13', label: 'MG-002 — Meta Glasses Pro', category: 'Devices', icon: 'Glasses', href: '/meta-glasses' },
  { id: 'c14', label: 'MG-003 — Meta Glasses Air', category: 'Devices', icon: 'Glasses', href: '/meta-glasses' },
  { id: 'c15', label: 'Daily Safety Report', category: 'Reports', icon: 'FileText', href: '/analytics' },
  { id: 'c16', label: 'Incident Summary — August', category: 'Reports', icon: 'FileText', href: '/analytics' },
  { id: 'c17', label: 'PPE Compliance Report', category: 'Reports', icon: 'FileText', href: '/analytics' },
  { id: 'c18', label: 'IR-2401 — Helmet Violation', category: 'Incident Logs', icon: 'AlertTriangle', href: '/dashboard' },
  { id: 'c19', label: 'IR-2402 — Restricted Zone', category: 'Incident Logs', icon: 'AlertTriangle', href: '/dashboard' },
  { id: 'c20', label: 'IR-2403 — Fall Detection', category: 'Incident Logs', icon: 'AlertTriangle', href: '/dashboard' },
  { id: 'c21', label: 'Toggle Theme', category: 'Commands', icon: 'Moon', action: 'toggle-theme' },
  { id: 'c22', label: 'Toggle Sidebar', category: 'Commands', icon: 'PanelLeft', action: 'toggle-sidebar', shortcut: 'Ctrl+B' },
  { id: 'c23', label: 'Add Employee', category: 'Quick Actions', icon: 'UserPlus', href: '/employees' },
  { id: 'c24', label: 'Register Device', category: 'Quick Actions', icon: 'Plus', href: '/meta-glasses' },
  { id: 'c25', label: 'Generate Report', category: 'Quick Actions', icon: 'FileText', href: '/analytics' },
  { id: 'c26', label: 'Emergency Broadcast', category: 'Quick Actions', icon: 'Radio', href: '/dashboard' },
];

export const recentSearches = [
  'Marcus Rivera',
  'MG-001',
  'Site A incidents',
  'PPE compliance',
];

export const popularCommands = [
  { label: 'Go to Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'View Devices', href: '/meta-glasses', icon: 'Glasses' },
  { label: 'Manage Employees', href: '/employees', icon: 'Users' },
  { label: 'View Analytics', href: '/analytics', icon: 'BarChart3' },
];

export const pinnedActions = [
  { label: 'Add Employee', href: '/employees', icon: 'UserPlus' },
  { label: 'Register Device', href: '/meta-glasses', icon: 'Plus' },
  { label: 'Emergency Broadcast', href: '/dashboard', icon: 'Radio' },
];
