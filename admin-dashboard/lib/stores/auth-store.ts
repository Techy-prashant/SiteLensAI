'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRole } from '@/lib/navigation';
import { useMockStore } from '@/lib/mock-store';
import { RoleId } from '@/lib/types';

export interface AuthUser {
  id: string;
  empId: string;
  name: string;
  email: string;
  role: UserRole;
  roleId: RoleId;
  roleLabel: string;
  initials: string;
}

interface MockUser {
  email: string;
  password: string;
  user: AuthUser;
}

export const demoCredentialsList: MockUser[] = [
  {
    email: 'admin@sitelens.ai',
    password: 'admin123',
    user: {
      id: 'u-001',
      empId: 'ADM-001',
      name: 'Alex Mercer',
      email: 'admin@sitelens.ai',
      role: 'super_admin',
      roleId: 1,
      roleLabel: 'Super Admin (All Access)',
      initials: 'AM',
    },
  },
  {
    email: 'supervisor@sitelens.ai',
    password: 'super123',
    user: {
      id: 'u-002',
      empId: 'SUP-001',
      name: 'Marcus Vance',
      email: 'supervisor@sitelens.ai',
      role: 'supervisor',
      roleId: 2,
      roleLabel: 'Supervisor (Site Managers Access)',
      initials: 'MV',
    },
  },
  {
    email: 'manager@sitelens.ai',
    password: 'manager123',
    user: {
      id: 'u-003',
      empId: 'MGR-001',
      name: 'Dana Patel',
      email: 'manager@sitelens.ai',
      role: 'site_manager',
      roleId: 3,
      roleLabel: 'Site Manager (Workers Access)',
      initials: 'DP',
    },
  },
];

export const demoCredentials = demoCredentialsList.map((m) => ({
  email: m.email,
  password: m.password,
  roleLabel: m.user.roleLabel,
}));

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  resetPassword: (email: string) => { success: boolean; error?: string };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: demoCredentialsList[0].user, // Default Super Admin
      isLoading: false,

      login: (email, password) => {
        const match = demoCredentialsList.find(
          (m) =>
            m.email.toLowerCase() === email.trim().toLowerCase() &&
            m.password === password
        );
        if (!match) {
          return { success: false, error: 'Invalid email or password.' };
        }
        set({ user: match.user });

        // Sync with mock-store active user
        useMockStore.getState().setActiveUser(match.user.empId);
        return { success: true };
      },

      logout: () => set({ user: null }),

      resetPassword: (email) => {
        const exists = demoCredentialsList.some(
          (m) => m.email.toLowerCase() === email.trim().toLowerCase()
        );
        if (!exists) {
          return {
            success: false,
            error: 'No account found with that email address.',
          };
        }
        return { success: true };
      },
    }),
    {
      name: 'sitelens-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
