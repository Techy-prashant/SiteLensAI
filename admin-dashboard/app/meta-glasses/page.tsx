'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Glasses, Plus, Search, Lock, User, Building, ShieldCheck } from 'lucide-react';
import { useMockStore } from '@/lib/mock-store';
import { Glasses as GlassesType } from '@/lib/types';
import { toast } from 'sonner';

interface AddGlassesFormData {
  Glasses_id: string;
  status: 'assigned' | 'unassigned';
  Site_id: string;
  User_id: string;
}

export default function MetaGlassesPage() {
  const {
    activeRoleId,
    glasses,
    sites,
    fieldWorkers,
    addGlassesDevice,
    getEmployeeByEmpId,
  } = useMockStore();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [selectedGlasses, setSelectedGlasses] = React.useState<GlassesType | null>(null);
  const [detailModalOpen, setDetailModalOpen] = React.useState(false);

  // Directive 4: Access Control - Super Admin (1) & Site Manager (3) ONLY
  const isAuthorized = activeRoleId === 1 || activeRoleId === 3;

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<AddGlassesFormData>({
    defaultValues: {
      Glasses_id: `GLS-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'unassigned',
      Site_id: sites[0]?.Site_id || 'SITE-101',
      User_id: fieldWorkers[0]?.Emp_id || 'WRK-001',
    },
  });

  const assignmentStatusWatch = watch('status');

  const onSubmitAdd = (data: AddGlassesFormData) => {
    addGlassesDevice(data);
    toast.success('Meta Glasses Provisioned', {
      description: `Device ${data.Glasses_id} created with status: ${data.status.toUpperCase()}.`,
    });
    reset();
    setAddModalOpen(false);
  };

  // Filtered devices by unified input: Device Name/ID OR Assigned Member Name
  const filteredDevices = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return glasses.filter((g) => {
      if (!q) return true;
      const worker = getEmployeeByEmpId(g.User_id);
      const workerName = worker ? worker.Name.toLowerCase() : '';
      return (
        g.Glasses_id.toLowerCase().includes(q) ||
        g.User_id.toLowerCase().includes(q) ||
        workerName.includes(q) ||
        g.Site_id.toLowerCase().includes(q)
      );
    });
  }, [glasses, searchQuery, getEmployeeByEmpId]);

  const handleRowClick = (device: GlassesType) => {
    setSelectedGlasses(device);
    setDetailModalOpen(true);
  };

  if (!isAuthorized) {
    return (
      <PageContainer title="Meta Glasses Management">
        <div className="mx-auto max-w-xl py-12">
          <Card className="border-destructive/40 bg-destructive/5 text-center p-8 space-y-4">
            <Lock className="mx-auto h-12 w-12 text-destructive" />
            <h2 className="text-xl font-bold text-destructive">Access Restricted (403 Forbidden)</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Meta Smart Glasses fleet hardware provisioning is accessible exclusively to <strong>Super Admin</strong> and <strong>Site Manager</strong> accounts.
            </p>
          </Card>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Meta Glasses Fleet Provisioning"
      description="Smart glasses hardware management, assignment, & telematics."
    >
      <div className="space-y-6">
        {/* Top Header Controls: Add Glasses Button (Top Left) & Search Interface */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
          <Button size="sm" onClick={() => setAddModalOpen(true)} className="font-semibold">
            <Plus className="mr-1.5 h-4 w-4" /> Add Glasses
          </Button>

          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Device ID or Member Name..."
              className="pl-9 h-9 text-xs"
            />
          </div>
        </div>

        {/* Clean Device Data Grid */}
        <Card className="border-border shadow-sm">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold">Smart Glasses Fleet Directory</CardTitle>
              <span className="text-xs text-muted-foreground font-mono">
                Showing {filteredDevices.length} of {glasses.length} Devices
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/40">
                  <TableHead className="text-xs font-bold uppercase">Meta Glass Device_ID</TableHead>
                  <TableHead className="text-xs font-bold uppercase">Assigned Worker_ID</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-right">Current Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevices.map((device) => {
                  const isAssigned = device.Logout_dt === null && device.User_id !== 'Unassigned';
                  const worker = getEmployeeByEmpId(device.User_id);

                  return (
                    <TableRow
                      key={device.Glasses_id}
                      onClick={() => handleRowClick(device)}
                      className={`cursor-pointer transition-colors ${
                        isAssigned
                          ? 'bg-emerald-500/5 hover:bg-emerald-500/10 border-l-2 border-l-emerald-500'
                          : 'hover:bg-secondary/40'
                      }`}
                    >
                      <TableCell className="font-mono font-bold text-primary text-xs">
                        <div className="flex items-center gap-2">
                          <Glasses className={`h-4 w-4 ${isAssigned ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                          <span>{device.Glasses_id}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-medium">
                        {isAssigned && worker ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-foreground">{worker.Name}</span>
                            <span className="font-mono text-muted-foreground">({device.User_id})</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground/70 italic">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {isAssigned ? (
                          <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30">
                            Assigned
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            Unassigned
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* ADD GLASSES MODAL                                              */}
      {/* ------------------------------------------------------------- */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>+ Add Meta Glasses</DialogTitle>
            <DialogDescription>
              Provision a smart glasses device to a site or worker.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmitAdd)} className="space-y-3 py-2">
            <div className="space-y-1">
              <Label htmlFor="Glasses_id" className="text-xs font-semibold">Device ID</Label>
              <Input
                id="Glasses_id"
                {...register('Glasses_id', { required: 'Device ID is required' })}
                placeholder="GLS-1005"
                className="h-9 font-mono"
              />
              {errors.Glasses_id && <p className="text-[11px] text-destructive">{errors.Glasses_id.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="status" className="text-xs font-semibold">Assignment Status</Label>
              <select
                id="status"
                {...register('status')}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
              >
                <option value="unassigned">Unassigned</option>
                <option value="assigned">Assigned</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="Site_id" className="text-xs font-semibold">Assigned Site ID</Label>
              <select
                id="Site_id"
                {...register('Site_id')}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
              >
                {sites.map((s) => (
                  <option key={s.Site_id} value={s.Site_id}>
                    {s.Site_id} - {s.client_name}
                  </option>
                ))}
              </select>
            </div>

            {assignmentStatusWatch === 'assigned' && (
              <div className="space-y-1">
                <Label htmlFor="User_id" className="text-xs font-semibold">Assigned Worker ID</Label>
                <select
                  id="User_id"
                  {...register('User_id')}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                >
                  {fieldWorkers.map((w) => (
                    <option key={w.Emp_id} value={w.Emp_id}>
                      {w.Name} ({w.Emp_id}) - {w.Sub_Role}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Add Glasses
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ------------------------------------------------------------- */}
      {/* DEVICE DETAIL POPUP MODAL                                     */}
      {/* ------------------------------------------------------------- */}
      {selectedGlasses && (
        <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Glasses className="h-5 w-5 text-primary" />
                <DialogTitle className="font-mono text-lg font-bold">{selectedGlasses.Glasses_id}</DialogTitle>
              </div>
              <DialogDescription>
                Relational worker and site assignment telemetry.
              </DialogDescription>
            </DialogHeader>

            {(() => {
              const isAssigned = selectedGlasses.Logout_dt === null && selectedGlasses.User_id !== 'Unassigned';
              const worker = getEmployeeByEmpId(selectedGlasses.User_id);
              const site = sites.find((s) => s.Site_id === selectedGlasses.Site_id);

              return (
                <div className="space-y-3 py-2 text-xs">
                  <div className="rounded-lg border border-border bg-secondary/40 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-muted-foreground">Status:</span>
                      {isAssigned ? (
                        <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30">
                          ASSIGNED (LIVE ONLINE)
                        </Badge>
                      ) : (
                        <Badge variant="outline">UNASSIGNED</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between font-mono">
                      <span>Login Timestamp:</span>
                      <span>{new Date(selectedGlasses.Login_dt).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Assigned Worker Info */}
                  <div className="rounded-lg border border-border p-3 space-y-1">
                    <p className="font-bold text-muted-foreground uppercase flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-blue-500" /> Assigned Worker Information
                    </p>
                    {isAssigned && worker ? (
                      <div className="pt-1 space-y-0.5 font-medium">
                        <p className="text-sm font-bold text-foreground">{worker.Name} ({worker.Emp_id})</p>
                        <p className="text-muted-foreground">
                          Contact: {'Admin_mail' in worker ? worker.Admin_mail : worker['E-mail']} | {'Admin_contact' in worker ? worker.Admin_contact : worker.Contact}
                        </p>
                        {'Sub_Role' in worker && <p className="text-primary">Sub Role: {worker.Sub_Role}</p>}
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic pt-1">No worker assigned to this device.</p>
                    )}
                  </div>

                  {/* Assigned Site Info */}
                  <div className="rounded-lg border border-border p-3 space-y-1">
                    <p className="font-bold text-muted-foreground uppercase flex items-center gap-1">
                      <Building className="h-3.5 w-3.5 text-amber-500" /> Assigned Site Information
                    </p>
                    {site ? (
                      <div className="pt-1 space-y-0.5 font-medium">
                        <p className="text-sm font-bold text-foreground">{site.Site_id} - {site.client_name}</p>
                        <p className="text-muted-foreground">{site.Site_Location}</p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic pt-1">Site SITE-101</p>
                    )}
                  </div>
                </div>
              );
            })()}
          </DialogContent>
        </Dialog>
      )}
    </PageContainer>
  );
}
