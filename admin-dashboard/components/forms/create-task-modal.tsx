'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
import { Textarea } from '@/components/ui/textarea';
import { useMockStore } from '@/lib/mock-store';
import { api } from '@/lib/api';

interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TaskFormData {
  Site_id: string;
  Assigned_to: string;
  Due_date: string;
  TaskName: string;
  Task_description: string;
}

export function CreateTaskModal({ open, onOpenChange }: CreateTaskModalProps) {
  const { sites, activeEmpId, siteManagers, fieldWorkers, supervisors } = useMockStore();

  // Combine assignable targets (Supervisors can assign Managers & Workers; Managers can assign Workers)
  const assignableEmployees = React.useMemo(() => {
    const list: { empId: string; label: string }[] = [];
    siteManagers.forEach((m) => list.push({ empId: m.Emp_id, label: `Site Mgr: ${m.Name} (${m.Emp_id})` }));
    fieldWorkers.forEach((w) => list.push({ empId: w.Emp_id, label: `Worker: ${w.Name} (${w.Emp_id}) - ${w.Sub_Role}` }));
    supervisors.forEach((s) => list.push({ empId: s.Emp_id, label: `Supervisor: ${s.Name} (${s.Emp_id})` }));
    return list;
  }, [siteManagers, fieldWorkers, supervisors]);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TaskFormData>({
    defaultValues: {
      Site_id: sites[0]?.Site_id || '',
      Assigned_to: assignableEmployees[0]?.empId || '',
      Due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      await api.createTask(data);
      toast.success('Task Created & Assigned', {
        description: `Task "${data.TaskName}" assigned to ${data.Assigned_to}. Default status: Pending.`,
      });
      reset();
      onOpenChange(false);
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign New Task</DialogTitle>
          <DialogDescription>
            Assigned by: <strong className="text-foreground">{activeEmpId}</strong>. Status auto-defaults to <span className="font-semibold text-amber-500">Pending</span>.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 py-2">
          <div className="space-y-1">
            <Label htmlFor="TaskName" className="text-xs font-semibold">Task Name</Label>
            <Input
              id="TaskName"
              {...register('TaskName', { required: 'Task Name is required' })}
              placeholder="Scaffolding Anchorage Audit Floor 4"
              className="h-9"
            />
            {errors.TaskName && <p className="text-[11px] text-destructive">{errors.TaskName.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="Site_id" className="text-xs font-semibold">Site (FK)</Label>
              <select
                id="Site_id"
                {...register('Site_id', { required: 'Site is required' })}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {sites.map((s) => (
                  <option key={s.Site_id} value={s.Site_id}>
                    {s.Site_id} - {s.client_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="Assigned_to" className="text-xs font-semibold">Assigned To (FK)</Label>
              <select
                id="Assigned_to"
                {...register('Assigned_to', { required: 'Assignee is required' })}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {assignableEmployees.map((e) => (
                  <option key={e.empId} value={e.empId}>
                    {e.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="Due_date" className="text-xs font-semibold">Due Date</Label>
            <Input
              id="Due_date"
              type="date"
              {...register('Due_date', { required: 'Due date is required' })}
              className="h-9"
            />
            {errors.Due_date && <p className="text-[11px] text-destructive">{errors.Due_date.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="Task_description" className="text-xs font-semibold">Task Description</Label>
            <Textarea
              id="Task_description"
              {...register('Task_description', { required: 'Description is required' })}
              placeholder="Provide clear step-by-step instructions or safety guidelines..."
              rows={3}
              className="text-sm"
            />
            {errors.Task_description && <p className="text-[11px] text-destructive">{errors.Task_description.message}</p>}
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? 'Assigning...' : 'Assign Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
