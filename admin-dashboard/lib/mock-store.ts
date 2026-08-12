import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Role,
  User,
  Admin,
  Supervisor,
  SiteManager,
  FieldWorker,
  Site,
  Task,
  Report,
  Glasses,
  RoleId,
  TaskStatus,
  EmployeeRecord,
} from './types';

export interface VLMReportCategory {
  category: 'Emergency' | 'Incident/Accident' | 'Machine Failure' | 'Worker Mistakes' | 'Site Negligence';
  Site_ID: string;
  Reporting_Entity_ID: string; // Site Manager ID or Worker ID
  VLM_Generated_Summary: string;
  timestamp: string;
}

export const staticRoles: Role[] = [
  { Role_id: 1, Role: 'Super Admin', Role_Description: 'Superior Authority' },
  { Role_id: 2, Role: 'Supervisor', Role_Description: 'Manages more than one site' },
  { Role_id: 3, Role: 'Site Manager', Role_Description: 'Manages one particular site' },
  { Role_id: 4, Role: 'Field Worker', Role_Description: 'Works on one or more fields' },
];

interface MockDatabaseState {
  roles: Role[];
  users: User[];
  admins: Admin[];
  supervisors: Supervisor[];
  siteManagers: SiteManager[];
  fieldWorkers: FieldWorker[];
  sites: Site[];
  tasks: Task[];
  reports: Report[];
  glasses: Glasses[];
  vlmReports: VLMReportCategory[];

  // Active Session / Role Simulation
  activeEmpId: string;
  activeRoleId: RoleId;
  setActiveUser: (empId: string) => void;
  setActiveRole: (roleId: RoleId) => void;

  // Actions
  createSupervisor: (data: Omit<Supervisor, 'User_id' | 'Role_id'> & { Username: string; Password?: string }) => void;
  createSiteManager: (data: Omit<SiteManager, 'User_id' | 'Role_id'> & { Username: string; Password?: string }) => void;
  createFieldWorker: (data: Omit<FieldWorker, 'User_id' | 'Role_id'> & { Username: string; Password?: string }) => void;
  createSite: (data: Omit<Site, 'Site_id' | 'No.of_employees' | 'No._of_glasses_used'>) => void;
  createTask: (data: { Site_id: string; Assigned_to: string; Due_date: string; TaskName: string; Task_description: string }) => void;
  submitReport: (data: { Session_id: string; site_id: string; Summary: string; Attachments: string[] }) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  toggleGlassesSession: (userEmpId: string, siteId: string) => void;
  addGlassesDevice: (data: { Glasses_id: string; Site_id: string; User_id: string; status: 'assigned' | 'unassigned' }) => void;

  // VLM / LLM Super Admin Custom API Processor
  queryVLM: (queryText: string) => { success: boolean; data?: string; statusCode: number; error?: string };

  // Search & Derived Helpers
  searchEmployees: (query: string) => EmployeeRecord[];
  getEmployeeByEmpId: (empId: string) => EmployeeRecord | null;
  getSiteEmployeeCount: (siteId: string) => number;
  getSiteGlassesCount: (siteId: string) => number;
  resetToDefaults: () => void;
}

const initialAdmins: Admin[] = [
  {
    Emp_id: 'ADM-001',
    Name: 'Alex Mercer',
    User_id: 'USR-001',
    Role_id: 1,
    Admin_mail: 'alex.mercer@sitelens.ai',
    Admin_contact: '+1 (555) 019-2831',
  },
];

const initialSupervisors: Supervisor[] = [
  {
    Emp_id: 'SUP-001',
    Name: 'Marcus Vance',
    User_id: 'USR-002',
    Role_id: 2,
    'E-mail': 'marcus.vance@sitelens.ai',
    Contact: '+1 (555) 342-9901',
    Emergency_contact: '+1 (555) 990-1122',
    Experience: '12 Years Heavy Infrastructure',
  },
  {
    Emp_id: 'SUP-002',
    Name: 'Elena Rostova',
    User_id: 'USR-003',
    Role_id: 2,
    'E-mail': 'elena.rostova@sitelens.ai',
    Contact: '+1 (555) 881-4432',
    Emergency_contact: '+1 (555) 443-8899',
    Experience: '8 Years Commercial Construction',
  },
];

