export type AlertSeverity = 'critical' | 'high' | 'medium';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';

export interface EmergencyAlert {
  id: string;
  title: string;
  site: string;
  timestamp: string;
  severity: AlertSeverity;
  status: AlertStatus;
}

export const emergencyAlerts: EmergencyAlert[] = [
  {
    id: 'ea-1',
    title: 'Worker detected without helmet',
    site: 'Site A — Tower 3',
    timestamp: '2 min ago',
    severity: 'critical',
    status: 'active',
  },
  {
    id: 'ea-2',
    title: 'Restricted zone entered',
    site: 'Site B — Sub-level 2',
    timestamp: '7 min ago',
    severity: 'critical',
    status: 'active',
  },
  {
    id: 'ea-3',
    title: 'Fall detection triggered',
    site: 'Site A — Scaffold 5',
    timestamp: '14 min ago',
    severity: 'high',
    status: 'acknowledged',
  },
  {
    id: 'ea-4',
    title: 'Device battery critically low',
    site: 'Site C — Perimeter',
    timestamp: '22 min ago',
    severity: 'medium',
    status: 'active',
  },
];

export interface KPICard {
  id: string;
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: 'glasses' | 'users' | 'alert' | 'tasks' | 'battery' | 'shield';
}

export const kpiCards: KPICard[] = [
  { id: 'k1', label: 'Active Glasses', value: '24', change: 12, trend: 'up', icon: 'glasses' },
  { id: 'k2', label: 'Workers On Site', value: '147', change: 8, trend: 'up', icon: 'users' },
  { id: 'k3', label: 'Open Safety Incidents', value: '3', change: -22, trend: 'down', icon: 'alert' },
  { id: 'k4', label: 'Tasks Completed Today', value: '89', change: 15, trend: 'up', icon: 'tasks' },
  { id: 'k5', label: 'Battery Health Avg', value: '74%', change: -3, trend: 'down', icon: 'battery' },
  { id: 'k6', label: 'Compliance Score', value: '98.4%', change: 2, trend: 'up', icon: 'shield' },
];

export const taskCompletionData = [
  { day: 'Mon', tasks: 62 },
  { day: 'Tue', tasks: 78 },
  { day: 'Wed', tasks: 54 },
  { day: 'Thu', tasks: 91 },
  { day: 'Fri', tasks: 84 },
  { day: 'Sat', tasks: 43 },
  { day: 'Sun', tasks: 28 },
];

export const glassesActivityData = [
  { hour: '00:00', devices: 8 },
  { hour: '03:00', devices: 4 },
  { hour: '06:00', devices: 12 },
  { hour: '09:00', devices: 22 },
  { hour: '12:00', devices: 24 },
  { hour: '15:00', devices: 23 },
  { hour: '18:00', devices: 18 },
  { hour: '21:00', devices: 10 },
];

export const incidentCategoryData = [
  { name: 'Helmet', value: 32, color: 'hsl(var(--chart-1))' },
  { name: 'Fall', value: 18, color: 'hsl(var(--chart-3))' },
  { name: 'Restricted Area', value: 24, color: 'hsl(var(--chart-4))' },
  { name: 'Equipment', value: 14, color: 'hsl(var(--chart-5))' },
  { name: 'Fatigue', value: 12, color: 'hsl(var(--chart-2))' },
];

export type ActivityStatus = 'completed' | 'connected' | 'replaced' | 'approved' | 'entered';
export type ActivityIcon = 'check' | 'wifi' | 'battery' | 'file' | 'map';

export interface ActivityEvent {
  id: string;
  icon: ActivityIcon;
  title: string;
  timestamp: string;
  employee: string;
  location: string;
  status: ActivityStatus;
}

export const activityEvents: ActivityEvent[] = [
  { id: 'a1', icon: 'check', title: 'Worker completed inspection', timestamp: '3 min ago', employee: 'M. Rivera', location: 'Zone A', status: 'completed' },
  { id: 'a2', icon: 'wifi', title: 'Device connected', timestamp: '11 min ago', employee: 'L. Chen', location: 'Zone B', status: 'connected' },
  { id: 'a3', icon: 'battery', title: 'Battery replaced', timestamp: '26 min ago', employee: 'D. Patel', location: 'Storage Bay', status: 'replaced' },
  { id: 'a4', icon: 'file', title: 'Manager approved report', timestamp: '38 min ago', employee: 'S. Okoro', location: 'Office', status: 'approved' },
  { id: 'a5', icon: 'map', title: 'Worker entered Zone C', timestamp: '45 min ago', employee: 'K. Vance', location: 'Zone C', status: 'entered' },
];

export interface QuickAction {
  id: string;
  label: string;
  icon: 'glasses' | 'clipboard' | 'file-text' | 'radio' | 'user-plus';
}

