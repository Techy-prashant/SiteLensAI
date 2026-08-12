'use client';

import {
  Glasses,
  ClipboardCheck,
  FileText,
  Radio,
  UserPlus,
  type LucideIcon,
} from 'lucide-react';

import { cn, showComingSoonToast } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { quickActions, type QuickAction } from '@/lib/dashboard-data';

const iconMap: Record<QuickAction['icon'], LucideIcon> = {
  glasses: Glasses,
  clipboard: ClipboardCheck,
  'file-text': FileText,
  radio: Radio,
  'user-plus': UserPlus,
};

export function QuickActions() {
  return (
    <Card className="border-border shadow-none">
      <CardContent className="p-4">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-foreground">
            Quick Actions
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Common operational tasks
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {quickActions.map((action) => {
            const Icon = iconMap[action.icon];
            return (
              <Button
                key={action.id}
                variant="outline"
                onClick={() => showComingSoonToast(action.label)}
                className="h-auto flex-col gap-2 border-border py-3 text-xs font-medium text-foreground hover:border-primary/40 hover:bg-secondary"
              >
                <Icon className="h-5 w-5 text-primary" />
                {action.label}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