const initialSiteManagers: SiteManager[] = [
  {
    Emp_id: 'MGR-001',
    Name: 'Dana Patel',
    User_id: 'USR-004',
    Role_id: 3,
    'E-mail': 'dana.patel@sitelens.ai',
    Contact: '+1 (555) 671-2099',
    Emergency_contact: '+1 (555) 209-9911',
    Blood_Group: 'O+',
  },
  {
    Emp_id: 'MGR-002',
    Name: 'Carlos Rivera',
    User_id: 'USR-005',
    Role_id: 3,
    'E-mail': 'carlos.rivera@sitelens.ai',
    Contact: '+1 (555) 431-8877',
    Emergency_contact: '+1 (555) 887-7766',
    Blood_Group: 'A+',
  },
  {
    Emp_id: 'MGR-003',
    Name: 'Sarah Jenkins',
    User_id: 'USR-006',
    Role_id: 3,
    'E-mail': 'sarah.jenkins@sitelens.ai',
    Contact: '+1 (555) 912-3344',
    Emergency_contact: '+1 (555) 334-4455',
    Blood_Group: 'B+',
  },
];

const initialFieldWorkers: FieldWorker[] = [
  {
    Emp_id: 'WRK-001',
    Name: 'Robert Chen',
    User_id: 'USR-007',
    Role_id: 4,
    'E-mail': 'robert.chen@sitelens.ai',
    Contact: '+1 (555) 234-5678',
    Emergency_contact: '+1 (555) 876-5432',
    Blood_Group: 'O-',
    Sub_Role: 'Scaffolding Specialist',
    assigned_site_id: 'SITE-101',
  },
  {
    Emp_id: 'WRK-002',
    Name: 'Jamal Washington',
    User_id: 'USR-008',
    Role_id: 4,
    'E-mail': 'jamal.w@sitelens.ai',
    Contact: '+1 (555) 345-6789',
    Emergency_contact: '+1 (555) 987-6543',
    Blood_Group: 'A-',
    Sub_Role: 'Electrician',
    assigned_site_id: 'SITE-101',
  },
  {
    Emp_id: 'WRK-003',
    Name: 'Sofia Gomez',
    User_id: 'USR-009',
    Role_id: 4,
    'E-mail': 'sofia.gomez@sitelens.ai',
    Contact: '+1 (555) 456-7890',
    Emergency_contact: '+1 (555) 098-7654',
    Blood_Group: 'AB+',
    Sub_Role: 'Crane Inspector',
    assigned_site_id: 'SITE-102',
  },
  {
    Emp_id: 'WRK-004',
    Name: 'David Kim',
    User_id: 'USR-010',
    Role_id: 4,
    'E-mail': 'david.kim@sitelens.ai',
    Contact: '+1 (555) 567-8901',
    Emergency_contact: '+1 (555) 109-8765',
    Blood_Group: 'B-',
    Sub_Role: 'Safety Technician',
    assigned_site_id: 'SITE-103',
  },
];

