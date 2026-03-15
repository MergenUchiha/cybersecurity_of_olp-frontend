import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language } from './i18n';
import { translations } from './i18n';

export type Theme = 'dark' | 'light';

interface UIState {
  theme: Theme;
  language: Language;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  setLanguage: (l: Language) => void;
  t: typeof translations.en;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      language: 'en',
      t: translations.en,

      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },

      toggleTheme: () => {
        const next: Theme = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: next });
        applyTheme(next);
      },

      setLanguage: (language) => {
        set({ language, t: translations[language] });
      },
    }),
    {
      name: 'ui-store',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme);
          state.t = translations[state.language];
        }
      },
    }
  )
);

function applyTheme(theme: Theme) {
  const root = document.documentElement;

  if (theme === 'light') {
    root.style.setProperty('--bg-base',        '#f0f4f8');
    root.style.setProperty('--bg-surface',     '#ffffff');
    root.style.setProperty('--bg-card',        '#ffffff');
    root.style.setProperty('--bg-elevated',    '#f7f9fc');
    root.style.setProperty('--bg-hover',       '#edf2f7');

    root.style.setProperty('--border',         'rgba(0, 150, 120, 0.15)');
    root.style.setProperty('--border-strong',  'rgba(0, 150, 120, 0.3)');
    root.style.setProperty('--border-subtle',  'rgba(0,0,0,0.06)');

    root.style.setProperty('--primary',        '#009688');
    root.style.setProperty('--primary-dim',    'rgba(0, 150, 136, 0.1)');
    root.style.setProperty('--primary-glow',   '0 0 20px rgba(0,150,136,0.2)');

    root.style.setProperty('--accent',         '#0097a7');
    root.style.setProperty('--accent-dim',     'rgba(0,151,167,0.1)');

    root.style.setProperty('--text-primary',   '#1a2332');
    root.style.setProperty('--text-secondary', '#374151');
    root.style.setProperty('--text-muted',     '#6b7280');
    root.style.setProperty('--text-inverse',   '#ffffff');

    root.style.setProperty('--secondary',      '#5c6bc0');
    root.style.setProperty('--secondary-dim',  'rgba(92,107,192,0.1)');

    root.style.setProperty('--success',        '#2e7d32');
    root.style.setProperty('--success-dim',    'rgba(46,125,50,0.1)');
    root.style.setProperty('--warning',        '#e65100');
    root.style.setProperty('--warning-dim',    'rgba(230,81,0,0.1)');
    root.style.setProperty('--danger',         '#c62828');
    root.style.setProperty('--danger-dim',     'rgba(198,40,40,0.1)');
    root.style.setProperty('--info',           '#1565c0');
    root.style.setProperty('--info-dim',       'rgba(21,101,192,0.1)');

    root.style.setProperty('--shadow-sm',  '0 1px 3px rgba(0,0,0,0.08)');
    root.style.setProperty('--shadow-md',  '0 4px 16px rgba(0,0,0,0.10)');
    root.style.setProperty('--shadow-lg',  '0 8px 32px rgba(0,0,0,0.12)');
    root.style.setProperty('--shadow-glow-primary', '0 0 40px rgba(0,150,136,0.12)');
    document.body.style.backgroundImage =
      'linear-gradient(rgba(0,150,136,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,150,136,0.025) 1px, transparent 1px)';
  } else {
    // reset to dark defaults
    root.style.setProperty('--bg-base',        '#050b14');
    root.style.setProperty('--bg-surface',     '#0a1628');
    root.style.setProperty('--bg-card',        '#0d1f38');
    root.style.setProperty('--bg-elevated',    '#112244');
    root.style.setProperty('--bg-hover',       '#162850');

    root.style.setProperty('--border',         'rgba(0, 212, 170, 0.12)');
    root.style.setProperty('--border-strong',  'rgba(0, 212, 170, 0.25)');
    root.style.setProperty('--border-subtle',  'rgba(255,255,255,0.05)');

    root.style.setProperty('--primary',        '#00d4aa');
    root.style.setProperty('--primary-dim',    'rgba(0, 212, 170, 0.15)');
    root.style.setProperty('--primary-glow',   '0 0 20px rgba(0, 212, 170, 0.3)');

    root.style.setProperty('--accent',         '#22d3ee');
    root.style.setProperty('--accent-dim',     'rgba(34,211,238,0.15)');

    root.style.setProperty('--text-primary',   '#e2e8f0');
    root.style.setProperty('--text-secondary', '#94a3b8');
    root.style.setProperty('--text-muted',     '#475569');
    root.style.setProperty('--text-inverse',   '#050b14');

    root.style.setProperty('--secondary',      '#6366f1');
    root.style.setProperty('--secondary-dim',  'rgba(99,102,241,0.15)');

    root.style.setProperty('--success',        '#10b981');
    root.style.setProperty('--success-dim',    'rgba(16,185,129,0.15)');
    root.style.setProperty('--warning',        '#f59e0b');
    root.style.setProperty('--warning-dim',    'rgba(245,158,11,0.15)');
    root.style.setProperty('--danger',         '#f43f5e');
    root.style.setProperty('--danger-dim',     'rgba(244,63,94,0.15)');
    root.style.setProperty('--info',           '#3b82f6');
    root.style.setProperty('--info-dim',       'rgba(59,130,246,0.15)');

    root.style.setProperty('--shadow-sm',  '0 1px 3px rgba(0,0,0,0.4)');
    root.style.setProperty('--shadow-md',  '0 4px 16px rgba(0,0,0,0.5)');
    root.style.setProperty('--shadow-lg',  '0 8px 32px rgba(0,0,0,0.6)');
    root.style.setProperty('--shadow-glow-primary', '0 0 40px rgba(0,212,170,0.2)');
    document.body.style.backgroundImage =
      'linear-gradient(rgba(0,212,170,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,170,0.02) 1px, transparent 1px)';
  }
}
