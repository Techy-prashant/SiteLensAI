'use client';

import * as React from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  departments,
  roleOptions,
  siteLocations,
  accessLevelOptions,
  type Employee,
  type AccessLevel,
  type EmployeeStatus,
} from '@/lib/employees-data';

export interface EmployeeFormData {
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  assignedSite: string;
  accessLevel: AccessLevel;
  status: EmployeeStatus;
  smartGlasses: string;
  todayShift: string;
  emergencyContact: string;
  emergencyPhone: string;
}

interface EmployeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit';
  employee: Employee | null;
  onSubmit: (data: EmployeeFormData, id?: string) => void;
}

const defaultForm: EmployeeFormData = {
  name: '',
  email: '',
  phone: '',
  role: roleOptions[0],
  department: departments[0],
  assignedSite: siteLocations[0],
  accessLevel: 'worker',
  status: 'off-site',
  smartGlasses: 'None',
  todayShift: '08:00 - 16:30',
  emergencyContact: '',
  emergencyPhone: '',
};

export function EmployeeFormDialog({
  open,
  onOpenChange,
  mode,
  employee,
  onSubmit,
}: EmployeeFormDialogProps) {
  const [form, setForm] = React.useState<EmployeeFormData>(defaultForm);

  React.useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        role: employee.role,
        department: employee.department,
        assignedSite: employee.assignedSite,
        accessLevel: employee.accessLevel,
        status: employee.status,
        smartGlasses: employee.smartGlasses,
        todayShift: employee.todayShift,
        emergencyContact: employee.emergencyContact,
        emergencyPhone: employee.emergencyPhone,
      });
    } else {
      setForm(defaultForm);
    }
  }, [employee, open]);

  function update<K extends keyof EmployeeFormData>(key: K, value: EmployeeFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form, employee?.id);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add New Employee' : `Edit ${employee?.name ?? 'Employee'}`}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add'
              ? 'Create a new employee record in the workforce directory.'
              : 'Update employee information and assignment details.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Information */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Personal Information</h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="emp-name">Full Name</Label>
                <Input id="emp-name" value={form.name} onChange={(e) => update('name', e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="emp-email">Email</Label>
                <Input id="emp-email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="emp-phone">Phone</Label>
                <Input id="emp-phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="emp-shift">Today's Shift</Label>
                <Input id="emp-shift" value={form.todayShift} onChange={(e) => update('todayShift', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Department & Role */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Department &amp; Role</h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Department</Label>
                <Select value={form.department} onValueChange={(v) => update('department', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select value={form.role} onValueChange={(v) => update('role', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Assigned Site</Label>
                <Select value={form.assignedSite} onValueChange={(v) => update('assignedSite', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {siteLocations.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Employment Status</Label>
                <Select value={form.status} onValueChange={(v) => update('status', v as EmployeeStatus)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on-site">On Site</SelectItem>
                    <SelectItem value="off-site">Off Site</SelectItem>
                    <SelectItem value="on-leave">On Leave</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="emergency">Emergency Response</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Access & Glasses */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Access &amp; Device</h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Access Level</Label>
                <Select value={form.accessLevel} onValueChange={(v) => update('accessLevel', v as AccessLevel)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {accessLevelOptions.map((a) => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="emp-glasses">Smart Glasses ID</Label>
                <Input id="emp-glasses" value={form.smartGlasses} onChange={(e) => update('smartGlasses', e.target.value)} placeholder="MG-XXX or None" />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Emergency Contact</h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="emp-emg-name">Contact Name</Label>
                <Input id="emp-emg-name" value={form.emergencyContact} onChange={(e) => update('emergencyContact', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="emp-emg-phone">Contact Phone</Label>
                <Input id="emp-emg-phone" value={form.emergencyPhone} onChange={(e) => update('emergencyPhone', e.target.value)} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'add' ? 'Add Employee' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
