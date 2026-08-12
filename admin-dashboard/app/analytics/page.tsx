'use client';

import * as React from 'react';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, ShieldAlert, Cpu, Wrench, AlertCircle, FileX, Lock, Sparkles } from 'lucide-react';
import { useMockStore } from '@/lib/mock-store';

export default function AnalyticsPage() {
  const { activeRoleId, vlmReports } = useMockStore();

  // Directive 3: Access Control - Super Admin ONLY
  if (activeRoleId !== 1) {
    return (
      <PageContainer title="VLM Analytics Streams">
        <div className="mx-auto max-w-xl py-12">
          <Card className="border-destructive/40 bg-destructive/5 text-center p-8 space-y-4">
            <Lock className="mx-auto h-12 w-12 text-destructive" />
            <h2 className="text-xl font-bold text-destructive">Access Restricted (403 Forbidden)</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Actionable VLM-summarized analytical reporting streams are accessible exclusively to <strong>Super Admin</strong> accounts. Switch your active role session to Super Admin (ADM-001) to view.
            </p>
          </Card>
        </div>
      </PageContainer>
    );
  }

  // Group initial reports by exact 5 categories
  const emergencyReport = vlmReports.find((r) => r.category === 'Emergency');
  const incidentReport = vlmReports.find((r) => r.category === 'Incident/Accident');
  const machineReport = vlmReports.find((r) => r.category === 'Machine Failure');
  const workerMistakeReport = vlmReports.find((r) => r.category === 'Worker Mistakes');
  const siteNegligenceReport = vlmReports.find((r) => r.category === 'Site Negligence');

  return (
    <PageContainer
      title="VLM Actionable Analytics Streams"
      description="Super Admin exclusive feed. 5 VLM-summarized actionable category streams."
    >
      <div className="space-y-6">
        {/* Top Scope Badge */}
        <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs text-primary">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <strong>Super Admin VLM Intelligence Stream Active</strong>
          </div>
          <Badge className="font-mono text-[10px]">5 Actionable Categories</Badge>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* STREAM 1: EMERGENCY                                           */}
        {/* ------------------------------------------------------------- */}
        <Card className="border-rose-500/40 bg-card shadow-sm">
          <CardHeader className="pb-2 border-b border-border/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-rose-500" />
                <CardTitle className="text-base font-bold text-rose-500">1. Emergency Stream</CardTitle>
              </div>
              <Badge variant="destructive">CRITICAL</Badge>
            </div>
            <CardDescription className="text-xs">
              Schema: Site_ID • Site_Manager_ID • VLM_Generated_Summary
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {emergencyReport && (
              <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-3 text-xs space-y-2">
                <div className="flex items-center justify-between font-mono font-bold">
                  <span>Site_ID: <strong className="text-foreground">{emergencyReport.Site_ID}</strong></span>
                  <span>Site_Manager_ID: <strong className="text-foreground">{emergencyReport.Reporting_Entity_ID}</strong></span>
                </div>
                <div className="text-foreground font-sans leading-relaxed pt-1 border-t border-border/40">
                  <strong className="text-rose-400">VLM_Generated_Summary:</strong> {emergencyReport.VLM_Generated_Summary}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ------------------------------------------------------------- */}
        {/* STREAM 2: INCIDENT / ACCIDENT                                 */}
        {/* ------------------------------------------------------------- */}
        <Card className="border-amber-500/40 bg-card shadow-sm">
          <CardHeader className="pb-2 border-b border-border/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-base font-bold text-amber-500">2. Incident / Accident Stream</CardTitle>
              </div>
              <Badge variant="outline" className="text-amber-500 border-amber-500/40">HIGH PRIORITY</Badge>
            </div>
            <CardDescription className="text-xs">
              Schema: Site_ID • Reporting_Entity_ID • VLM_Generated_Summary
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {incidentReport && (
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs space-y-2">
                <div className="flex items-center justify-between font-mono font-bold">
                  <span>Site_ID: <strong className="text-foreground">{incidentReport.Site_ID}</strong></span>
                  <span>Reporting_Entity_ID: <strong className="text-foreground">{incidentReport.Reporting_Entity_ID}</strong></span>
                </div>
                <div className="text-foreground font-sans leading-relaxed pt-1 border-t border-border/40">
                  <strong className="text-amber-400">VLM_Generated_Summary:</strong> {incidentReport.VLM_Generated_Summary}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ------------------------------------------------------------- */}
        {/* STREAM 3: MACHINE FAILURE                                     */}
        {/* ------------------------------------------------------------- */}
        <Card className="border-blue-500/40 bg-card shadow-sm">
          <CardHeader className="pb-2 border-b border-border/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-blue-500" />
                <CardTitle className="text-base font-bold text-blue-500">3. Machine Failure Stream</CardTitle>
              </div>
              <Badge variant="outline" className="text-blue-500 border-blue-500/40">HARDWARE AUDIT</Badge>
            </div>
            <CardDescription className="text-xs">
              Schema: Site_ID • Supervising_Site_Manager_ID • VLM_Generated_Summary
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {machineReport && (
              <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 text-xs space-y-2">
                <div className="flex items-center justify-between font-mono font-bold">
                  <span>Site_ID: <strong className="text-foreground">{machineReport.Site_ID}</strong></span>
                  <span>Supervising_Site_Manager_ID: <strong className="text-foreground">{machineReport.Reporting_Entity_ID}</strong></span>
                </div>
                <div className="text-foreground font-sans leading-relaxed pt-1 border-t border-border/40">
                  <strong className="text-blue-400">VLM_Generated_Summary:</strong> {machineReport.VLM_Generated_Summary}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ------------------------------------------------------------- */}
        {/* STREAM 4: WORKER MISTAKES                                     */}
        {/* ------------------------------------------------------------- */}
        <Card className="border-purple-500/40 bg-card shadow-sm">
          <CardHeader className="pb-2 border-b border-border/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-purple-500" />
                <CardTitle className="text-base font-bold text-purple-500">4. Worker Mistakes Stream</CardTitle>
              </div>
              <Badge variant="outline" className="text-purple-500 border-purple-500/40">PROCEDURAL ERROR</Badge>
            </div>
            <CardDescription className="text-xs">
              Schema: Site_ID • Reporting_Worker_ID • VLM_Generated_Summary
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {workerMistakeReport && (
              <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-3 text-xs space-y-2">
                <div className="flex items-center justify-between font-mono font-bold">
                  <span>Site_ID: <strong className="text-foreground">{workerMistakeReport.Site_ID}</strong></span>
                  <span>Reporting_Worker_ID: <strong className="text-foreground">{workerMistakeReport.Reporting_Entity_ID}</strong></span>
                </div>
                <div className="text-foreground font-sans leading-relaxed pt-1 border-t border-border/40">
                  <strong className="text-purple-400">VLM_Generated_Summary:</strong> {workerMistakeReport.VLM_Generated_Summary}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ------------------------------------------------------------- */}
        {/* STREAM 5: SITE NEGLIGENCE                                     */}
        {/* ------------------------------------------------------------- */}
        <Card className="border-indigo-500/40 bg-card shadow-sm">
          <CardHeader className="pb-2 border-b border-border/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileX className="h-5 w-5 text-indigo-500" />
                <CardTitle className="text-base font-bold text-indigo-500">5. Site Negligence Stream</CardTitle>
              </div>
              <Badge variant="outline" className="text-indigo-500 border-indigo-500/40">COMPLIANCE FAILURE</Badge>
            </div>
            <CardDescription className="text-xs">
              Schema: Site_ID • Reporting_Worker_ID • VLM_Generated_Summary
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {siteNegligenceReport && (
              <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3 text-xs space-y-2">
                <div className="flex items-center justify-between font-mono font-bold">
                  <span>Site_ID: <strong className="text-foreground">{siteNegligenceReport.Site_ID}</strong></span>
                  <span>Reporting_Worker_ID: <strong className="text-foreground">{siteNegligenceReport.Reporting_Entity_ID}</strong></span>
                </div>
                <div className="text-foreground font-sans leading-relaxed pt-1 border-t border-border/40">
                  <strong className="text-indigo-400">VLM_Generated_Summary:</strong> {siteNegligenceReport.VLM_Generated_Summary}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
