'use client';

import * as React from 'react';
import { useUIStore, accentHsl } from '@/lib/stores/ui-store';

const cornerRadiusMap: Record<string, string> = {
  sharp: '0rem',
  rounded: '0.5rem',
  extra: '1rem',
};

const fontSizePxMap: Record<string, string> = {
  small: '14px',
  default: '16px',
  large: '18px',
  xlarge: '20px',
};

export function ThemeCustomizer({ children }: { children: React.ReactNode }) {
  const {
    accentColor,
    fontSize,
    compactMode,
    contentWidth,
    density,
    cornerStyle,
    sidebarStyle,
  } = useUIStore();

  // Primary Accent Color
  React.useEffect(() => {
    const root = document.documentElement;
    const hsl = accentHsl[accentColor] || accentHsl.yellow;
    root.style.setProperty('--primary', hsl);
    root.style.setProperty('--ring', hsl);
    root.style.setProperty('--chart-1', hsl);
  }, [accentColor]);

  // Comprehensive Theme & Layout Attributes
  React.useEffect(() => {
    const root = document.documentElement;

    // 1. Font Size (dynamic root html fontSize scaling)
    const fontPx = fontSizePxMap[fontSize] || '16px';
    root.style.fontSize = fontPx;

    // 2. Corner Radius (--radius CSS variable)
    const radius = cornerRadiusMap[cornerStyle] || '0.5rem';
    root.style.setProperty('--radius', radius);

    // 3. Density & Compact Mode
    if (density === 'compact' || compactMode) {
      root.setAttribute('data-density', 'compact');
    } else {
      root.removeAttribute('data-density');
    }

    // 4. Content Width
    if (contentWidth === 'full') {
      root.setAttribute('data-content', 'full');
    } else {
      root.removeAttribute('data-content');
    }

    // 5. Sidebar Style
    root.setAttribute('data-sidebar-style', sidebarStyle || 'default');
  }, [fontSize, cornerStyle, density, compactMode, contentWidth, sidebarStyle]);

  return <>{children}</>;
}
