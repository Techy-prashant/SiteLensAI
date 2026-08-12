'use client';

import * as React from 'react';
import { Server, Database, Cloud, Cpu, HardDrive, Activity, RefreshCw, Save, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useMockStore } from '@/lib/mock-store';

import { cn } from '@/lib/utils';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { StatusPill } from '@/components/ui/status-pill';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function SystemMetric({ label, value, sublabel, percent }: { label: string; value: string; sublabel: string; percent: number }) {
  return (
    <Card className="relative overflow-hidden border-border shadow-none">
      <div className="absolute left-0 top-0 h-full w-0.5 bg-primary/20" />
      <CardContent className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{sublabel}</p>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
        </div>
      </CardContent>
    </Card>
  );
}

function ToggleRow({ label, description, defaultChecked }: { label: string; description: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch defaultChecked={defaultChecked} onCheckedChange={(val) => {
        toast.info('Setting Updated', { description: `${label} set to ${val ? 'Enabled' : 'Disabled'}.` });
      }} />
    </div>
  );
}

export default function SystemConfigurationPage() {
  const { activeRoleId } = useMockStore();
  const [running, setRunning] = React.useState(false);

  if (activeRoleId !== 1) {
    return (
      <PageContainer
        title="System Configuration"
        description="Platform-wide system settings, performance, and maintenance."
      >
        <Card className="border-destructive/30 bg-destructive/5 p-8 text-center shadow-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
            <Lock className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-bold text-foreground mb-2">Access Restricted (403)</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Platform-wide system configuration settings are strictly restricted to Super Admin accounts only.
          </p>
        </Card>
      </PageContainer>
    );
  }

  function handleDiagnostics() {
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      toast.success('System Diagnostics Complete', {
        description: 'All 6 critical subsystems and API gateways are 100% operational.',
      });
    }, 750);
  }

  function handleSaveConfig() {
    toast.success('System Configuration Saved', {
      description: 'Platform settings and data retention policies updated.',
    });
  }

  return (
    <PageContainer
      title="System Configuration"
      description="Platform-wide system settings, performance, and maintenance."
      actions={
        <>
          <Button variant="outline" size="sm" onClick={handleDiagnostics} disabled={running}>
            <RefreshCw className={cn('mr-2 h-3.5 w-3.5', running && 'animate-spin')} />
            {running ? 'Running…' : 'Run Diagnostics'}
          </Button>
          <Button size="sm" onClick={handleSaveConfig}>
            <Save className="mr-2 h-3.5 w-3.5" />
            Save Config
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* System Health */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">System Health</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <SystemMetric label="CPU Usage" value="34%" sublabel="8 cores · 2.7 GHz" percent={34} />
            <SystemMetric label="Memory" value="1.2 GB" sublabel="of 4.0 GB allocated" percent={30} />
            <SystemMetric label="Storage" value="14.2 GB" sublabel="of 32.0 GB used" percent={44} />
            <SystemMetric label="Uptime" value="99.98%" sublabel="Last 30 days" percent={99} />
          </div>
        </div>

        {/* Platform Settings */}
        <Card className="border-border shadow-none">
          <CardContent className="p-6">
            <h3 className="mb-1 text-sm font-semibold text-foreground">Platform Settings</h3>
            <p className="mb-4 text-xs text-muted-foreground">Core system behavior and feature toggles</p>
            <ToggleRow label="Real-time safety monitoring" description="Enable live PPE and zone violation detection across all sites" defaultChecked />
            <Separator />
            <ToggleRow label="Auto-sync devices" description="Automatically sync smart glasses data every 5 minutes" defaultChecked />
            <Separator />
            <ToggleRow label="Emergency auto-broadcast" description="Send emergency alerts to all site managers automatically" defaultChecked />
            <Separator />
            <ToggleRow label="Maintenance mode" description="Temporarily restrict access to non-admin users during maintenance" />
            <Separator />
            <ToggleRow label="Beta features" description="Enable early-access features and experimental modules" />
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card className="border-border shadow-none">
          <CardContent className="p-6">
            <h3 className="mb-1 text-sm font-semibold text-foreground">Data Retention</h3>
            <p className="mb-4 text-xs text-muted-foreground">Configure how long system data is stored</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label>Incident Records</Label>
                <Select defaultValue="365">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="730">2 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Device Telemetry</Label>
                <Select defaultValue="90">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Audit Logs</Label>
                <Select defaultValue="730">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="730">2 years</SelectItem>
                    <SelectItem value="forever">Indefinitely</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integrations Status */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Integration Status</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'Meta Glasses SDK', icon: Cpu, status: 'Operational' },
              { name: 'Cloud Storage', icon: Cloud, status: 'Operational' },
              { name: 'Database Cluster', icon: Database, status: 'Operational' },
              { name: 'API Gateway', icon: Server, status: 'Operational' },
              { name: 'File Storage', icon: HardDrive, status: 'Degraded' },
              { name: 'Realtime Engine', icon: Activity, status: 'Operational' },
            ].map((svc) => (
              <Card key={svc.name} className="border-border shadow-none">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-border bg-secondary">
                      <svc.icon className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-foreground">{svc.name}</p>
                  </div>
                  <StatusPill variant={svc.status === 'Operational' ? 'success' : 'warning'} size="sm">
                    {svc.status}
                  </StatusPill>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
