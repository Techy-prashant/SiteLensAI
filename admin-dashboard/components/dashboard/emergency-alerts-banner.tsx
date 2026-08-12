'use client';

import * as React from 'react';
import { AlertTriangle, ChevronRight, X, Radio, Camera, RefreshCw, Database } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { StatusPill } from '@/components/ui/status-pill';
import { useVLMAlerts, VLMAlert } from '@/hooks/use-vlm-alerts';

const severityStyles: Record<VLMAlert['severity'], string> = {
  critical: 'border-l-destructive bg-destructive/5',
  high: 'border-l-amber-500 bg-amber-500/5',
  medium: 'border-l-blue-500 bg-blue-500/5',
  low: 'border-l-slate-500 bg-slate-500/5',
};

const severityPill: Record<VLMAlert['severity'], React.ReactNode> = {
  critical: <StatusPill variant="danger" size="sm">CRITICAL</StatusPill>,
  high: <StatusPill variant="warning" size="sm">HIGH</StatusPill>,
  medium: <StatusPill variant="info" size="sm">MEDIUM</StatusPill>,
  low: <StatusPill variant="neutral" size="sm">LOW</StatusPill>,
};

export function EmergencyAlertsBanner() {
  const [dismissed, setDismissed] = React.useState(false);
  const { alerts, isConnected, isScanning, vlmStatus, triggerVLMScan, resolveAlert, refetch } = useVLMAlerts();

  if (dismissed) return null;

  return (
    <div className="rounded-xl border border-border bg-card shadow-lg mb-6 overflow-hidden">
      {/* Animated top indicator strip */}
      <div className={cn(
        "h-1 w-full transition-colors duration-500",
        alerts.some(a => a.severity === 'critical')
          ? "bg-destructive animate-pulse"
          : isConnected
          ? "bg-gradient-to-r from-emerald-500 via-primary to-amber-500"
          : "bg-muted-foreground/30"
      )} />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-card border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className={cn(
            "h-5 w-5",
            alerts.some(a => a.severity === 'critical') ? "text-destructive animate-bounce" : "text-amber-500"
          )} />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-foreground">
                VLM Emergency & Hazard Monitor
              </h2>
              <span className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider",
                alerts.length > 0
                  ? "bg-destructive/15 text-destructive border border-destructive/30"
                  : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              )}>
                {alerts.length} Active {alerts.length === 1 ? 'Emergency' : 'Emergencies'}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-mono mt-0.5 flex items-center gap-1.5">
              <span className={cn("inline-block h-2 w-2 rounded-full", isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500")} />
              {vlmStatus}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 ml-auto">
          <Button
            size="sm"
            variant="outline"
            disabled={isScanning}
            onClick={() => triggerVLMScan(undefined, "Perform active construction site hazard check for fall risks and missing hardhats")}
            className="h-8 text-xs font-semibold bg-primary/10 border-primary/30 text-primary hover:bg-primary/20"
          >
            {isScanning ? (
              <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Camera className="mr-1.5 h-3.5 w-3.5" />
            )}
            Trigger VLM Scan
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={refetch}
            title="Sync Database & Alerts"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          >
            <Database className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => setDismissed(true)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss banner</span>
          </Button>
        </div>
      </div>

      {/* Emergency Grid Items */}
      {alerts.length === 0 ? (
        <div className="p-4 text-center text-xs text-muted-foreground bg-accent/20 flex items-center justify-center gap-2">
          <Radio className="h-4 w-4 text-emerald-500 animate-pulse" />
          <span>No active emergencies detected by VLM or stored in audit database. Site status is SAFE.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-px bg-border lg:grid-cols-2 xl:grid-cols-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={cn(
                'border-l-4 p-4 transition-all duration-200 hover:bg-card/90',
                severityStyles[alert.severity]
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    {alert.title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">{alert.site}</p>
                </div>
                {severityPill[alert.severity]}
              </div>

              <p className="mt-2 text-xs text-foreground/90 leading-relaxed font-sans line-clamp-2 bg-background/50 p-2 rounded border border-border/40">
                {alert.hazards_detail}
              </p>

              {alert.sop_reference && (
                <p className="mt-1.5 text-[11px] text-primary/80 font-mono truncate">
                  SOP: {alert.sop_reference}
                </p>
              )}

              <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-border/40">
                <span className="text-[11px] text-muted-foreground font-mono">
                  {alert.timestamp}
                </span>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2.5 text-xs font-semibold text-destructive hover:bg-destructive/10"
                  onClick={() => resolveAlert(alert.id)}
                >
                  Resolve Issue
                  <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
