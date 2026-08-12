'use client';

import * as React from 'react';
import {
  Bell,
  Palette,
  Globe,
  Clock,
  Lock,
  Type,
  Sparkles,
  Check,
  Sliders,
  Layout,
  Maximize2,
  Minimize2,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useUIStore, accentColors, fontSizes } from '@/lib/stores/ui-store';

function SettingsCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-border shadow-none">
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

function ToggleRow({
  label,
  description,
  defaultChecked,
}: {
  label: string;
  description: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = React.useState(defaultChecked ?? false);
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={setChecked} />
    </div>
  );
}

export default function SettingsPage() {
  const {
    accentColor,
    setAccentColor,
    fontSize,
    setFontSize,
    sidebarStyle,
    setSidebarStyle,
    compactMode,
    setCompactMode,
    contentWidth,
    setContentWidth,
    cornerStyle,
    setCornerStyle,
    density,
    setDensity,
  } = useUIStore();

  return (
    <PageContainer
      title="Settings"
      description="Manage your workspace preferences and notifications."
    >
      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="h-auto flex-wrap gap-1 bg-secondary/50 p-1">
          <TabsTrigger value="notifications" className="gap-1.5 text-xs"><Bell className="h-3.5 w-3.5" />Notifications</TabsTrigger>
          <TabsTrigger value="appearance" className="gap-1.5 text-xs"><Palette className="h-3.5 w-3.5" />Appearance</TabsTrigger>
          <TabsTrigger value="language" className="gap-1.5 text-xs"><Globe className="h-3.5 w-3.5" />Language</TabsTrigger>
          <TabsTrigger value="datetime" className="gap-1.5 text-xs"><Clock className="h-3.5 w-3.5" />Date &amp; Time</TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5 text-xs"><Lock className="h-3.5 w-3.5" />Security</TabsTrigger>
        </TabsList>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <SettingsCard title="Notification Preferences" description="Choose how and when you receive alerts">
            <div className="space-y-1">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Emergency Alerts</h4>
              <ToggleRow label="Helmet violations" description="Real-time alerts when a worker is detected without a helmet" defaultChecked />
              <ToggleRow label="Fall detection" description="Immediate notification when fall detection triggers" defaultChecked />
              <ToggleRow label="Restricted zone entry" description="Alert when a worker enters a restricted zone" defaultChecked />
            </div>
            <Separator className="my-2" />
            <div className="space-y-1">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Device Alerts</h4>
              <ToggleRow label="Battery warnings" description="Notify when a device drops below 15% battery" defaultChecked />
              <ToggleRow label="Device offline" description="Alert when a device loses connection" defaultChecked />
              <ToggleRow label="Firmware updates" description="Notify when firmware updates are available" />
            </div>
            <Separator className="my-2" />
            <div className="space-y-1">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Reports &amp; Inspections</h4>
              <ToggleRow label="Report approvals" description="Notify when a report is approved or rejected" defaultChecked />
              <ToggleRow label="Inspection completions" description="Notify when an inspection is completed" />
              <ToggleRow label="Daily summary email" description="Receive a daily summary at end of shift" defaultChecked />
            </div>
            <div className="mt-4 flex justify-end">
              <Button size="sm" onClick={() => toast.success('Notification Preferences Saved', { description: 'Alert channels and threshold settings updated.' })}>Save Preferences</Button>
            </div>
          </SettingsCard>
        </TabsContent>

        {/* Appearance / Theme Customization */}
        <TabsContent value="appearance" className="space-y-6">
          <SettingsCard title="Theme Customization" description="Personalize the look, feel, typography, and layout of your workspace.">
            <div className="space-y-6">
              {/* 1. Font Size Customization */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Type className="h-4 w-4 text-primary" /> Overall Typography Font Size
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Dynamically scale the font size across all pages, navigation, and workspace components.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                    {fontSize.toUpperCase()} ({fontSizes.find((f) => f.value === fontSize)?.px})
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {fontSizes.map((f) => {
                    const active = fontSize === f.value;
                    return (
                      <button
                        key={f.value}
                        type="button"
                        onClick={() => {
                          setFontSize(f.value);
                          toast.success('Font Size Updated', {
                            description: `Overall workspace typography set to ${f.label} (${f.px}).`,
                          });
                        }}
                        className={cn(
                          'relative flex flex-col items-start rounded-xl border p-3.5 text-left transition-all duration-200 hover:scale-[1.02]',
                          active
                            ? 'border-primary bg-primary/10 text-foreground ring-2 ring-primary/20 shadow-md'
                            : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-secondary/40'
                        )}
                      >
                        <div className="flex w-full items-center justify-between">
                          <span className="font-bold text-sm text-foreground">{f.label}</span>
                          <span className="font-mono text-[10px] text-muted-foreground">{f.px}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground/80 mt-1">{f.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* 2. Primary Accent Color */}
              <div className="space-y-3">
                <Label className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" /> Primary Accent Color
                </Label>
                <div className="flex flex-wrap gap-3">
                  {accentColors.map((c) => {
                    const active = accentColor === c.value;
                    return (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => {
                          setAccentColor(c.value);
                          toast.success('Accent Color Updated', {
                            description: `Primary workspace theme accent set to ${c.label}.`,
                          });
                        }}
                        className={cn(
                          'flex items-center gap-2.5 rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200 hover:scale-105',
                          active
                            ? 'border-primary bg-primary/15 text-foreground ring-2 ring-primary/30 shadow-sm'
                            : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                        )}
                      >
                        <span
                          className="h-3.5 w-3.5 rounded-full shadow-inner"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{c.label}</span>
                        {active && <Check className="h-3.5 w-3.5 text-primary ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* 3. Corner Style */}
              <div className="space-y-3">
                <Label className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-primary" /> Corner Radius Style
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'sharp' as const, label: 'Sharp (0px)', desc: 'Square enterprise edges' },
                    { value: 'rounded' as const, label: 'Rounded (8px)', desc: 'Standard modern curves' },
                    { value: 'extra' as const, label: 'Pill / Extra (16px)', desc: 'Soft organic radius' },
                  ].map((cr) => {
                    const active = cornerStyle === cr.value;
                    return (
                      <button
                        key={cr.value}
                        type="button"
                        onClick={() => {
                          setCornerStyle(cr.value);
                          toast.success('Corner Style Updated', {
                            description: `Component border radius set to ${cr.label}.`,
                          });
                        }}
                        className={cn(
                          'flex flex-col items-start rounded-xl border p-3.5 text-left transition-all hover:scale-[1.01]',
                          active
                            ? 'border-primary bg-primary/10 text-foreground ring-2 ring-primary/20'
                            : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                        )}
                      >
                        <span className="font-bold text-sm text-foreground">{cr.label}</span>
                        <span className="text-[11px] text-muted-foreground mt-0.5">{cr.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* 4. Sidebar Style */}
              <div className="space-y-3">
                <Label className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Layout className="h-4 w-4 text-primary" /> Sidebar Navigation Style
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'default' as const, label: 'Standard (256px)', desc: 'Full width sidebar menu' },
                    { value: 'compact' as const, label: 'Compact (208px)', desc: 'Sleek narrow sidebar' },
                    { value: 'minimal' as const, label: 'Minimal Stealth', desc: 'Ultra-dark theme sidebar' },
                  ].map((sb) => {
                    const active = sidebarStyle === sb.value;
                    return (
                      <button
                        key={sb.value}
                        type="button"
                        onClick={() => {
                          setSidebarStyle(sb.value);
                          toast.success('Sidebar Style Updated', {
                            description: `Navigation sidebar format set to ${sb.label}.`,
                          });
                        }}
                        className={cn(
                          'flex flex-col items-start rounded-xl border p-3.5 text-left transition-all hover:scale-[1.01]',
                          active
                            ? 'border-primary bg-primary/10 text-foreground ring-2 ring-primary/20'
                            : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                        )}
                      >
                        <span className="font-bold text-sm text-foreground">{sb.label}</span>
                        <span className="text-[11px] text-muted-foreground mt-0.5">{sb.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* 5. Content Width & Compact Mode */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Maximize2 className="h-4 w-4 text-primary" /> Content Container Width
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Switch between centered max 1400px container or 100% full width layout.
                  </p>
                  <div className="flex gap-2 pt-1">
                    {[
                      { value: 'boxed' as const, label: 'Boxed (1400px)' },
                      { value: 'full' as const, label: 'Full Width (100%)' },
                    ].map((w) => (
                      <button
                        key={w.value}
                        type="button"
                        onClick={() => {
                          setContentWidth(w.value);
                          toast.success('Layout Width Saved', {
                            description: `Content layout set to ${w.label}.`,
                          });
                        }}
                        className={cn(
                          'flex-1 rounded-xl border px-3 py-2 text-xs font-semibold transition-all',
                          contentWidth === w.value
                            ? 'border-primary bg-primary/10 text-foreground'
                            : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                        )}
                      >
                        {w.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Minimize2 className="h-4 w-4 text-primary" /> UI Density &amp; Spacing
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Adjust component padding and table row spacing density.
                  </p>
                  <div className="flex gap-2 pt-1">
                    {[
                      { value: 'comfortable' as const, label: 'Comfortable Spacing' },
                      { value: 'compact' as const, label: 'Compact Spacing' },
                    ].map((d) => (
                      <button
                        key={d.value}
                        type="button"
                        onClick={() => {
                          setDensity(d.value);
                          setCompactMode(d.value === 'compact');
                          toast.success('Density Updated', {
                            description: `UI spacing set to ${d.label}.`,
                          });
                        }}
                        className={cn(
                          'flex-1 rounded-xl border px-3 py-2 text-xs font-semibold transition-all',
                          density === d.value
                            ? 'border-primary bg-primary/10 text-foreground'
                            : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                        )}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </SettingsCard>
        </TabsContent>

        {/* Language */}
        <TabsContent value="language" className="space-y-4">
          <SettingsCard title="Language &amp; Region" description="Set your preferred language">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Display Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English (US)</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Number Format</Label>
                <Select defaultValue="us">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">1,234.56 (US)</SelectItem>
                    <SelectItem value="eu">1.234,56 (EU)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button size="sm" onClick={() => toast.success('Language Preferences Saved', { description: 'Workspace language set to English.' })}>Save Language</Button>
            </div>
          </SettingsCard>
        </TabsContent>

        {/* Date & Time */}
        <TabsContent value="datetime" className="space-y-4">
          <SettingsCard title="Date &amp; Time" description="Configure date and time display formats">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Date Format</Label>
                <Select defaultValue="mdy">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Time Format</Label>
                <Select defaultValue="12">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12-hour (AM/PM)</SelectItem>
                    <SelectItem value="24">24-hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Timezone</Label>
                <Select defaultValue="cst">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="est">Eastern (EST)</SelectItem>
                    <SelectItem value="cst">Central (CST)</SelectItem>
                    <SelectItem value="mst">Mountain (MST)</SelectItem>
                    <SelectItem value="pst">Pacific (PST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>First Day of Week</Label>
                <Select defaultValue="sun">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sun">Sunday</SelectItem>
                    <SelectItem value="mon">Monday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button size="sm" onClick={() => toast.success('Date & Time Formats Saved', { description: 'Workspace datetime formats updated.' })}>Save Format</Button>
            </div>
          </SettingsCard>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-4">
          <SettingsCard title="Security" description="Authentication and session settings">
            <ToggleRow label="Two-factor authentication" description="Require 2FA for all admin-level accounts" defaultChecked />
            <ToggleRow label="Session timeout" description="Automatically log out after 30 minutes of inactivity" defaultChecked />
            <ToggleRow label="IP allowlist" description="Restrict access to approved IP addresses only" />
            <Separator className="my-2" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="pw-expiry">Password Expiry (days)</Label>
                <Input id="pw-expiry" type="number" defaultValue="90" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="min-pw">Minimum Password Length</Label>
                <Input id="min-pw" type="number" defaultValue="12" />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button size="sm" onClick={() => toast.success('Security Settings Saved', { description: 'Password expiry and session timeout rules updated.' })}>Save Security</Button>
            </div>
          </SettingsCard>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
