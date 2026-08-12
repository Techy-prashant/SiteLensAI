export interface UserProfile {
  name: string;
  email: string;
  role: string;
  initials: string;
}

export const mockUser: UserProfile = {
  name: 'Alex Mercer',
  email: 'alex.mercer@sitelens.ai',
  role: 'Safety Operations Lead',
  initials: 'AM',
};

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  severity: 'info' | 'warning' | 'critical';
}

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'PPE violation detected',
    description: 'Zone B — employee without hard hat',
    timestamp: '2 min ago',
    read: false,
    severity: 'critical',
  },
  {
    id: 'n2',
    title: 'Meta Glasses offline',
    description: 'Device MG-04 lost connection',
    timestamp: '18 min ago',
    read: false,
    severity: 'warning',
  },
  {
    id: 'n3',
    title: 'Daily report ready',
    description: 'Safety summary for Aug 2 is available',
    timestamp: '1 hr ago',
    read: true,
    severity: 'info',
  },
];
