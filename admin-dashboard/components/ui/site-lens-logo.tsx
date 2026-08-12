'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SiteLensLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  showText?: boolean;
  textClassName?: string;
  variant?: 'full' | 'icon';
  useExactImage?: boolean;
}

export function SiteLensLogo({
  size = 36,
  showText = false,
  textClassName,
  variant = 'icon',
  useExactImage = false,
  className,
  ...props
}: SiteLensLogoProps) {
  const iconSize = typeof size === 'number' ? `${size}px` : size;

  if (useExactImage) {
    return (
      <img
        src="/sitelens-logo.png"
        alt="SiteLens AI Logo"
        style={{ height: iconSize }}
        className={cn('w-auto object-contain select-none', className)}
      />
    );
  }

  const IconGraphic = (
    <img
      src="/sitelens-icon.png"
      alt="SiteLens AI"
      style={{ width: iconSize, height: iconSize }}
      className={cn('shrink-0 select-none object-contain drop-shadow-sm', className)}
    />
  );

  if (variant === 'icon' && !showText) {
    return IconGraphic;
  }

  return (
    <div className="inline-flex items-center gap-2.5 select-none">
      {IconGraphic}
      {(showText || variant === 'full') && (
        <span className={cn('text-xl font-bold tracking-tight text-foreground', textClassName)}>
          SiteLens<span className="text-amber-500"> AI</span>
        </span>
      )}
    </div>
  );
}
