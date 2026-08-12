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

interface CreateSupervisorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SupervisorFormData {
  Emp_id: string;
  Name: string;
  'E-mail': string;
  Contact: string;
  Emergency_contact: string;
  Experience: string;
  Username: string;
  Password?: string;
}

export function CreateSupervisorModal({ open, onOpenChange }: CreateSupervisorModalProps) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<SupervisorFormData>({
    defaultValues: {
      Emp_id: `SUP-${Math.floor(100 + Math.random() * 900)}`,
    },
  });

  const onSubmit = async (data: SupervisorFormData) => {
    try {
      await api.createSupervisor(data);
      toast.success('Supervisor Created', {
        description: `${data.Name} (${data.Emp_id}) has been added successfully.`,
      });
      reset();
      onOpenChange(false);
    } catch (err) {
      toast.error('Failed to create supervisor');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Supervisor</DialogTitle>
          <DialogDescription>
            Register a new site supervisor to manage multi-site safety operations.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="Emp_id" className="text-xs font-semibold">Emp ID (PK)</Label>
              <Input
                id="Emp_id"
                {...register('Emp_id', { required: 'Emp ID is required' })}
                placeholder="SUP-003"
                className="h-9"
              />
              {errors.Emp_id && <p className="text-[11px] text-destructive">{errors.Emp_id.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="Name" className="text-xs font-semibold">Full Name</Label>
              <Input
                id="Name"
                {...register('Name', { required: 'Name is required' })}
                placeholder="Marcus Vance"
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
                placeholder="supervisor@sitelens.ai"
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

          <div className="grid grid-cols-2 gap-3">
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
            <div className="space-y-1">
              <Label htmlFor="Experience" className="text-xs font-semibold">Experience</Label>
              <Input
                id="Experience"
                {...register('Experience', { required: 'Experience is required' })}
                placeholder="10 Years Infrastructure"
                className="h-9"
              />
              {errors.Experience && <p className="text-[11px] text-destructive">{errors.Experience.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border/40">
            <div className="space-y-1">
              <Label htmlFor="Username" className="text-xs font-semibold">Username</Label>
              <Input
                id="Username"
                {...register('Username', { required: 'Username is required' })}
                placeholder="mvance"
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
              {isSubmitting ? 'Creating...' : 'Create Supervisor'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
