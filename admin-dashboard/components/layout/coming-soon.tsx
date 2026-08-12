'use client';

import * as React from 'react';
import { Construction } from 'lucide-react';

import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent } from '@/components/ui/card';
import { StatusPill } from '@/components/ui/status-pill';

interface ComingSoonProps {
  title: string;
  description: string;
}

export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <PageContainer title={title} description={description}>
      <Card className="rounded-sm border-border shadow-none">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-sm border border-border bg-secondary">
            <Construction className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              {title} — coming in the next phase
            </h2>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              The application shell and design system are ready. This section
              will be built out as part of the dashboard implementation.
            </p>
          </div>
          <StatusPill variant="info" dot={false}>
            Foundation complete
          </StatusPill>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
