'use client';

import {
  Glasses,
  Users,
  ShieldAlert,
  CheckSquare,
  BatteryMedium,
  ShieldCheck,
  ArrowDownRight,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { kpiCards, type KPICard } from '@/lib/dashboard-data';

const iconMap: Record<KPICard['icon'], LucideIcon> = {
  glasses: Glasses,
  users: Users,
  alert: ShieldAlert,
  tasks: CheckSquare,
  battery: BatteryMedium,
  shield: ShieldCheck,
};

export function KpiCards() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
      {kpiCards.map((kpi) => {
        const Icon = iconMap[kpi.icon];
        const positive = kpi.trend === 'up';
        return (
          <Card
            key={kpi.id}
            className="relative overflow-hidden border-border shadow-none"
          >
            {/* Subtle yellow top highlight */}
            <div className="absolute left-0 top-0 h-full w-0.5 bg-primary/20" />
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-border bg-secondary">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <span
                  className={cn(
                    'flex items-center gap-0.5 text-xs font-medium',
                    positive ? 'text-success' : 'text-destructive'
                  )}
                >
                  {positive ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {Math.abs(kpi.change)}%
                </span>
              </div>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                {kpi.value}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {kpi.label}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
