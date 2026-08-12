export type ConnectionStatus = 'online' | 'offline' | 'syncing';
export type BatteryLevel = 'full' | 'medium' | 'low' | 'critical' | 'charging';

export interface Device {
  id: string;
  model: string;
  assignedEmployee: string;
  assignedSite: string;
  batteryPercent: number;
  batteryLevel: BatteryLevel;
  firmware: string;
  firmwareUpdateAvailable: boolean;
  usageSession: string;
  connection: ConnectionStatus;
  lastSync: string;
  storageUsed: number;
  storageTotal: number;
  networkSignal: number;
  temperature: string;
  todayUsage: string;
}

export const devices: Device[] = [
  {
    id: 'MG-001',
    model: 'Meta Glasses Pro',
    assignedEmployee: 'M. Rivera',
    assignedSite: 'Site A — Tower 3',
    batteryPercent: 82,
    batteryLevel: 'full',
    firmware: '2.4.1',
    firmwareUpdateAvailable: false,
    usageSession: '08:00 AM - 04:30 PM',
    connection: 'online',
    lastSync: '2 min ago',
    storageUsed: 14.2,
    storageTotal: 32,
    networkSignal: 92,
    temperature: '34°C',
    todayUsage: '7h 22m',
  },
  {
    id: 'MG-002',
    model: 'Meta Glasses Pro',
    assignedEmployee: 'L. Chen',
    assignedSite: 'Site B — Sub-level 2',
    batteryPercent: 47,
    batteryLevel: 'medium',
    firmware: '2.3.8',
    firmwareUpdateAvailable: true,
    usageSession: '08:00 AM - 04:30 PM',
    connection: 'syncing',
    lastSync: '1 min ago',
    storageUsed: 22.8,
    storageTotal: 32,
    networkSignal: 68,
    temperature: '38°C',
    todayUsage: '6h 45m',
  },
  {
    id: 'MG-003',
    model: 'Meta Glasses Air',
    assignedEmployee: 'D. Patel',
    assignedSite: 'Site C — Perimeter',
    batteryPercent: 91,
    batteryLevel: 'full',
    firmware: '2.4.1',
    firmwareUpdateAvailable: false,
    usageSession: '06:00 AM - 02:00 PM',
    connection: 'online',
    lastSync: '5 min ago',
    storageUsed: 8.1,
    storageTotal: 16,
    networkSignal: 85,
    temperature: '31°C',
    todayUsage: '7h 58m',
  },
  {
    id: 'MG-004',
    model: 'Meta Glasses Pro',
    assignedEmployee: 'Unassigned',
    assignedSite: 'Storage Bay',
    batteryPercent: 0,
    batteryLevel: 'critical',
    firmware: '2.3.8',
    firmwareUpdateAvailable: true,
    usageSession: 'Inactive',
    connection: 'offline',
    lastSync: '4 hr ago',
    storageUsed: 28.4,
    storageTotal: 32,
    networkSignal: 0,
    temperature: '22°C',
    todayUsage: '0h 0m',
  },
  {
    id: 'MG-005',
    model: 'Meta Glasses Air',
    assignedEmployee: 'S. Okoro',
    assignedSite: 'Site A — Tower 1',
    batteryPercent: 63,
    batteryLevel: 'medium',
    firmware: '2.4.0',
    firmwareUpdateAvailable: true,
    usageSession: 'Charging',
    connection: 'online',
    lastSync: '8 min ago',
    storageUsed: 11.3,
    storageTotal: 16,
    networkSignal: 74,
    temperature: '33°C',
    todayUsage: '5h 12m',
  },
  {
    id: 'MG-006',
    model: 'Meta Glasses Pro',
    assignedEmployee: 'K. Vance',
    assignedSite: 'Site B — Loading Dock',
    batteryPercent: 12,
    batteryLevel: 'low',
    firmware: '2.4.1',
    firmwareUpdateAvailable: false,
    usageSession: '08:00 AM - 04:30 PM',
    connection: 'online',
    lastSync: '3 min ago',
    storageUsed: 19.7,
    storageTotal: 32,
    networkSignal: 55,
    temperature: '39°C',
    todayUsage: '7h 48m',
  },
  {
    id: 'MG-007',
    model: 'Meta Glasses Air',
    assignedEmployee: 'J. Hayes',
    assignedSite: 'Site C — Tunnel',
    batteryPercent: 78,
    batteryLevel: 'full',
    firmware: '2.3.8',
    firmwareUpdateAvailable: true,
    usageSession: '06:00 AM - 02:00 PM',
    connection: 'online',
    lastSync: '6 min ago',
    storageUsed: 6.5,
    storageTotal: 16,
    networkSignal: 80,
    temperature: '30°C',
    todayUsage: '7h 30m',
  },
  {
    id: 'MG-008',
    model: 'Meta Glasses Pro',
    assignedEmployee: 'Unassigned',
    assignedSite: 'Storage Bay',
    batteryPercent: 100,
    batteryLevel: 'charging',
    firmware: '2.4.1',
    firmwareUpdateAvailable: false,
    usageSession: 'Charging',
    connection: 'offline',
    lastSync: '12 min ago',
    storageUsed: 2.1,
    storageTotal: 32,
    networkSignal: 0,
    temperature: '24°C',
    todayUsage: '0h 0m',
  },
];

