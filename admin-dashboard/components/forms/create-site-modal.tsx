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
import { useMockStore } from '@/lib/mock-store';
import { api } from '@/lib/api';

interface CreateSiteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SiteFormData {
  Site_Location: string;
  Site_Description: string;
  client_name: string;
  Site_manager: string;
  site_supervisor: string;
}

export function CreateSiteModal({ open, onOpenChange }: CreateSiteModalProps) {
  const { supervisors, siteManagers } = useMockStore();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<SiteFormData>({
    defaultValues: {
      Site_manager: siteManagers[0]?.Emp_id || '',
      site_supervisor: supervisors[0]?.Emp_id || '',
    },
  });

  const onSubmit = async (data: SiteFormData) => {
    try {
      await api.createSite(data);
      toast.success('Site Created', {
        description: `New site at ${data.Site_Location} added successfully. Derived metrics will auto-calculate.`,
      });
      reset();
      onOpenChange(false);
    } catch (err) {
      toast.error('Failed to create site');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Construction Site</DialogTitle>
          <DialogDescription>
            Register a new site. Employee &amp; smart glass counts are derived automatically.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 py-2">
          <div className="space-y-1">
            <Label htmlFor="Site_Location" className="text-xs font-semibold">Site Location</Label>
            <Input
              id="Site_Location"
              {...register('Site_Location', { required: 'Site Location is required' })}
              placeholder="Sector 4, Innovation Park, Austin TX"
              className="h-9"
            />
            {errors.Site_Location && <p className="text-[11px] text-destructive">{errors.Site_Location.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="Site_Description" className="text-xs font-semibold">Site Description</Label>
            <Input
              id="Site_Description"
              {...register('Site_Description', { required: 'Description is required' })}
              placeholder="14-Story Commercial Highrise Construction"
              className="h-9"
            />
            {errors.Site_Description && <p className="text-[11px] text-destructive">{errors.Site_Description.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="client_name" className="text-xs font-semibold">Client Name</Label>
            <Input
              id="client_name"
              {...register('client_name', { required: 'Client Name is required' })}
              placeholder="Apex Global Infrastructure"
              className="h-9"
            />
            {errors.client_name && <p className="text-[11px] text-destructive">{errors.client_name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="site_supervisor" className="text-xs font-semibold">Site Supervisor (FK)</Label>
              <select
                id="site_supervisor"
                {...register('site_supervisor', { required: 'Supervisor is required' })}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {supervisors.map((s) => (
                  <option key={s.Emp_id} value={s.Emp_id}>
                    {s.Name} ({s.Emp_id})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="Site_manager" className="text-xs font-semibold">Site Manager (FK)</Label>
              <select
                id="Site_manager"
                {...register('Site_manager', { required: 'Site Manager is required' })}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {siteManagers.map((m) => (
                  <option key={m.Emp_id} value={m.Emp_id}>
                    {m.Name} ({m.Emp_id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-md bg-secondary/50 p-2.5 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Derived Read-Only Metrics:</p>
            <ul className="mt-1 list-disc pl-4 space-y-0.5">
              <li><strong className="text-foreground">No.of_employees</strong>: Computed dynamically from assigned staff.</li>
              <li><strong className="text-foreground">No._of_glasses_used</strong>: Computed from active smart glasses sessions.</li>
            </ul>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Site'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