const initialUsers: User[] = [
  { User_id: 'USR-001', Emp_id: 'ADM-001', Username: 'admin', Password: 'password123', Role_id: 1 },
  { User_id: 'USR-002', Emp_id: 'SUP-001', Username: 'mvance', Password: 'password123', Role_id: 2 },
  { User_id: 'USR-003', Emp_id: 'SUP-002', Username: 'erostova', Password: 'password123', Role_id: 2 },
  { User_id: 'USR-004', Emp_id: 'MGR-001', Username: 'dpatel', Password: 'password123', Role_id: 3 },
  { User_id: 'USR-005', Emp_id: 'MGR-002', Username: 'crivera', Password: 'password123', Role_id: 3 },
  { User_id: 'USR-006', Emp_id: 'MGR-003', Username: 'sjenkins', Password: 'password123', Role_id: 3 },
  { User_id: 'USR-007', Emp_id: 'WRK-001', Username: 'rchen', Password: 'password123', Role_id: 4 },
  { User_id: 'USR-008', Emp_id: 'WRK-002', Username: 'jwashington', Password: 'password123', Role_id: 4 },
  { User_id: 'USR-009', Emp_id: 'WRK-003', Username: 'sgomez', Password: 'password123', Role_id: 4 },
  { User_id: 'USR-010', Emp_id: 'WRK-004', Username: 'dkim', Password: 'password123', Role_id: 4 },
];

const initialSites: Site[] = [
  {
    Site_id: 'SITE-101',
    Site_Location: 'Sector 4, Innovation Tech Park, Austin TX',
    Site_Description: '14-Story Commercial Highrise Construction',
    client_name: 'Apex Global Infrastructure',
    Site_manager: 'MGR-001',
    site_supervisor: 'SUP-001',
  },
  {
    Site_id: 'SITE-102',
    Site_Location: 'Harbor Gateway Berth 12, Long Beach CA',
    Site_Description: 'Automated Cargo Terminal Logistics Center',
    client_name: 'Pacific Freight Logistics',
    Site_manager: 'MGR-002',
    site_supervisor: 'SUP-001',
  },
  {
    Site_id: 'SITE-103',
    Site_Location: 'North District Substation, Columbus OH',
    Site_Description: 'Grid Modernization and Renewable Energy Hub',
    client_name: 'Midwest Energy Corp',
    Site_manager: 'MGR-003',
    site_supervisor: 'SUP-002',
  },
];

const initialTasks: Task[] = [
  {
    Task_id: 'TSK-501',
    Site_id: 'SITE-101',
    Assigned_by: 'SUP-001',
    Assigned_to: 'MGR-001',
    Due_date: '2026-08-15',
    Status: 'In Progress',
    TaskName: 'Foundation Rigging Safety Inspection',
    Task_description: 'Verify all crane riggings and load tie-downs on Sector B perimeter.',
  },
  {
    Task_id: 'TSK-502',
    Site_id: 'SITE-101',
    Assigned_by: 'MGR-001',
    Assigned_to: 'WRK-001',
    Due_date: '2026-08-10',
    Status: 'Pending',
    TaskName: 'Scaffolding Anchorage Checks',
    Task_description: 'Perform visual and torque checks on outer scaffolding anchors floor 4-8.',
  },
  {
    Task_id: 'TSK-503',
    Site_id: 'SITE-101',
    Assigned_by: 'MGR-001',
    Assigned_to: 'WRK-002',
    Due_date: '2026-08-12',
    Status: 'Completed',
    TaskName: 'Main Substation Conduit Lockout',
    Task_description: 'Ensure LOTO procedures completed before electrical panel installation.',
  },
  {
    Task_id: 'TSK-504',
    Site_id: 'SITE-102',
    Assigned_by: 'SUP-001',
    Assigned_to: 'WRK-003',
    Due_date: '2026-08-11',
    Status: 'In Progress',
    TaskName: 'Dock Crane Cable Wear Audit',
    Task_description: 'Inspect cable tension and wear on Gantry Crane 3 via smart glasses.',
  },
  {
    Task_id: 'TSK-505',
    Site_id: 'SITE-103',
    Assigned_by: 'SUP-002',
    Assigned_to: 'WRK-004',
    Due_date: '2026-08-14',
    Status: 'Escalated',
    TaskName: 'HVAC Ducting Hazmat Clearance',
    Task_description: 'Immediate clearance needed due to dust detection during demolition.',
  },
];

