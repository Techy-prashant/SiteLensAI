'use client';

import * as React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('Global Error Boundary Caught:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen w-full flex-col items-center justify-center bg-black text-white p-6 font-sans">
        <div className="w-full max-w-md rounded-xl border border-red-500/30 bg-neutral-900 p-6 text-center space-y-4 shadow-2xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <h1 className="text-xl font-bold text-white">Application Global Error</h1>
          <p className="text-xs text-neutral-400">
            A critical system error prevented the application layout from rendering.
          </p>

          <div className="rounded border border-neutral-800 bg-neutral-950 p-3 text-left font-mono text-xs text-red-400 overflow-x-auto">
            {error.message || 'Fatal Application Error'}
          </div>

          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-red-700 transition-colors"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset Application
          </button>
        </div>
      </body>
    </html>
  );
}
