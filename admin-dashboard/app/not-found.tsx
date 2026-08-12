import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileQuestion, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-md border-border bg-card text-center p-6 shadow-lg space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <FileQuestion className="h-6 w-6" />
        </div>

        <CardHeader className="p-0 space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">404 - Page Not Found</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            The requested page route does not exist or has been moved.
          </CardDescription>
        </CardHeader>

        <div className="pt-2">
          <Button size="sm" asChild className="text-xs">
            <Link href="/home">
              <Home className="mr-1.5 h-3.5 w-3.5" /> Return to Home
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
