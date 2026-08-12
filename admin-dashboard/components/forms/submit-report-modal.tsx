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

interface SubmitReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ReportFormData {
  Session_id: string;
  site_id: string;
  Summary: string;
  AttachmentsInput: string;
}

export function SubmitReportModal({ open, onOpenChange }: SubmitReportModalProps) {
  const { sites, activeEmpId } = useMockStore();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ReportFormData>({
    defaultValues: {
      Session_id: `SESS-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`,
      site_id: sites[0]?.Site_id || '',
      Summary: '',
      AttachmentsInput: '',
    },
  });

  const onSubmit = async (data: ReportFormData) => {
    try {
      const attachments = data.AttachmentsInput
        ? data.AttachmentsInput.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      await api.submitReport({
        Session_id: data.Session_id,
        site_id: data.site_id,
        Summary: data.Summary,
        Attachments: attachments,
      });

      toast.success('Report Submitted', {
        description: `End-of-day AI report filed for ${data.site_id}. Superior notified automatically.`,
      });
      reset();
      onOpenChange(false);
    } catch (err) {
      toast.error('Failed to submit report');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Submit End-of-Day Site Report</DialogTitle>
          <DialogDescription>
            File shift summary &amp; smart glasses telemetry report.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="Session_id" className="text-xs font-semibold">Session ID</Label>
              <Input
                id="Session_id"
                {...register('Session_id', { required: 'Session ID is required' })}
                placeholder="SESS-2026-0808"
                className="h-9"
              />
              {errors.Session_id && <p className="text-[11px] text-destructive">{errors.Session_id.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="site_id" className="text-xs font-semibold">Site (FK)</Label>
              <select
                id="site_id"
                {...register('site_id', { required: 'Site is required' })}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {sites.map((s) => (
                  <option key={s.Site_id} value={s.Site_id}>
                    {s.Site_id} ({s.Site_Location.slice(0, 25)}...)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="Summary" className="text-xs font-semibold">Shift Summary &amp; AI Safety Audit</Label>
            <Textarea
              id="Summary"
              {...register('Summary', { required: 'Summary is required' })}
              placeholder="Detail shift observations, PPE compliance percentage, or any safety incidents..."
              rows={4}
              className="text-sm"
            />
            {errors.Summary && <p className="text-[11px] text-destructive">{errors.Summary.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="AttachmentsInput" className="text-xs font-semibold">
              Attachments (Comma-separated Image/File URLs)
            </Label>
            <Input
              id="AttachmentsInput"
              {...register('AttachmentsInput')}
              placeholder="https://example.com/photo1.jpg, https://example.com/log.pdf"
              className="h-9"
            />
          </div>

          <div className="rounded-md bg-secondary/50 p-2.5 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Auto-Populated Database Metadata:</p>
            <ul className="mt-1 list-disc pl-4 space-y-0.5">
              <li><strong className="text-foreground">Reported_by</strong>: {activeEmpId} (Logged-in user)</li>
              <li><strong className="text-foreground">Reported_to</strong>: Hierarchy superior (Auto-assigned)</li>
              <li><strong className="text-foreground">date&amp;time</strong>: Current timestamp ISO</li>
            </ul>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
