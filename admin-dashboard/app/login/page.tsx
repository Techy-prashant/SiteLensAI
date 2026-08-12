'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';

import { useAuthStore, demoCredentials } from '@/lib/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AuthBrand } from '@/components/auth/auth-brand';
import { AuthFooter } from '@/components/auth/auth-footer';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [remember, setRemember] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    setTimeout(() => {
      const result = login(email, password);
      setSubmitting(false);
      if (result.success) {
        router.push('/home');
      } else {
        setError(result.error || 'Login failed.');
      }
    }, 500);
  }

  function fillDemo(cred: { email: string; password: string }) {
    setEmail(cred.email);
    setPassword(cred.password);
    setError('');
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Left panel — branding (hidden on mobile) */}
      <div className="relative hidden w-1/2 flex-col justify-between border-r border-border bg-card p-8 lg:p-12 lg:flex overflow-y-auto">
        <AuthBrand />

        {/* Large Hero Construction Team Collage Image — Extreme Left Aligned */}
        <div className="my-4 flex items-start justify-start text-left -ml-3 sm:-ml-5">
          <img
            src="/login-hero-workers.png"
            alt="SiteLens Construction Safety Team"
            className="w-full max-w-lg h-auto max-h-[440px] object-contain drop-shadow-2xl transition-transform duration-300 hover:scale-[1.01]"
          />
        </div>

        <div className="max-w-md">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-foreground">
            Industrial safety, <span className="text-primary">monitored intelligently.</span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            SiteLens AI uses connected smart glasses and computer vision to
            detect safety violations in real time, keeping every worker
            protected on every shift.
          </p>
        </div>
        <p className="text-xs text-muted-foreground/70">
          &copy; {new Date().getFullYear()} SiteLens AI
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <AuthBrand />
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Welcome back
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to your SiteLens AI workspace.
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-9"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? 'Hide password' : 'Show password'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={remember}
                onCheckedChange={(v) => setRemember(v === true)}
              />
              <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">
                Remember me
              </Label>
            </div>

            {error && (
              <p className="rounded-sm border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6">
            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Demo accounts
              </span>
              <Separator className="flex-1" />
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2">
              {demoCredentials.map((cred) => (
                <button
                  key={cred.email}
                  onClick={() => fillDemo(cred)}
                  className="flex items-center justify-between rounded-sm border border-border bg-card px-3 py-2 text-left text-xs transition-colors hover:border-primary/40"
                >
                  <span className="font-medium text-foreground">
                    {cred.roleLabel}
                  </span>
                  <span className="text-muted-foreground">{cred.email}</span>
                </button>
              ))}
            </div>
          </div>

          <AuthFooter />
        </div>
      </div>
    </div>
  );
}
