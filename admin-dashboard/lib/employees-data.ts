export type EmployeeStatus = 'on-site' | 'off-site' | 'on-leave' | 'training' | 'emergency';
export type AccessLevel = 'worker' | 'manager' | 'supervisor' | 'site-admin';

export interface Employee {
  id: string;
  name: string;
  initials: string;
  role: string;
  department: string;
  assignedSite: string;
  smartGlasses: string;
  todayShift: string;
  status: EmployeeStatus;
  accessLevel: AccessLevel;
  email: string;
  phone: string;
  emergencyContact: string;
  emergencyPhone: string;
  certifications: { name: string; expiry: string; valid: boolean }[];
  trainingStatus: string;
  deviceStatus: string;
  deviceLastSync: string;
  deviceBattery: string;
  deviceUsageHours: string;
}

export const employees: Employee[] = [
  {
    id: 'EMP-001',
    name: 'Marcus Rivera',
    initials: 'MR',
    role: 'Site Safety Officer',
    department: 'Safety',
    assignedSite: 'Site A — Tower 3',
    smartGlasses: 'MG-001',
    todayShift: '08:00 - 16:30',
    status: 'on-site',
    accessLevel: 'supervisor',
    email: 'm.rivera@sitelens.ai',
    phone: '+1 (555) 102-8841',
    emergencyContact: 'Elena Rivera',
    emergencyPhone: '+1 (555) 102-9923',
    certifications: [
      { name: 'OSHA 30-Hour Construction', expiry: 'Mar 2027', valid: true },
      { name: 'Fall Protection', expiry: 'Jan 2027', valid: true },
      { name: 'First Aid / CPR', expiry: 'Nov 2026', valid: true },
    ],
    trainingStatus: 'Completed — All modules current',
    deviceStatus: 'Online',
    deviceLastSync: '2 min ago',
    deviceBattery: '82%',
    deviceUsageHours: '7h 22m',
  },
  {
    id: 'EMP-002',
    name: 'Linda Chen',
    initials: 'LC',
    role: 'Construction Manager',
    department: 'Operations',
    assignedSite: 'Site B — Sub-level 2',
    smartGlasses: 'MG-002',
    todayShift: '08:00 - 16:30',
    status: 'on-site',
    accessLevel: 'manager',
    email: 'l.chen@sitelens.ai',
    phone: '+1 (555) 440-2210',
    emergencyContact: 'David Chen',
    emergencyPhone: '+1 (555) 440-8890',
    certifications: [
      { name: 'OSHA 30-Hour Construction', expiry: 'Aug 2026', valid: true },
      { name: 'Scaffold Safety', expiry: 'Jul 2026', valid: true },
    ],
    trainingStatus: 'Completed — 1 module expiring soon',
    deviceStatus: 'Syncing',
    deviceLastSync: '1 min ago',
    deviceBattery: '47%',
    deviceUsageHours: '6h 45m',
  },
  {
    id: 'EMP-003',
    name: 'Dana Patel',
    initials: 'DP',
    role: 'Site Manager',
    department: 'Operations',
    assignedSite: 'Site C — Perimeter',
    smartGlasses: 'MG-003',
    todayShift: '06:00 - 14:00',
    status: 'on-site',
    accessLevel: 'site-admin',
    email: 'd.patel@sitelens.ai',
    phone: '+1 (555) 778-3340',
    emergencyContact: 'Anya Patel',
    emergencyPhone: '+1 (555) 778-9912',
    certifications: [
      { name: 'OSHA 30-Hour Construction', expiry: 'Feb 2027', valid: true },
      { name: 'Confined Space Entry', expiry: 'Sep 2026', valid: true },
      { name: 'Hazard Communication', expiry: 'Dec 2026', valid: true },
    ],
    trainingStatus: 'Completed — All modules current',
    deviceStatus: 'Online',
    deviceLastSync: '5 min ago',
    deviceBattery: '91%',
    deviceUsageHours: '7h 58m',
  },
  {
    id: 'EMP-004',
    name: 'Samuel Okoro',
    initials: 'SO',
    role: 'Structural Worker',
    department: 'Construction',
    assignedSite: 'Site A — Tower 1',
    smartGlasses: 'MG-005',
    todayShift: '08:00 - 16:30',
    status: 'training',
    accessLevel: 'worker',
    email: 's.okoro@sitelens.ai',
    phone: '+1 (555) 220-7765',
    emergencyContact: 'Grace Okoro',
    emergencyPhone: '+1 (555) 220-1188',
    certifications: [
      { name: 'OSHA 10-Hour Construction', expiry: 'Oct 2026', valid: true },
      { name: 'PPE Training', expiry: 'May 2026', valid: false },
    ],
    trainingStatus: 'In Progress — PPE Recertification due',
    deviceStatus: 'Charging',
    deviceLastSync: '8 min ago',
    deviceBattery: '63%',
    deviceUsageHours: '5h 12m',
  },
  {
    id: 'EMP-005',
    name: 'Kara Vance',
    initials: 'KV',
    role: 'Equipment Operator',
    department: 'Construction',
    assignedSite: 'Site B — Loading Dock',
    smartGlasses: 'MG-006',
    todayShift: '08:00 - 16:30',
    status: 'on-site',
    accessLevel: 'worker',
    email: 'k.vance@sitelens.ai',
    phone: '+1 (555) 661-9087',
    emergencyContact: 'Tom Vance',
    emergencyPhone: '+1 (555) 661-4321',
    certifications: [
      { name: 'Heavy Equipment Operation', expiry: 'Apr 2027', valid: true },
      { name: 'Fall Protection', expiry: 'Jun 2026', valid: true },
    ],
    trainingStatus: 'Completed — All modules current',
    deviceStatus: 'Online',
    deviceLastSync: '3 min ago',
    deviceBattery: '12%',
    deviceUsageHours: '7h 48m',
  },
  {
    id: 'EMP-006',
    name: 'James Hayes',
    initials: 'JH',
    role: 'Safety Inspector',
    department: 'Safety',
    assignedSite: 'Site C — Tunnel',
    smartGlasses: 'MG-007',
    todayShift: '06:00 - 14:00',
    status: 'on-site',
    accessLevel: 'supervisor',
    email: 'j.hayes@sitelens.ai',
    phone: '+1 (555) 330-5560',
    emergencyContact: 'Mary Hayes',
    emergencyPhone: '+1 (555) 330-7790',
    certifications: [
      { name: 'OSHA 30-Hour Construction', expiry: 'Jan 2027', valid: true },
      { name: 'Tunnel Safety', expiry: 'Aug 2026', valid: true },
      { name: 'First Aid / CPR', expiry: 'Sep 2026', valid: true },
    ],
    trainingStatus: 'Completed — All modules current',
    deviceStatus: 'Online',
    deviceLastSync: '6 min ago',
    deviceBattery: '78%',
    deviceUsageHours: '7h 30m',
  },
  {
    id: 'EMP-007',
    name: 'Nina Aldrich',
    initials: 'NA',
    role: 'Electrical Worker',
    department: 'Electrical',
    assignedSite: 'Site A — Tower 3',
    smartGlasses: 'None',
    todayShift: 'On Leave',
    status: 'on-leave',
    accessLevel: 'worker',
    email: 'n.aldrich@sitelens.ai',
    phone: '+1 (555) 990-1122',
    emergencyContact: 'Robert Aldrich',
    emergencyPhone: '+1 (555) 990-3344',
    certifications: [
      { name: 'Electrical Safety', expiry: 'Feb 2027', valid: true },
      { name: 'Lockout/Tagout', expiry: 'Mar 2027', valid: true },
    ],
    trainingStatus: 'Paused — On leave',
    deviceStatus: 'Unassigned',
    deviceLastSync: '—',
    deviceBattery: '—',
    deviceUsageHours: '—',
  },
  {
    id: 'EMP-008',
    name: 'Oscar Fernandez',
    initials: 'OF',
    role: 'Emergency Response Lead',
    department: 'Safety',
    assignedSite: 'Site B — Sub-level 2',
    smartGlasses: 'None',
    todayShift: '08:00 - 16:30',
    status: 'emergency',
    accessLevel: 'manager',
    email: 'o.fernandez@sitelens.ai',
    phone: '+1 (555) 882-4400',
    emergencyContact: 'Lucia Fernandez',
    emergencyPhone: '+1 (555) 882-6600',
    certifications: [
      { name: 'Emergency Response', expiry: 'Dec 2026', valid: true },
      { name: 'Hazardous Materials', expiry: 'Oct 2026', valid: true },
      { name: 'First Aid / CPR', expiry: 'Jul 2026', valid: false },
    ],
    trainingStatus: 'In Progress — CPR Recertification due',
    deviceStatus: 'Unassigned',
    deviceLastSync: '—',
    deviceBattery: '—',
    deviceUsageHours: '—',
  },
];

