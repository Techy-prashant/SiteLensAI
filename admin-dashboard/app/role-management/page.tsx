'use client';

import * as React from 'react';
import { Plus, MoreHorizontal, ShieldHalf, Users, Check, X, Lock } from 'lucide-react';
import { useMockStore } from '@/lib/mock-store';

import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusPill } from '@/components/ui/status-pill';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { showComingSoonToast } from '@/lib/utils';
import { roles, permissions } from '@/lib/settings-data';

const allModules = Array.from(new Set(permissions.map((p) => p.module)));

export default function RoleManagementPage() {
  const { activeRoleId } = useMockStore();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState(roles[0]);

  if (activeRoleId !== 1) {
    return (
      <PageContainer
        title="Role Management"
        description="Create, edit, and assign user roles with granular permissions."
      >
        <Card className="border-destructive/30 bg-destructive/5 p-8 text-center shadow-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
            <Lock className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-bold text-foreground mb-2">Access Restricted (403)</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Role creation and authority management are strictly restricted to Super Admin accounts only.
          </p>
        </Card>
      </PageContainer>
    );
  }

  function handleSavePermissions() {
    toast.success('Permissions Saved', {
      description: `Updated access permissions for ${selectedRole.name}.`,
    });
  }

  function handleCreateRole() {
    setDialogOpen(false);
    toast.success('Role Created', {
      description: 'New custom role added to workspace permissions matrix.',
    });
  }

  return (
    <PageContainer
      title="Role Management"
      description="Create, edit, and assign user roles with granular permissions."
      actions={
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-3.5 w-3.5" />
          Create Role
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Role list */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Roles</h2>
          {roles.map((role) => (
            <Card
              key={role.id}
              className={
                'cursor-pointer border-border shadow-none transition-colors ' +
                (selectedRole.id === role.id ? 'border-primary/40 bg-primary/5' : 'hover:bg-secondary/30')
              }
              onClick={() => setSelectedRole(role)}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <ShieldHalf className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium text-foreground">{role.name}</p>
                  </div>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{role.description}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{role.userCount}</span>
                    <span>{role.permissions} permissions</span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-muted-foreground" onClick={(e) => e.stopPropagation()}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => showComingSoonToast('Edit Role')}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => showComingSoonToast('Duplicate Role')}>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => showComingSoonToast('Delete Role')} className="text-destructive focus:text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Permission matrix */}
        <div className="lg:col-span-2">
          <Card className="border-border shadow-none">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {selectedRole.name} — Permissions
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Toggle individual permissions for this role
                  </p>
                </div>
                <StatusPill variant={selectedRole.color} size="md" dot={false}>
                  {selectedRole.name}
                </StatusPill>
              </div>

              {allModules.map((module) => (
                <div key={module} className="mb-4">
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {module}
                  </h4>
                  <div className="space-y-1">
                    {permissions
                      .filter((p) => p.module === module)
                      .map((p) => {
                        const enabled = p.roles.includes(selectedRole.name);
                        return (
                          <div key={p.id} className="flex items-center justify-between gap-4 py-2">
                            <div className="flex items-center gap-2">
                              {enabled ? (
                                <Check className="h-4 w-4 text-success" />
                              ) : (
                                <X className="h-4 w-4 text-muted-foreground/40" />
                              )}
                              <span className="text-sm text-foreground">{p.action}</span>
                            </div>
                            <Switch defaultChecked={enabled} onCheckedChange={(val) => {
                              toast.success('Permission Changed', {
                                description: `${p.action} ${val ? 'enabled' : 'disabled'} for ${selectedRole.name}.`,
                              });
                            }} />
                          </div>
                        );
                      })}
                  </div>
                  <Separator className="mt-2" />
                </div>
              ))}

              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => {
                  toast.info('Permissions Reset', { description: 'Restored default settings for ' + selectedRole.name });
                }}>Reset</Button>
                <Button size="sm" onClick={handleSavePermissions}>Save Permissions</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Role Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Define a new role with a custom set of permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="role-name">Role Name</Label>
              <Input id="role-name" placeholder="e.g. Safety Inspector" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role-desc">Description</Label>
              <Input id="role-desc" placeholder="Brief description of this role" />
            </div>
            <div className="space-y-1.5">
              <Label>Base Role</Label>
              <Select defaultValue="worker">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.name.toLowerCase().replace(/\s+/g, '-')}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateRole}>Create Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
