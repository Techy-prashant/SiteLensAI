export type RoleId = 1 | 2 | 3 | 4;

export type RoleName = 'Super Admin' | 'Supervisor' | 'Site Manager' | 'Field Worker';

export interface Role {
  Role_id: RoleId;
  Role: RoleName;
  Role_Description: string;
}

export interface User {
  User_id: string;
  Emp_id: string;
  Username: string;
  Password?: string;
  Role_id: RoleId;
}

export interface Admin {
  Emp_id: string;
  Name: string;
  User_id: string;
  Role_id: 1;
  Admin_mail: string;
  Admin_contact: string;
}

export interface Supervisor {
  Emp_id: string;
  User_id: string;
  Role_id: 2;
  Name: string;
  'E-mail': string;
  Contact: string;
  Emergency_contact: string;
  Experience: string;
}

export interface SiteManager {
  Emp_id: string;
  User_id: string;
  Role_id: 3;
  Name: string;
  'E-mail': string;
  Contact: string;
  Emergency_contact: string;
  Blood_Group: string;
}

export interface FieldWorker {
  Emp_id: string;
  User_id: string;
  Role_id: 4;
  Name: string;
  'E-mail': string;
  Contact: string;
  Emergency_contact: string;
  Blood_Group: string;
  Sub_Role: string;
  assigned_site_id?: string;
}

export interface Site {
  Site_id: string;
  Site_Location: string;
  Site_Description: string;
  client_name: string;
  Site_manager: string; // FK to SiteManager Emp_id
  site_supervisor: string; // FK to Supervisor Emp_id
  'No.of_employees'?: number; // Derived/Read-only
  'No._of_glasses_used'?: number; // Derived/Read-only
}

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Escalated';

export interface Task {
  Task_id: string;
  Site_id: string;
  Assigned_by: string; // FK to current User Emp_id
  Assigned_to: string; // FK to target Emp_id
  Due_date: string;
  Status: TaskStatus;
  TaskName: string;
  Task_description: string;
}

export interface Report {
  Report_id: string;
  Session_id: string;
  User_id: string;
  site_id: string;
  Summary: string;
  Attachments: string[];
  Reported_by: string; // FK Emp_id
  Reported_to: string; // FK Emp_id
  'date&time': string;
}

export interface Glasses {
  Glasses_id: string;
  User_id: string; // FK User_id or Emp_id
  Site_id: string;
  Login_dt: string;
  Logout_dt: string | null; // NULL means currently active
}

// Any employee union for search & mention cards
export type EmployeeRecord =
  | ({ type: 'Admin' } & Admin)
  | ({ type: 'Supervisor' } & Supervisor)
  | ({ type: 'Site Manager' } & SiteManager)
  | ({ type: 'Field Worker' } & FieldWorker);