export const quickActions: QuickAction[] = [
  { id: 'q1', label: 'Assign Glasses', icon: 'glasses' },
  { id: 'q2', label: 'Create Inspection', icon: 'clipboard' },
  { id: 'q3', label: 'Generate Report', icon: 'file-text' },
  { id: 'q4', label: 'Emergency Broadcast', icon: 'radio' },
  { id: 'q5', label: 'Register Employee', icon: 'user-plus' },
];

export interface SiteStatus {
  weather: string;
  weatherIcon: 'sun' | 'cloud' | 'rain' | 'wind';
  siteCondition: string;
  shift: string;
  activeZones: number;
  connectedDevices: number;
}

export const siteStatus: SiteStatus = {
  weather: '28°C — Clear',
  weatherIcon: 'sun',
  siteCondition: 'Operational',
  shift: 'Day Shift — 06:00 to 18:00',
  activeZones: 12,
  connectedDevices: 24,
};

export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low';
export type IncidentStatus = 'open' | 'investigating' | 'resolved';

export interface IncidentReport {
  id: string;
  category: string;
  site: string;
  reportedBy: string;
  timestamp: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
}

export const incidentReports: IncidentReport[] = [
  { id: 'IR-2401', category: 'Helmet', site: 'Site A — Tower 3', reportedBy: 'M. Rivera', timestamp: 'Aug 2, 09:14', severity: 'critical', status: 'open' },
  { id: 'IR-2402', category: 'Restricted Area', site: 'Site B — Sub-level 2', reportedBy: 'L. Chen', timestamp: 'Aug 2, 08:47', severity: 'high', status: 'investigating' },
  { id: 'IR-2403', category: 'Fall', site: 'Site A — Scaffold 5', reportedBy: 'Auto-detect', timestamp: 'Aug 2, 08:22', severity: 'critical', status: 'investigating' },
  { id: 'IR-2404', category: 'Equipment', site: 'Site C — Perimeter', reportedBy: 'D. Patel', timestamp: 'Aug 1, 17:35', severity: 'medium', status: 'resolved' },
  { id: 'IR-2405', category: 'Fatigue', site: 'Site B — Loading Dock', reportedBy: 'S. Okoro', timestamp: 'Aug 1, 15:12', severity: 'low', status: 'resolved' },
  { id: 'IR-2406', category: 'Helmet', site: 'Site A — Tower 1', reportedBy: 'K. Vance', timestamp: 'Aug 1, 11:08', severity: 'high', status: 'open' },
  { id: 'IR-2407', category: 'Restricted Area', site: 'Site C — Tunnel', reportedBy: 'Auto-detect', timestamp: 'Aug 1, 09:50', severity: 'medium', status: 'resolved' },
  { id: 'IR-2408', category: 'Equipment', site: 'Site B — Crane 2', reportedBy: 'J. Hayes', timestamp: 'Jul 31, 16:30', severity: 'low', status: 'resolved' },
];

export type TaskStatus = 'completed' | 'in-progress' | 'overdue';

export interface CompletedTask {
  id: string;
  task: string;
  assignee: string;
  zone: string;
  completedAt: string;
  status: TaskStatus;
}

export const completedTasks: CompletedTask[] = [
  { id: 'T-901', task: 'PPE Compliance Check', assignee: 'M. Rivera', zone: 'Zone A', completedAt: 'Aug 2, 10:20', status: 'completed' },
  { id: 'T-902', task: 'Scaffold Inspection', assignee: 'L. Chen', zone: 'Zone B', completedAt: 'Aug 2, 09:45', status: 'completed' },
  { id: 'T-903', task: 'Equipment Calibration', assignee: 'D. Patel', zone: 'Zone C', completedAt: 'Aug 2, 09:10', status: 'in-progress' },
  { id: 'T-904', task: 'Perimeter Patrol', assignee: 'K. Vance', zone: 'Perimeter', completedAt: 'Aug 2, 08:30', status: 'completed' },
  { id: 'T-905', task: 'Safety Drill Prep', assignee: 'S. Okoro', zone: 'Office', completedAt: 'Aug 1, 17:00', status: 'overdue' },
  { id: 'T-906', task: 'Hazard Assessment', assignee: 'J. Hayes', zone: 'Zone A', completedAt: 'Aug 1, 15:45', status: 'completed' },
  { id: 'T-907', task: 'Device Sync Audit', assignee: 'M. Rivera', zone: 'Storage Bay', completedAt: 'Aug 1, 14:20', status: 'completed' },
  { id: 'T-908', task: 'Crane Safety Check', assignee: 'L. Chen', zone: 'Zone B', completedAt: 'Aug 1, 11:15', status: 'in-progress' },
];
