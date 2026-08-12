import {
  Home,
  LayoutDashboard,
  Glasses,
  Users,
  BarChart3,
  Settings,
  KeyRound,
  SlidersHorizontal,
  ShieldHalf,
  type LucideIcon,
} from 'lucide-react';

export type UserRole = 'super_admin' | 'supervisor' | 'site_manager' | 'field_worker';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
  roles?: UserRole[];
}

export const navItems: NavItem[] = [
  {
    title: 'Home',
    href: '/home',
    icon: Home,
    description: 'Gemini AI central search home',
  },
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Overview of site safety operations',
  },
  {
    title: 'Meta Glasses',
    href: '/meta-glasses',
    icon: Glasses,
    description: 'Connected smart glasses fleet',
  },
  {
    title: 'Employees',
    href: '/employees',
    icon: Users,
    description: 'Workforce directory and roles',
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Safety metrics and reporting',
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Workspace and system configuration',
  },
  {
    title: 'Permissions',
    href: '/permissions',
    icon: KeyRound,
    description: 'Manage access rights and policies',
    roles: ['super_admin'],
  },
  {
    title: 'System Configuration',
    href: '/system-configuration',
    icon: SlidersHorizontal,
    description: 'Platform-wide system settings',
    roles: ['super_admin'],
  },
  {
    title: 'Role Management',
    href: '/role-management',
    icon: ShieldHalf,
    description: 'Create and assign user roles',
    roles: ['super_admin'],
  },
];

export function getNavItemsForRole(role: UserRole | null): NavItem[] {
  if (!role) return navItems.filter((item) => !item.roles);
  return navItems.filter(
    (item) => !item.roles || item.roles.includes(role)
  );
}
