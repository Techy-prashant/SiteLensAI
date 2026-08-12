'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log error to an error reporting service
    console.error('Unhandled App Router Segment Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-md border-destructive/30 bg-card text-center p-6 shadow-lg space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-6 w-6" />
        </div>

        <CardHeader className="p-0 space-y-1">
          <CardTitle className="text-xl font-bold text-foreground">Something went wrong</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            An unexpected error occurred while rendering this page segment.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 text-xs text-muted-foreground font-mono bg-secondary/50 p-2.5 rounded border border-border overflow-x-auto text-left">
          {error.message || 'Unknown runtime error'}
        </CardContent>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button size="sm" onClick={() => reset()} className="text-xs">
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Try Again
          </Button>
          <Button size="sm" variant="outline" asChild className="text-xs">
            <Link href="/home">
              <Home className="mr-1.5 h-3.5 w-3.5" /> Go Home
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
