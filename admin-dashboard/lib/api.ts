import { useMockStore } from './mock-store';
import {
  Supervisor,
  SiteManager,
  FieldWorker,
  Site,
  Task,
  Report,
  TaskStatus,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Shared API interface for FastAPI backend with automatic local store fallback.
 */
export const api = {
  // Auth Endpoint
  login: async (username: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback to local store lookup
    }
    const store = useMockStore.getState();
    const user = store.users.find(
      (u) => u.Username.toLowerCase() === username.toLowerCase() && u.Password === password
    );
    if (!user) {
      return { success: false, error: 'Invalid username or password' };
    }
    const emp = store.getEmployeeByEmpId(user.Emp_id);
    return {
      success: true,
      token: `mock-jwt-token-${user.User_id}`,
      user: {
        User_id: user.User_id,
        Emp_id: user.Emp_id,
        Role_id: user.Role_id,
        Name: emp ? emp.Name : user.Username,
      },
    };
  },

  // Search Endpoint (/api/web/search)
  search: async (query: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/web/search?q=${encodeURIComponent(query)}`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return useMockStore.getState().searchEmployees(query);
  },

  // Create Supervisor
  createSupervisor: async (data: Omit<Supervisor, 'User_id' | 'Role_id'> & { Username: string; Password?: string }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/web/users/supervisor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    useMockStore.getState().createSupervisor(data);
    return { success: true };
  },

  // Create Site Manager
  createSiteManager: async (data: Omit<SiteManager, 'User_id' | 'Role_id'> & { Username: string; Password?: string }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/web/users/site-manager`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    useMockStore.getState().createSiteManager(data);
    return { success: true };
  },

  // Create Field Worker
  createFieldWorker: async (data: Omit<FieldWorker, 'User_id' | 'Role_id'> & { Username: string; Password?: string }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/web/users/field-worker`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    useMockStore.getState().createFieldWorker(data);
    return { success: true };
  },

  // Create Site
  createSite: async (data: Omit<Site, 'Site_id' | 'No.of_employees' | 'No._of_glasses_used'>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/web/sites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    useMockStore.getState().createSite(data);
    return { success: true };
  },

  // Create Task
  createTask: async (data: { Site_id: string; Assigned_to: string; Due_date: string; TaskName: string; Task_description: string }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    useMockStore.getState().createTask(data);
    return { success: true };
  },

  // Update Task Status
  updateTaskStatus: async (taskId: string, status: TaskStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    useMockStore.getState().updateTaskStatus(taskId, status);
    return { success: true };
  },

  // Submit Report
  submitReport: async (data: { Session_id: string; site_id: string; Summary: string; Attachments: string[] }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    useMockStore.getState().submitReport(data);
    return { success: true };
  },
};