const initialReports: Report[] = [
  {
    Report_id: 'RPT-901',
    Session_id: 'SESS-2026-0801',
    User_id: 'USR-007',
    site_id: 'SITE-101',
    Summary: 'End of Shift Scaffolding Audit: All harnesses secured. 0 PPE violations detected during 4h smart glasses session.',
    Attachments: ['https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=600&auto=format&fit=crop'],
    Reported_by: 'WRK-001',
    Reported_to: 'MGR-001',
    'date&time': '2026-08-07T17:30:00Z',
  },
  {
    Report_id: 'RPT-902',
    Session_id: 'SESS-2026-0802',
    User_id: 'USR-008',
    site_id: 'SITE-101',
    Summary: 'Electrical Safety Log: Ground fault interrupters tested OK. Replaced damaged wire casing in Zone 3.',
    Attachments: [],
    Reported_by: 'WRK-002',
    Reported_to: 'MGR-001',
    'date&time': '2026-08-08T09:15:00Z',
  },
  {
    Report_id: 'RPT-903',
    Session_id: 'SESS-2026-0803',
    User_id: 'USR-004',
    site_id: 'SITE-101',
    Summary: 'Consolidated Daily Site Report: Sector 4 construction on schedule. 2 field workers active, 2 smart glasses deployed.',
    Attachments: [],
    Reported_by: 'MGR-001',
    Reported_to: 'SUP-001',
    'date&time': '2026-08-08T16:45:00Z',
  },
];

const initialGlasses: Glasses[] = [
  {
    Glasses_id: 'GLS-1001',
    User_id: 'WRK-001',
    Site_id: 'SITE-101',
    Login_dt: '2026-08-08T08:00:00Z',
    Logout_dt: null, // Active/Assigned
  },
  {
    Glasses_id: 'GLS-1002',
    User_id: 'WRK-002',
    Site_id: 'SITE-101',
    Login_dt: '2026-08-08T08:30:00Z',
    Logout_dt: null, // Active/Assigned
  },
  {
    Glasses_id: 'GLS-1003',
    User_id: 'WRK-003',
    Site_id: 'SITE-102',
    Login_dt: '2026-08-08T07:45:00Z',
    Logout_dt: null, // Active/Assigned
  },
  {
    Glasses_id: 'GLS-1004',
    User_id: 'Unassigned',
    Site_id: 'SITE-103',
    Login_dt: '2026-08-07T09:00:00Z',
    Logout_dt: '2026-08-07T17:00:00Z', // Inactive/Unassigned
  },
];

// EXACT 5 Actionable VLM-Summarized Report Categories for Analytics Page
const initialVLMReports: VLMReportCategory[] = [
  {
    category: 'Emergency',
    Site_ID: 'SITE-101',
    Reporting_Entity_ID: 'MGR-001',
    VLM_Generated_Summary: 'VLM Safety Alert: High-voltage conduit rupture detected on Sub-Level 2. Automatic breaker tripped; emergency evacuation protocol executed cleanly.',
    timestamp: '2026-08-08T14:22:00Z',
  },
  {
    category: 'Incident/Accident',
    Site_ID: 'SITE-102',
    Reporting_Entity_ID: 'WRK-003',
    VLM_Generated_Summary: 'VLM Incident Analysis: Gantry Crane 3 cable slippage during load transfer. No injuries recorded; tie-down harness absorbed kinetic shock.',
    timestamp: '2026-08-08T11:45:00Z',
  },
  {
    category: 'Machine Failure',
    Site_ID: 'SITE-101',
    Reporting_Entity_ID: 'MGR-001',
    VLM_Generated_Summary: 'VLM Diagnostic: Hydraulic fluid pressure loss on Tower Crane B hoist motor. Vector identified as seal degradation; replacement unit dislodged.',
    timestamp: '2026-08-08T09:10:00Z',
  },
  {
    category: 'Worker Mistakes',
    Site_ID: 'SITE-101',
    Reporting_Entity_ID: 'WRK-001',
    VLM_Generated_Summary: 'VLM Procedural Error: Field worker unhooked secondary lanyard during scaffolding transition on Floor 6. Verbal warning issued; re-training scheduled.',
    timestamp: '2026-08-07T16:30:00Z',
  },
  {
    category: 'Site Negligence',
    Site_ID: 'SITE-103',
    Reporting_Entity_ID: 'WRK-004',
    VLM_Generated_Summary: 'VLM Compliance Failure: Debris barricade unlatched along North Perimeter walkway. Tripping hazard flagged; supervisor notified to secure perimeter.',
    timestamp: '2026-08-07T13:15:00Z',
  },
];

