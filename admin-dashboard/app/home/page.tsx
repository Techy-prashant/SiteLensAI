'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Cpu,
  Bot,
  Lock,
  Building,
  CheckSquare,
  Users,
  Glasses,
  FileText,
  SearchX,
} from 'lucide-react';
import { useMockStore } from '@/lib/mock-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmployeeProfileModal } from '@/components/EmployeeProfileModal';
import { SiteLensLogo } from '@/components/ui/site-lens-logo';
import { EmployeeRecord } from '@/lib/types';
import { toast } from 'sonner';
import { EmergencyAlertsBanner } from '@/components/dashboard/emergency-alerts-banner';

export default function HomePage() {
  const router = useRouter();
  const {
    activeEmpId,
    activeRoleId,
    sites,
    tasks,
    supervisors,
    siteManagers,
    fieldWorkers,
    admins,
    queryVLM,
  } = useMockStore();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [vlmResponse, setVlmResponse] = React.useState<{ text: string; statusCode: number } | null>(null);
  const [selectedEmp, setSelectedEmp] = React.useState<EmployeeRecord | null>(null);
  const [profileModalOpen, setProfileModalOpen] = React.useState(false);

  // Handle Search Submission (VLM/LLM Custom API Integration)
  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      // 1. Try real VLM RAG backend query endpoint
      const res = await fetch('http://localhost:8000/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (res.ok) {
        const data = await res.json();
        setVlmResponse({ text: data.answer || data.response || JSON.stringify(data), statusCode: 200 });
        return;
      }
    } catch (err) {
      console.log('Backend query unreachable, falling back to local VLM engine:', err);
    }

    // 2. Fallback to local VLM mock engine logic
    const result = queryVLM(searchQuery);
    if (result.success && result.data) {
      setVlmResponse({ text: result.data, statusCode: 200 });
    } else {
      setVlmResponse({
        text: result.error || 'VLM API Rejection: Access Restricted to Super Admin.',
        statusCode: result.statusCode || 403,
      });
      if (activeRoleId !== 1) {
        toast.error('VLM API Access Denied (403)', {
          description: 'Custom Vision-Language Model inference is restricted exclusively to Super Admin accounts.',
        });
      }
    }
  };

  // Scoped database matches
  const databaseMatches = React.useMemo(() => {
    const raw = searchQuery.trim();
    if (!raw) return null;

    const isMention = raw.includes('@');
    const q = raw.toLowerCase().replace(/^@/, '');

    // Role-based staff access control hierarchy:
    // - Super Admin (1): Global access to all employee records
    // - Supervisor (2): Access to Site Managers only (nothing else)
    // - Site Manager (3): Access to Field Workers only (nothing else)
    // - Field Worker (4): No access to employee records
    let accessibleStaff: EmployeeRecord[] = [];
    if (activeRoleId === 1) {
      accessibleStaff = [
        ...admins.map((a) => ({ type: 'Admin' as const, ...a })),
        ...supervisors.map((s) => ({ type: 'Supervisor' as const, ...s })),
        ...siteManagers.map((m) => ({ type: 'Site Manager' as const, ...m })),
        ...fieldWorkers.map((w) => ({ type: 'Field Worker' as const, ...w })),
      ];
    } else if (activeRoleId === 2) {
      accessibleStaff = siteManagers.map((m) => ({ type: 'Site Manager' as const, ...m }));
    } else if (activeRoleId === 3) {
      accessibleStaff = fieldWorkers.map((w) => ({ type: 'Field Worker' as const, ...w }));
    } else {
      accessibleStaff = [];
    }

    const matchedStaff = accessibleStaff.filter((emp) => {
      if (isMention && !q) return true; // If typing just "@", show all accessible employees
      return emp.Name.toLowerCase().includes(q) || emp.Emp_id.toLowerCase().includes(q);
    });

    if (isMention) {
      return {
        sites: [],
        tasks: [],
        staff: matchedStaff,
        totalCount: matchedStaff.length,
      };
    }

    const matchedSites = sites.filter((s) =>
      s.Site_id.toLowerCase().includes(q) ||
      s.Site_Location.toLowerCase().includes(q) ||
      s.client_name.toLowerCase().includes(q)
    );

    const matchedTasks = tasks.filter((t) =>
      t.Task_id.toLowerCase().includes(q) ||
      t.TaskName.toLowerCase().includes(q) ||
      t.Status.toLowerCase().includes(q)
    );

    const totalCount = matchedSites.length + matchedTasks.length + matchedStaff.length;

    return {
      sites: matchedSites,
      tasks: matchedTasks,
      staff: matchedStaff,
      totalCount,
    };
  }, [searchQuery, sites, tasks, admins, supervisors, siteManagers, fieldWorkers, activeRoleId]);

  const handleOpenStaffDetail = (emp: EmployeeRecord) => {
    const isAllowed =
      activeRoleId === 1 ||
      (activeRoleId === 2 && emp.type === 'Site Manager') ||
      (activeRoleId === 3 && emp.type === 'Field Worker');

    if (!isAllowed) {
      toast.error('Access Restricted', {
        description:
          activeRoleId === 2
            ? 'Supervisors can only access Site Manager profile records.'
            : activeRoleId === 3
            ? 'Site Managers can only access Field Worker profile records.'
            : 'Detailed employee profile records are accessible according to role permissions.',
      });
      return;
    }
    setSelectedEmp(emp);
    setProfileModalOpen(true);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-background">
      <div className="w-full max-w-3xl space-y-8 my-auto">
        {/* VLM Emergency Alerts & Database Monitor */}
        <EmergencyAlertsBanner />

        {/* ------------------------------------------------------------- */}
        {/* CENTERED LOGO AND TAGLINE HERO                                */}
        {/* ------------------------------------------------------------- */}
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <img
            src="/sitelens-logo.png"
            alt="SiteLens AI Logo"
            className="h-16 sm:h-24 w-auto object-contain max-w-full drop-shadow-md"
          />
          <p className="text-xs sm:text-sm text-muted-foreground font-medium tracking-wide max-w-lg">
            The future of construction is now clearly in sight.
          </p>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground pt-4">
            What would you like to search today?
          </h1>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* CENTRAL MINIMALIST SEARCH CAPSULE                              */}
        {/* ------------------------------------------------------------- */}
        <div className="space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="group relative flex w-full items-center rounded-full border border-border bg-card px-4 py-3.5 shadow-xl transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 hover:border-primary/50">
              <Cpu className="h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary mr-2 shrink-0" />
              <Input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (!e.target.value) setVlmResponse(null);
                }}
                placeholder="Ask VLM AI or search sites, workers (@name), tasks, devices..."
                className="border-0 bg-transparent text-sm sm:text-base focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50"
              />
              <Button
                type="submit"
                size="sm"
                className="rounded-full px-5 text-xs font-semibold ml-2 transition-transform active:scale-95"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Clean Prompt Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <button
              onClick={() => {
                setSearchQuery('Summarize emergency incidents on SITE-101');
                queryVLM('Summarize emergency incidents on SITE-101');
              }}
              className="rounded-full border border-border bg-card px-3.5 py-1.5 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all hover:scale-105"
            >
              Emergency Summary
            </button>
            <button
              onClick={() => setSearchQuery('Crane diagnostics')}
              className="rounded-full border border-border bg-card px-3.5 py-1.5 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all hover:scale-105"
            >
              Crane Diagnostics
            </button>
            <button
              onClick={() => setSearchQuery('@Robert')}
              className="rounded-full border border-border bg-card px-3.5 py-1.5 text-muted-foreground hover:text-foreground hover:border-primary/40 font-mono transition-all hover:scale-105"
            >
              @Robert
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* VLM CUSTOM LLM RESPONSE OUTPUT CARD WITH SMOOTH ANIMATION      */}
        {/* ------------------------------------------------------------- */}
        {vlmResponse && (
          <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500 ease-out">
            {vlmResponse.statusCode === 200 ? (
              <Card className="border-primary/30 bg-card shadow-lg transition-all">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    <CardTitle className="text-sm font-bold">VLM Neural Model Output</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-primary font-mono text-[10px]">
                    Super Admin Verified
                  </Badge>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed text-foreground font-sans">
                  {vlmResponse.text}
                </CardContent>
              </Card>
            ) : (
              <Card className="border-destructive/30 bg-destructive/5 shadow-lg transition-all">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-destructive" />
                    <CardTitle className="text-sm font-bold text-destructive">API 403 Forbidden</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  {vlmResponse.text}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SMOOTH ANIMATED MATCHED RECORDS GRID                          */}
        {/* ------------------------------------------------------------- */}
        {databaseMatches && (
          <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-5 duration-500 ease-out">
            <div className="flex items-center justify-center gap-2 border-b border-border/60 pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Matched Records
              </h2>
              <Badge variant="secondary" className="font-mono text-[10px] h-5 px-2">
                {databaseMatches.totalCount} Results
              </Badge>
            </div>

            {databaseMatches.totalCount === 0 ? (
              <Card className="border-border bg-card/60 p-6 text-center text-muted-foreground animate-in fade-in-0 duration-300">
                <SearchX className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
                <p className="text-sm font-medium">No matching database records found.</p>
                <p className="text-xs text-muted-foreground/80 mt-1">
                  Try searching by site location, worker name (@Robert), or task status.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {databaseMatches.sites.map((s, index) => (
                  <Card
                    key={s.Site_id}
                    className="border-border bg-card p-3.5 space-y-1 shadow-sm transition-all duration-300 hover:scale-[1.01] hover:border-primary/50 animate-in fade-in-0 slide-in-from-bottom-3 fill-mode-backwards"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-primary font-mono">{s.Site_id}</span>
                      <Badge variant="outline">{s.client_name}</Badge>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{s.Site_Location}</p>
                    <p className="text-xs text-muted-foreground">{s.Site_Description}</p>
                  </Card>
                ))}

                {databaseMatches.tasks.map((t, index) => (
                  <Card
                    key={t.Task_id}
                    className="border-border bg-card p-3.5 space-y-1 shadow-sm transition-all duration-300 hover:scale-[1.01] hover:border-primary/50 animate-in fade-in-0 slide-in-from-bottom-3 fill-mode-backwards"
                    style={{ animationDelay: `${(databaseMatches.sites.length + index) * 60}ms` }}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-primary font-mono">{t.Task_id}</span>
                      <Badge>{t.Status}</Badge>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{t.TaskName}</p>
                    <p className="text-xs text-muted-foreground">{t.Task_description}</p>
                  </Card>
                ))}

                {databaseMatches.staff.map((emp, index) => (
                  <Card
                    key={`${emp.type}-${emp.Emp_id}`}
                    onClick={() => handleOpenStaffDetail(emp)}
                    className="border-border bg-card p-3.5 flex items-center justify-between cursor-pointer shadow-sm transition-all duration-300 hover:scale-[1.01] hover:border-primary/50 animate-in fade-in-0 slide-in-from-bottom-3 fill-mode-backwards"
                    style={{
                      animationDelay: `${(databaseMatches.sites.length + databaseMatches.tasks.length + index) * 60}ms`,
                    }}
                  >
                    <div>
                      <p className="font-semibold text-sm text-foreground">{emp.Name}</p>
                      <p className="font-mono text-xs text-muted-foreground">{emp.Emp_id}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">{emp.type}</Badge>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Staff Detail Modal */}
      <EmployeeProfileModal
        employee={selectedEmp}
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
      />
    </div>
  );
}
