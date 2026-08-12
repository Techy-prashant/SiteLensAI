import * as React from 'react';

export function AuthBrand({ className }: { className?: string }) {
  return (
    <div className="flex items-center">
      <img
        src="/sitelens-logo.png"
        alt="SiteLens Logo"
        className={`h-14 sm:h-16 w-auto object-contain drop-shadow-sm ${className || ''}`}
      />
    </div>
  );
}
