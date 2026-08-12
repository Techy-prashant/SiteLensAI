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
import { api } from '@/lib/api';

interface CreateFieldWorkerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FieldWorkerFormData {
  Emp_id: string;
  Name: string;
  'E-mail': string;
  Contact: string;
  Emergency_contact: string;
  Blood_Group: string;
  Sub_Role: string;
  Username: string;
  Password?: string;
}

export function CreateFieldWorkerModal({ open, onOpenChange }: CreateFieldWorkerModalProps) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FieldWorkerFormData>({
    defaultValues: {
      Emp_id: `WRK-${Math.floor(100 + Math.random() * 900)}`,
      Blood_Group: 'A+',
      Sub_Role: 'Scaffolding Specialist',
    },
  });

  const onSubmit = async (data: FieldWorkerFormData) => {
    try {
      await api.createFieldWorker(data);
      toast.success('Field Worker Created', {
        description: `${data.Name} (${data.Emp_id}) has been added successfully.`,
      });
      reset();
      onOpenChange(false);
    } catch (err) {
      toast.error('Failed to create field worker');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Field Worker</DialogTitle>
          <DialogDescription>
            Register a field worker with specialized sub-roles (e.g. Scaffolder, Electrician).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="Emp_id" className="text-xs font-semibold">Emp ID (PK)</Label>
              <Input
                id="Emp_id"
                {...register('Emp_id', { required: 'Emp ID is required' })}
                placeholder="WRK-005"
                className="h-9"
              />
              {errors.Emp_id && <p className="text-[11px] text-destructive">{errors.Emp_id.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="Name" className="text-xs font-semibold">Full Name</Label>
              <Input
                id="Name"
                {...register('Name', { required: 'Name is required' })}
                placeholder="Robert Chen"
                className="h-9"
              />
              {errors.Name && <p className="text-[11px] text-destructive">{errors.Name.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="E-mail" className="text-xs font-semibold">E-mail</Label>
              <Input
                id="E-mail"
                type="email"
                {...register('E-mail', { required: 'E-mail is required' })}
                placeholder="worker@sitelens.ai"
                className="h-9"
              />
              {errors['E-mail'] && <p className="text-[11px] text-destructive">{errors['E-mail']?.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="Contact" className="text-xs font-semibold">Contact</Label>
              <Input
                id="Contact"
                {...register('Contact', { required: 'Contact is required' })}
                placeholder="+1 (555) 000-0000"
                className="h-9"
              />
              {errors.Contact && <p className="text-[11px] text-destructive">{errors.Contact.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1 col-span-1">
              <Label htmlFor="Blood_Group" className="text-xs font-semibold">Blood Group</Label>
              <Input
                id="Blood_Group"
                {...register('Blood_Group', { required: 'Blood Group is required' })}
                placeholder="A+"
                className="h-9"
              />
              {errors.Blood_Group && <p className="text-[11px] text-destructive">{errors.Blood_Group.message}</p>}
            </div>
            <div className="space-y-1 col-span-2">
              <Label htmlFor="Sub_Role" className="text-xs font-semibold">Sub Role</Label>
              <Input
                id="Sub_Role"
                {...register('Sub_Role', { required: 'Sub Role is required' })}
                placeholder="Crane Inspector / Electrician"
                className="h-9"
              />
              {errors.Sub_Role && <p className="text-[11px] text-destructive">{errors.Sub_Role.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="Emergency_contact" className="text-xs font-semibold">Emergency Contact</Label>
            <Input
              id="Emergency_contact"
              {...register('Emergency_contact', { required: 'Emergency Contact is required' })}
              placeholder="+1 (555) 999-9999"
              className="h-9"
            />
            {errors.Emergency_contact && <p className="text-[11px] text-destructive">{errors.Emergency_contact.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border/40">
            <div className="space-y-1">
              <Label htmlFor="Username" className="text-xs font-semibold">Username</Label>
              <Input
                id="Username"
                {...register('Username', { required: 'Username is required' })}
                placeholder="rchen"
                className="h-9"
              />
              {errors.Username && <p className="text-[11px] text-destructive">{errors.Username.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="Password" className="text-xs font-semibold">Password</Label>
              <Input
                id="Password"
                type="password"
                {...register('Password', { required: 'Password is required' })}
                placeholder="••••••••"
                className="h-9"
              />
              {errors.Password && <p className="text-[11px] text-destructive">{errors.Password.message}</p>}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Field Worker'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
