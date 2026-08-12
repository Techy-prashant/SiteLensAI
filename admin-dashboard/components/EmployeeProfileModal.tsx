'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { EmployeeRecord } from '@/lib/types';
import { useMockStore } from '@/lib/mock-store';
import { User, Mail, Phone, AlertTriangle, Briefcase, Glasses, Shield, CheckCircle2, Clock } from 'lucide-react';

interface EmployeeProfileModalProps {
  employee: EmployeeRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmployeeProfileModal({ employee, open, onOpenChange }: EmployeeProfileModalProps) {
  const { sites, tasks, glasses } = useMockStore();

  if (!employee) return null;

  // Managed sites for Supervisor
  const managedSites = sites.filter((s) => s.site_supervisor === employee.Emp_id);

  // Assigned site for Site Manager
  const assignedSite = sites.find((s) => s.Site_manager === employee.Emp_id);

  // Active tasks for Field Worker
  const activeTasks = tasks.filter(
    (t) => t.Assigned_to === employee.Emp_id && t.Status !== 'Completed'
  );

  // Active Glasses session for Field Worker
  const activeGlassesSession = glasses.find(
    (g) => g.User_id === employee.Emp_id && g.Logout_dt === null
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader className="border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
              {employee.Name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-lg font-bold">{employee.Name}</DialogTitle>
                <Badge variant={employee.type === 'Admin' ? 'destructive' : employee.type === 'Supervisor' ? 'default' : 'secondary'}>
                  {employee.type}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                Emp ID: <span className="text-foreground font-semibold">{employee.Emp_id}</span> | User ID: {employee.User_id}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-3 text-sm">
          {/* Admin Table Fields */}
          {employee.type === 'Admin' && (
            <div className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-secondary/30 p-3">
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" /> Admin Mail
                </p>
                <p className="font-medium text-foreground">{employee.Admin_mail}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" /> Admin Contact
                </p>
                <p className="font-medium text-foreground">{employee.Admin_contact}</p>
              </div>
            </div>
          )}

          {/* Supervisor Table Fields */}
          {employee.type === 'Supervisor' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-secondary/30 p-3">
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" /> E-mail
                  </p>
                  <p className="font-medium text-foreground">{employee['E-mail']}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" /> Contact
                  </p>
                  <p className="font-medium text-foreground">{employee.Contact}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> Emergency Contact
                  </p>
                  <p className="font-medium text-foreground">{employee.Emergency_contact}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" /> Experience
                  </p>
                  <p className="font-medium text-foreground">{employee.Experience}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1.5">Managed Sites ({managedSites.length})</p>
                {managedSites.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No sites assigned currently.</p>
                ) : (
                  <div className="space-y-1.5">
                    {managedSites.map((s) => (
                      <div key={s.Site_id} className="flex items-center justify-between rounded-md border border-border bg-card p-2 text-xs">
                        <span className="font-semibold text-foreground">{s.Site_id}</span>
                        <span className="text-muted-foreground truncate max-w-[260px]">{s.Site_Location}</span>
                        <span className="text-primary font-medium">{s.client_name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Site Manager Table Fields */}
          {employee.type === 'Site Manager' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-secondary/30 p-3">
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" /> E-mail
                  </p>
                  <p className="font-medium text-foreground">{employee['E-mail']}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" /> Contact
                  </p>
                  <p className="font-medium text-foreground">{employee.Contact}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> Emergency Contact
                  </p>
                  <p className="font-medium text-foreground">{employee.Emergency_contact}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Shield className="h-3.5 w-3.5 text-rose-500" /> Blood Group
                  </p>
                  <p className="font-bold text-foreground">{employee.Blood_Group}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1.5">Assigned Site</p>
                {assignedSite ? (
                  <div className="rounded-md border border-primary/30 bg-primary/5 p-2.5 text-xs">
                    <div className="flex items-center justify-between font-bold text-foreground">
                      <span>{assignedSite.Site_id}</span>
                      <span className="text-primary">{assignedSite.client_name}</span>
                    </div>
                    <p className="mt-1 text-muted-foreground">{assignedSite.Site_Location}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground/80 italic">{assignedSite.Site_Description}</p>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No site assigned currently.</p>
                )}
              </div>
            </div>
          )}

          {/* Field Worker Table Fields */}
          {employee.type === 'Field Worker' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-secondary/30 p-3">
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" /> E-mail
                  </p>
                  <p className="font-medium text-foreground">{employee['E-mail']}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" /> Contact
                  </p>
                  <p className="font-medium text-foreground">{employee.Contact}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> Emergency Contact
                  </p>
                  <p className="font-medium text-foreground">{employee.Emergency_contact}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Shield className="h-3.5 w-3.5 text-rose-500" /> Blood Group
                  </p>
                  <p className="font-bold text-foreground">{employee.Blood_Group}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5 text-primary" /> Sub Role
                  </p>
                  <p className="font-semibold text-primary">{employee.Sub_Role}</p>
                </div>
              </div>

              {/* Current Smart Glasses Session State */}
              <div className="rounded-md border border-border bg-card p-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold flex items-center gap-1.5">
                    <Glasses className="h-4 w-4 text-emerald-500" /> Smart Glasses Session State
                  </span>
                  {activeGlassesSession ? (
                    <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/30">
                      LIVE ONLINE ({activeGlassesSession.Glasses_id})
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      OFFLINE (No Active Session)
                    </Badge>
                  )}
                </div>
                {activeGlassesSession && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Logged in at: {new Date(activeGlassesSession.Login_dt).toLocaleTimeString()} on Site {activeGlassesSession.Site_id}
                  </p>
                )}
              </div>

              {/* Active Tasks */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1.5">Active Assigned Tasks ({activeTasks.length})</p>
                {activeTasks.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No active tasks pending.</p>
                ) : (
                  <div className="space-y-1.5">
                    {activeTasks.map((t) => (
                      <div key={t.Task_id} className="rounded-md border border-border bg-card p-2 text-xs space-y-1">
                        <div className="flex items-center justify-between font-semibold">
                          <span>{t.TaskName}</span>
                          <Badge variant="outline" className="text-[10px]">
                            {t.Status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{t.Task_description}</p>
                        <p className="text-[10px] text-muted-foreground/70">Due: {t.Due_date} | Site: {t.Site_id}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