export const departments = ['Safety', 'Operations', 'Construction', 'Electrical'];
export const siteLocations = [
  'Site A — Tower 3',
  'Site A — Tower 1',
  'Site B — Sub-level 2',
  'Site B — Loading Dock',
  'Site C — Perimeter',
  'Site C — Tunnel',
];
export const roleOptions = [
  'Site Safety Officer',
  'Construction Manager',
  'Site Manager',
  'Structural Worker',
  'Equipment Operator',
  'Safety Inspector',
  'Electrical Worker',
  'Emergency Response Lead',
];
export const accessLevelOptions: { value: AccessLevel; label: string }[] = [
  { value: 'worker', label: 'Worker' },
  { value: 'manager', label: 'Manager' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'site-admin', label: 'Site Admin' },
];

export const accessBadge: Record<AccessLevel, { label: string; variant: 'neutral' | 'info' | 'warning' | 'success' }> = {
  worker: { label: 'Worker', variant: 'neutral' },
  manager: { label: 'Manager', variant: 'info' },
  supervisor: { label: 'Supervisor', variant: 'warning' },
  'site-admin': { label: 'Site Admin', variant: 'success' },
};

export type ActivityIconType = 'clock-in' | 'device' | 'inspection' | 'enter' | 'exit' | 'report';

