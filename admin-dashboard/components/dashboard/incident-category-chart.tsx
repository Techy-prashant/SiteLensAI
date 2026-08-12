'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { Card, CardContent } from '@/components/ui/card';
import { incidentCategoryData } from '@/lib/dashboard-data';

export function IncidentCategoryChart() {
  return (
    <Card className="border-border shadow-none">
      <CardContent className="p-4">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-foreground">
            Incident Categories
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Distribution by type
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="relative h-48 w-48 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incidentCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  animationDuration={600}
                >
                  {incidentCategoryData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.25rem',
                    fontSize: '12px',
                    color: 'hsl(var(--popover-foreground))',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-semibold text-foreground">
                {incidentCategoryData.reduce((sum, d) => sum + d.value, 0)}
              </span>
              <span className="text-[11px] text-muted-foreground">Total</span>
            </div>
          </div>
          <ul className="flex-1 space-y-2">
            {incidentCategoryData.map((cat) => (
              <li
                key={cat.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-muted-foreground">{cat.name}</span>
                </div>
                <span className="font-medium text-foreground">{cat.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