export const firmwareVersions = ['2.4.1', '2.4.0', '2.3.8'];
export const siteLocations = [
  'Site A — Tower 3',
  'Site A — Tower 1',
  'Site B — Sub-level 2',
  'Site B — Loading Dock',
  'Site C — Perimeter',
  'Site C — Tunnel',
  'Storage Bay',
];

export interface TelemetryCard {
  id: string;
  label: string;
  value: string;
  active: boolean;
  icon: 'battery' | 'cpu' | 'memory' | 'camera' | 'mic' | 'gps' | 'wifi';
}

export const telemetryData: TelemetryCard[] = [
  { id: 't1', label: 'Battery Health', value: '82%', active: true, icon: 'battery' },
  { id: 't2', label: 'CPU Usage', value: '34%', active: true, icon: 'cpu' },
  { id: 't3', label: 'Memory Usage', value: '1.2 GB', active: true, icon: 'memory' },
  { id: 't4', label: 'Camera Status', value: 'Recording', active: true, icon: 'camera' },
  { id: 't5', label: 'Microphone', value: 'Active', active: true, icon: 'mic' },
  { id: 't6', label: 'GPS', value: 'Locked', active: true, icon: 'gps' },
  { id: 't7', label: 'Network', value: '92% signal', active: true, icon: 'wifi' },
];

export type HistoryIcon = 'firmware' | 'battery' | 'assigned' | 'returned' | 'inspection-start' | 'inspection-end';

export interface DeviceHistoryEvent {
  id: string;
  icon: HistoryIcon;
  title: string;
  timestamp: string;
  detail: string;
}

export const deviceHistory: DeviceHistoryEvent[] = [
  { id: 'h1', icon: 'inspection-end', title: 'Inspection Completed', timestamp: 'Aug 2, 10:15 AM', detail: 'Zone A — PPE compliance check passed' },
  { id: 'h2', icon: 'inspection-start', title: 'Inspection Started', timestamp: 'Aug 2, 09:30 AM', detail: 'Zone A — Pre-shift inspection' },
  { id: 'h3', icon: 'firmware', title: 'Firmware Updated', timestamp: 'Aug 1, 06:00 PM', detail: 'v2.3.8 → v2.4.1' },
  { id: 'h4', icon: 'assigned', title: 'Assigned to Worker', timestamp: 'Aug 1, 07:00 AM', detail: 'Assigned to M. Rivera' },
  { id: 'h5', icon: 'battery', title: 'Battery Replaced', timestamp: 'Jul 30, 05:45 PM', detail: 'Cell pack swapped — health 100%' },
  { id: 'h6', icon: 'returned', title: 'Returned to Charging Station', timestamp: 'Jul 29, 04:30 PM', detail: 'Docked at Storage Bay — Unit 2' },
];

export interface DeviceEvent {
  id: string;
  device: string;
  event: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
}

export const recentDeviceEvents: DeviceEvent[] = [
  { id: 'e1', device: 'MG-004', event: 'Device went offline', severity: 'critical', timestamp: 'Aug 2, 10:22 AM' },
  { id: 'e2', device: 'MG-002', event: 'Firmware update available', severity: 'warning', timestamp: 'Aug 2, 09:15 AM' },
  { id: 'e3', device: 'MG-006', event: 'Battery critically low (12%)', severity: 'warning', timestamp: 'Aug 2, 08:48 AM' },
  { id: 'e4', device: 'MG-005', event: 'Device entered charging mode', severity: 'info', timestamp: 'Aug 2, 08:30 AM' },
  { id: 'e5', device: 'MG-003', event: 'Sync completed', severity: 'info', timestamp: 'Aug 2, 08:05 AM' },
];

export interface MaintenanceItem {
  id: string;
  device: string;
  task: string;
  scheduled: string;
  status: 'scheduled' | 'in-progress' | 'overdue';
}

export const maintenanceSchedule: MaintenanceItem[] = [
  { id: 'm1', device: 'MG-004', task: 'Battery replacement', scheduled: 'Aug 3, 08:00 AM', status: 'overdue' },
  { id: 'm2', device: 'MG-002', task: 'Firmware update to v2.4.1', scheduled: 'Aug 3, 06:00 PM', status: 'scheduled' },
  { id: 'm3', device: 'MG-007', task: 'Lens calibration', scheduled: 'Aug 4, 10:00 AM', status: 'scheduled' },
  { id: 'm4', device: 'MG-005', task: 'Full diagnostic', scheduled: 'Aug 5, 09:00 AM', status: 'in-progress' },
];

export interface FirmwareUpdate {
  id: string;
  version: string;
  devicesAffected: number;
  releaseDate: string;
  status: 'available' | 'scheduled' | 'rolling-out';
}

export const upcomingFirmwareUpdates: FirmwareUpdate[] = [
  { id: 'f1', version: 'v2.4.2', devicesAffected: 3, releaseDate: 'Aug 6, 2026', status: 'available' },
  { id: 'f2', version: 'v2.4.1', devicesAffected: 2, releaseDate: 'Aug 3, 2026', status: 'scheduled' },
  { id: 'f3', version: 'v2.4.0', devicesAffected: 1, releaseDate: 'Aug 2, 2026', status: 'rolling-out' },
];
