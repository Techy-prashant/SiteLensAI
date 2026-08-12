'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AccentColor = 'yellow' | 'blue' | 'green' | 'orange' | 'red';
type SidebarStyle = 'default' | 'compact' | 'minimal';
type ContentWidth = 'boxed' | 'full';
type CornerStyle = 'sharp' | 'rounded' | 'extra';
type Density = 'comfortable' | 'compact';
export type FontSize = 'small' | 'default' | 'large' | 'xlarge';

export interface DashboardWidget {
  id: string;
  label: string;
  visible: boolean;
}

interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  accentColor: AccentColor;
  setAccentColor: (c: AccentColor) => void;

  fontSize: FontSize;
  setFontSize: (f: FontSize) => void;

  sidebarStyle: SidebarStyle;
  setSidebarStyle: (s: SidebarStyle) => void;

  compactMode: boolean;
  setCompactMode: (v: boolean) => void;

  contentWidth: ContentWidth;
  setContentWidth: (w: ContentWidth) => void;

  cornerStyle: CornerStyle;
  setCornerStyle: (c: CornerStyle) => void;

  density: Density;
  setDensity: (d: Density) => void;

  widgets: DashboardWidget[];
  toggleWidget: (id: string) => void;
  moveWidget: (id: string, dir: 'up' | 'down') => void;
  resetWidgets: () => void;
}

const defaultWidgets: DashboardWidget[] = [
  { id: 'emergency-alerts', label: 'Emergency Alerts', visible: true },
  { id: 'kpi-cards', label: 'KPI Cards', visible: true },
  { id: 'quick-actions', label: 'Quick Actions', visible: true },
  { id: 'task-completion-chart', label: 'Task Completion Chart', visible: true },
  { id: 'glasses-activity-chart', label: 'Glasses Activity Chart', visible: true },
  { id: 'incident-category-chart', label: 'Incident Category Chart', visible: true },
  { id: 'activity-timeline', label: 'Live Activity Timeline', visible: true },
  { id: 'site-status', label: 'Site Status', visible: true },
  { id: 'incident-reports-table', label: 'Incident Reports Table', visible: true },
  { id: 'completed-tasks-table', label: 'Completed Tasks Table', visible: true },
];

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) =>
        set({ sidebarCollapsed: collapsed }),

      accentColor: 'yellow',
      setAccentColor: (accentColor) => set({ accentColor }),

      fontSize: 'default',
      setFontSize: (fontSize) => set({ fontSize }),

      sidebarStyle: 'default',
      setSidebarStyle: (sidebarStyle) => set({ sidebarStyle }),

      compactMode: false,
      setCompactMode: (compactMode) => set({ compactMode }),

      contentWidth: 'boxed',
      setContentWidth: (contentWidth) => set({ contentWidth }),

      cornerStyle: 'rounded',
      setCornerStyle: (cornerStyle) => set({ cornerStyle }),

      density: 'comfortable',
      setDensity: (density) => set({ density }),

      widgets: defaultWidgets,
      toggleWidget: (id) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, visible: !w.visible } : w
          ),
        })),
      moveWidget: (id, dir) =>
        set((state) => {
          const idx = state.widgets.findIndex((w) => w.id === id);
          if (idx < 0) return state;
          const swap = dir === 'up' ? idx - 1 : idx + 1;
          if (swap < 0 || swap >= state.widgets.length) return state;
          const arr = [...state.widgets];
          [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
          return { widgets: arr };
        }),
      resetWidgets: () => set({ widgets: defaultWidgets }),
    }),
    {
      name: 'sitelens-ui',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        accentColor: state.accentColor,
        fontSize: state.fontSize,
        sidebarStyle: state.sidebarStyle,
        compactMode: state.compactMode,
        contentWidth: state.contentWidth,
        cornerStyle: state.cornerStyle,
        density: state.density,
        widgets: state.widgets,
      }),
    }
  )
);

export const fontSizes: { value: FontSize; label: string; px: string; desc: string }[] = [
  { value: 'small', label: 'Small', px: '14px', desc: 'Compact text sizing (87.5%)' },
  { value: 'default', label: 'Normal', px: '16px', desc: 'Standard readable text (100%)' },
  { value: 'large', label: 'Large', px: '18px', desc: 'Enhanced visibility (112.5%)' },
  { value: 'xlarge', label: 'Extra Large', px: '20px', desc: 'High contrast & large text (125%)' },
];

export const accentColors: { value: AccentColor; label: string; hex: string }[] = [
  { value: 'yellow', label: 'Yellow', hex: '#FFD600' },
  { value: 'blue', label: 'Blue', hex: '#2563EB' },
  { value: 'green', label: 'Green', hex: '#16A34A' },
  { value: 'orange', label: 'Orange', hex: '#EA580C' },
  { value: 'red', label: 'Red', hex: '#DC2626' },
];

export const accentHsl: Record<AccentColor, string> = {
  yellow: '50 100% 50%',
  blue: '217 91% 60%',
  green: '142 71% 45%',
  orange: '25 95% 53%',
  red: '0 72% 51%',
};