export const useMockStore = create<MockDatabaseState>()(
  persist(
    (set, get) => ({
      roles: staticRoles,
      users: initialUsers,
      admins: initialAdmins,
      supervisors: initialSupervisors,
      siteManagers: initialSiteManagers,
      fieldWorkers: initialFieldWorkers,
      sites: initialSites,
      tasks: initialTasks,
      reports: initialReports,
      glasses: initialGlasses,
      vlmReports: initialVLMReports,

      // Default Active User is Super Admin
      activeEmpId: 'ADM-001',
      activeRoleId: 1,

      setActiveUser: (empId: string) => {
        const emp = get().getEmployeeByEmpId(empId);
        if (emp) {
          set({ activeEmpId: emp.Emp_id, activeRoleId: emp.Role_id });
        }
      },

      setActiveRole: (roleId: RoleId) => {
        let empId = 'ADM-001';
        if (roleId === 2) empId = get().supervisors[0]?.Emp_id || 'SUP-001';
        if (roleId === 3) empId = get().siteManagers[0]?.Emp_id || 'MGR-001';
        if (roleId === 4) empId = get().fieldWorkers[0]?.Emp_id || 'WRK-001';

        set({ activeRoleId: roleId, activeEmpId: empId });
      },

      createSupervisor: (data) => {
        const { Username, Password = 'password123', ...supData } = data;
        const newUserId = `USR-${Date.now().toString().slice(-4)}`;
        const newUser: User = {
          User_id: newUserId,
          Emp_id: supData.Emp_id,
          Username,
          Password,
          Role_id: 2,
        };
        const newSupervisor: Supervisor = {
          ...supData,
          User_id: newUserId,
          Role_id: 2,
        };

        set((state) => ({
          users: [newUser, ...state.users],
          supervisors: [newSupervisor, ...state.supervisors],
        }));
      },

      createSiteManager: (data) => {
        const { Username, Password = 'password123', ...mgrData } = data;
        const newUserId = `USR-${Date.now().toString().slice(-4)}`;
        const newUser: User = {
          User_id: newUserId,
          Emp_id: mgrData.Emp_id,
          Username,
          Password,
          Role_id: 3,
        };
        const newManager: SiteManager = {
          ...mgrData,
          User_id: newUserId,
          Role_id: 3,
        };

        set((state) => ({
          users: [newUser, ...state.users],
          siteManagers: [newManager, ...state.siteManagers],
        }));
      },

      createFieldWorker: (data) => {
        const { Username, Password = 'password123', ...wrkData } = data;
        const newUserId = `USR-${Date.now().toString().slice(-4)}`;
        const newUser: User = {
          User_id: newUserId,
          Emp_id: wrkData.Emp_id,
          Username,
          Password,
          Role_id: 4,
        };
        const newWorker: FieldWorker = {
          ...wrkData,
          User_id: newUserId,
          Role_id: 4,
        };

        set((state) => ({
          users: [newUser, ...state.users],
          fieldWorkers: [newWorker, ...state.fieldWorkers],
        }));
      },

      createSite: (data) => {
        const siteId = `SITE-${Math.floor(100 + Math.random() * 900)}`;
        const newSite: Site = {
          Site_id: siteId,
          ...data,
        };
        set((state) => ({ sites: [newSite, ...state.sites] }));
      },

      createTask: (data) => {
        const { activeEmpId } = get();
        const taskId = `TSK-${Math.floor(500 + Math.random() * 500)}`;
        const newTask: Task = {
          Task_id: taskId,
          Site_id: data.Site_id,
          Assigned_by: activeEmpId,
          Assigned_to: data.Assigned_to,
          Due_date: data.Due_date,
          Status: 'Pending',
          TaskName: data.TaskName,
          Task_description: data.Task_description,
        };
        set((state) => ({ tasks: [newTask, ...state.tasks] }));
      },

      submitReport: (data) => {
        const { activeEmpId, activeRoleId, supervisors, siteManagers } = get();
        const activeEmp = get().getEmployeeByEmpId(activeEmpId);

        let reportedTo = 'ADM-001';
        if (activeRoleId === 4) {
          const site = get().sites.find((s) => s.Site_id === data.site_id);
          reportedTo = site?.Site_manager || siteManagers[0]?.Emp_id || 'MGR-001';
        } else if (activeRoleId === 3) {
          const site = get().sites.find((s) => s.Site_id === data.site_id);
          reportedTo = site?.site_supervisor || supervisors[0]?.Emp_id || 'SUP-001';
        }

        const reportId = `RPT-${Math.floor(900 + Math.random() * 100)}`;
        const newReport: Report = {
          Report_id: reportId,
          Session_id: data.Session_id,
          User_id: activeEmp?.User_id || 'USR-001',
          site_id: data.site_id,
          Summary: data.Summary,
          Attachments: data.Attachments,
          Reported_by: activeEmpId,
          Reported_to: reportedTo,
          'date&time': new Date().toISOString(),
        };

        set((state) => ({ reports: [newReport, ...state.reports] }));
      },

      updateTaskStatus: (taskId, status) => {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.Task_id === taskId ? { ...t, Status: status } : t)),
        }));
      },

      toggleGlassesSession: (userEmpId, siteId) => {
        const now = new Date().toISOString();
        set((state) => {
          const existingActive = state.glasses.find(
            (g) => g.User_id === userEmpId && g.Logout_dt === null
          );
          if (existingActive) {
            return {
              glasses: state.glasses.map((g) =>
                g.Glasses_id === existingActive.Glasses_id ? { ...g, Logout_dt: now } : g
              ),
            };
          } else {
            const newSession: Glasses = {
              Glasses_id: `GLS-${Math.floor(1000 + Math.random() * 9000)}`,
              User_id: userEmpId,
              Site_id: siteId,
              Login_dt: now,
              Logout_dt: null,
            };
            return { glasses: [newSession, ...state.glasses] };
          }
        });
      },

      addGlassesDevice: (data) => {
        const newDevice: Glasses = {
          Glasses_id: data.Glasses_id,
          Site_id: data.Site_id,
          User_id: data.status === 'assigned' ? data.User_id || 'WRK-001' : 'Unassigned',
          Login_dt: new Date().toISOString(),
          Logout_dt: data.status === 'assigned' ? null : new Date().toISOString(),
        };
        set((state) => ({ glasses: [newDevice, ...state.glasses] }));
      },

      // Custom VLM / LLM Super Admin Query Processor
      queryVLM: (queryText: string) => {
        const { activeRoleId } = get();
        if (activeRoleId !== 1) {
          return {
            success: false,
            statusCode: 403,
            error: 'Forbidden: Custom VLM/LLM API inference is restricted exclusively to Super Admin accounts.',
          };
        }

        const clean = queryText.toLowerCase().trim();
        let summary = `VLM AI Synthesis for query "${queryText}": Analyzed 3 active sites, 5 smart glasses feeds, and 5 shift reports. Operational risk index is LOW (0.04). All highrise tie-downs verified.`;

        if (clean.includes('emergency') || clean.includes('danger')) {
          summary = `VLM Emergency Summary: 1 emergency recorded on SITE-101 (Sub-Level 2 conduit trip). Automatic breaker disengaged. All 14 site personnel evacuated in under 3 minutes. Zero casualties.`;
        } else if (clean.includes('crane') || clean.includes('machine') || clean.includes('failure')) {
          summary = `VLM Machine Diagnostic: Crane B hydraulic fluid seal degraded on SITE-101. Seal pressure dropped 14%. Maintenance dispatches initiated for replacement.`;
        } else if (clean.includes('worker') || clean.includes('mistake') || clean.includes('ppe')) {
          summary = `VLM Worker Compliance Analysis: 1 lanyard disengagement detected during scaffolding transition (Floor 6). Worker WRK-001 completed secondary tie-down within 4 seconds. Safety compliance rate: 98.6%.`;
        }

        return {
          success: true,
          statusCode: 200,
          data: summary,
        };
      },

      searchEmployees: (query: string) => {
        const clean = query.trim().toLowerCase().replace(/^@/, '');
        if (!clean) return [];

        const state = get();
        const results: EmployeeRecord[] = [];

        state.admins.forEach((a) => {
          if (
            a.Name.toLowerCase().includes(clean) ||
            a.Emp_id.toLowerCase().includes(clean) ||
            a.Admin_mail.toLowerCase().includes(clean)
          ) {
            results.push({ type: 'Admin', ...a });
          }
        });

        state.supervisors.forEach((s) => {
          if (
            s.Name.toLowerCase().includes(clean) ||
            s.Emp_id.toLowerCase().includes(clean) ||
            s['E-mail'].toLowerCase().includes(clean)
          ) {
            results.push({ type: 'Supervisor', ...s });
          }
        });

        state.siteManagers.forEach((m) => {
          if (
            m.Name.toLowerCase().includes(clean) ||
            m.Emp_id.toLowerCase().includes(clean) ||
            m['E-mail'].toLowerCase().includes(clean)
          ) {
            results.push({ type: 'Site Manager', ...m });
          }
        });

        state.fieldWorkers.forEach((w) => {
          if (
            w.Name.toLowerCase().includes(clean) ||
            w.Emp_id.toLowerCase().includes(clean) ||
            w['E-mail'].toLowerCase().includes(clean) ||
            w.Sub_Role.toLowerCase().includes(clean)
          ) {
            results.push({ type: 'Field Worker', ...w });
          }
        });

        return results;
      },

      getEmployeeByEmpId: (empId: string) => {
        const state = get();
        const adm = state.admins.find((a) => a.Emp_id === empId);
        if (adm) return { type: 'Admin', ...adm };

        const sup = state.supervisors.find((s) => s.Emp_id === empId);
        if (sup) return { type: 'Supervisor', ...sup };

        const mgr = state.siteManagers.find((m) => m.Emp_id === empId);
        if (mgr) return { type: 'Site Manager', ...mgr };

        const wrk = state.fieldWorkers.find((w) => w.Emp_id === empId);
        if (wrk) return { type: 'Field Worker', ...wrk };

        return null;
      },

      getSiteEmployeeCount: (siteId: string) => {
        const state = get();
        const site = state.sites.find((s) => s.Site_id === siteId);
        if (!site) return 0;
        let count = 0;
        if (site.Site_manager) count++;
        const workersOnSite = state.fieldWorkers.filter((w) => w.assigned_site_id === siteId);
        count += workersOnSite.length;
        return count;
      },

      getSiteGlassesCount: (siteId: string) => {
        const state = get();
        return state.glasses.filter((g) => g.Site_id === siteId && g.Logout_dt === null).length;
      },

      resetToDefaults: () => {
        set({
          roles: staticRoles,
          users: initialUsers,
          admins: initialAdmins,
          supervisors: initialSupervisors,
          siteManagers: initialSiteManagers,
          fieldWorkers: initialFieldWorkers,
          sites: initialSites,
          tasks: initialTasks,
          reports: initialReports,
          glasses: initialGlasses,
          vlmReports: initialVLMReports,
          activeEmpId: 'ADM-001',
          activeRoleId: 1,
        });
      },
    }),
    {
      name: 'sitelens-db-store',
    }
  )
);
