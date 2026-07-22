const alerts = [
  { id: 1, severity: 'High', text: 'Unprotected edge detected near Tower C' },
  { id: 2, severity: 'Medium', text: 'PPE compliance dropped to 93% in Zone A' },
  { id: 3, severity: 'Low', text: 'Routine scaffold inspection due in 2 hours' },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
        <aside className="rounded-xl bg-slate-900 p-5 text-slate-100">
          <h1 className="text-xl font-semibold">SiteLens AI</h1>
          <nav className="mt-6 space-y-3 text-sm">
            <p className="rounded-md bg-slate-700 px-3 py-2">Dashboard</p>
            <p className="px-3 py-2">Live Feeds</p>
            <p className="px-3 py-2">Safety Alerts</p>
            <p className="px-3 py-2">Task Management</p>
          </nav>
        </aside>

        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold">Live Camera Feeds</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="flex h-32 items-center justify-center rounded-lg border border-dashed border-slate-400 bg-white text-sm text-slate-500"
                >
                  Feed Placeholder {index + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold">Recent Safety Alerts</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {alerts.map((alert) => (
                <li key={alert.id} className="rounded-md border border-slate-200 p-3">
                  <span className="font-medium">{alert.severity}:</span> {alert.text}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