export interface EmployeeActivityEvent {
  id: string;
  icon: ActivityIconType;
  title: string;
  timestamp: string;
  detail: string;
}

export const employeeActivity: EmployeeActivityEvent[] = [
  { id: 'a1', icon: 'report', title: 'Submitted Report', timestamp: 'Aug 2, 10:20 AM', detail: 'Daily safety summary — Zone A' },
  { id: 'a2', icon: 'exit', title: 'Exited Restricted Area', timestamp: 'Aug 2, 09:55 AM', detail: 'Left Zone D — authorized exit' },
  { id: 'a3', icon: 'enter', title: 'Entered Zone A', timestamp: 'Aug 2, 09:30 AM', detail: 'Zone A — Tower 3, Level 2' },
  { id: 'a4', icon: 'inspection', title: 'Completed Inspection', timestamp: 'Aug 2, 09:15 AM', detail: 'PPE compliance check — 12 workers' },
  { id: 'a5', icon: 'device', title: 'Assigned Device', timestamp: 'Aug 2, 07:45 AM', detail: 'MG-001 paired and synced' },
  { id: 'a6', icon: 'clock-in', title: 'Clocked In', timestamp: 'Aug 2, 07:38 AM', detail: 'Site A — Tower 3' },
];

export interface NewEmployee {
  id: string;
  name: string;
  role: string;
  department: string;
  startDate: string;
  status: 'active' | 'onboarding';
}

export const recentNewEmployees: NewEmployee[] = [
  { id: 'EMP-008', name: 'Oscar Fernandez', role: 'Emergency Response Lead', department: 'Safety', startDate: 'Aug 1, 2026', status: 'onboarding' },
  { id: 'EMP-007', name: 'Nina Aldrich', role: 'Electrical Worker', department: 'Electrical', startDate: 'Jul 28, 2026', status: 'active' },
  { id: 'EMP-006', name: 'James Hayes', role: 'Safety Inspector', department: 'Safety', startDate: 'Jul 25, 2026', status: 'active' },
  { id: 'EMP-005', name: 'Kara Vance', role: 'Equipment Operator', department: 'Construction', startDate: 'Jul 20, 2026', status: 'active' },
];

export interface CertificationItem {
  id: string;
  employee: string;
  certification: string;
  expiry: string;
  status: 'valid' | 'expiring' | 'expired';
}

export const upcomingCertifications: CertificationItem[] = [
  { id: 'c1', employee: 'O. Fernandez', certification: 'First Aid / CPR', expiry: 'Jul 2026', status: 'expired' },
  { id: 'c2', employee: 'S. Okoro', certification: 'PPE Training', expiry: 'May 2026', status: 'expired' },
  { id: 'c3', employee: 'L. Chen', certification: 'Scaffold Safety', expiry: 'Jul 2026', status: 'expiring' },
  { id: 'c4', employee: 'J. Hayes', certification: 'Tunnel Safety', expiry: 'Aug 2026', status: 'expiring' },
];

export interface TrainingItem {
  id: string;
  training: string;
  assignedTo: string;
  scheduled: string;
  status: 'scheduled' | 'in-progress' | 'completed';
}

export const trainingSchedule: TrainingItem[] = [
  { id: 'tr1', training: 'PPE Recertification', assignedTo: 'S. Okoro', scheduled: 'Aug 5, 09:00 AM', status: 'scheduled' },
  { id: 'tr2', training: 'CPR Recertification', assignedTo: 'O. Fernandez', scheduled: 'Aug 6, 10:00 AM', status: 'scheduled' },
  { id: 'tr3', training: 'Fall Protection', assignedTo: 'All Workers', scheduled: 'Aug 8, 08:00 AM', status: 'scheduled' },
  { id: 'tr4', training: 'Hazard Communication', assignedTo: 'M. Rivera', scheduled: 'Aug 3, 02:00 PM', status: 'in-progress' },
];

export interface ComplianceItem {
  id: string;
  category: string;
  compliant: number;
  total: number;
  percentage: number;
}

export const safetyCompliance: ComplianceItem[] = [
  { id: 'cmp1', category: 'PPE Compliance', compliant: 142, total: 147, percentage: 97 },
  { id: 'cmp2', category: 'Fall Protection', compliant: 138, total: 147, percentage: 94 },
  { id: 'cmp3', category: 'Helmet Usage', compliant: 145, total: 147, percentage: 99 },
  { id: 'cmp4', category: 'Zone Compliance', compliant: 134, total: 147, percentage: 91 },
];
