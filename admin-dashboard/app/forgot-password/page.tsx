'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Loader2, Mail } from 'lucide-react';

import { useAuthStore } from '@/lib/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthBrand } from '@/components/auth/auth-brand';
import { AuthFooter } from '@/components/auth/auth-footer';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const resetPassword = useAuthStore((s) => s.resetPassword);

  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    setTimeout(() => {
      const result = resetPassword(email);
      setSubmitting(false);
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || 'Unable to send reset link.');
      }
    }, 500);
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <AuthBrand />
        </div>

        {submitted ? (
          <div className="rounded-sm border border-border bg-card p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-success/30 bg-success/10">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <h2 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
              Check your email
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We sent a password reset link to{' '}
              <span className="font-medium text-foreground">{email}</span>.
              Follow the link to restore access to your account.
            </p>
            <Button
              variant="outline"
              className="mt-6 w-full"
              onClick={() => router.push('/login')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Reset your password
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter your work email and we&apos;ll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              {error && (
                <p className="rounded-sm border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {submitting ? 'Sending…' : 'Send reset link'}
              </Button>
            </form>

            <Link
              href="/login"
              className="mt-4 flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </>
        )}

        <AuthFooter />
      </div>
    </div>
  );
}
