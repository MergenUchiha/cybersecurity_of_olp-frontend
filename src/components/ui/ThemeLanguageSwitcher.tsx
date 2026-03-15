import React from 'react';
import { Sun, Moon, Globe } from 'lucide-react';
import { useUIStore } from '../../lib/uiStore';
import type { Language } from '../../lib/i18n';

const LANG_FLAGS: Record<Language, string> = { en: '🇬🇧', ru: '🇷🇺', tk: '🇹🇲' };
const LANG_LABELS: Record<Language, string> = { en: 'EN', ru: 'RU', tk: 'TK' };

export function ThemeLanguageSwitcher() {
  const { theme, toggleTheme, language, setLanguage, t } = useUIStore();

  const langs: Language[] = ['en', 'ru', 'tk'];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 12px',
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      marginBottom: '8px',
    }}>
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        title={theme === 'dark' ? t.settings.lightTheme : t.settings.darkTheme}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 28,
          height: 28,
          background: theme === 'dark' ? 'var(--primary-dim)' : 'var(--warning-dim)',
          border: `1px solid ${theme === 'dark' ? 'rgba(0,212,170,0.25)' : 'rgba(245,158,11,0.25)'}`,
          borderRadius: '8px',
          cursor: 'pointer',
          color: theme === 'dark' ? 'var(--primary)' : 'var(--warning)',
          transition: 'all 0.2s ease',
          flexShrink: 0,
        }}
      >
        {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
      </button>

      {/* Divider */}
      <div style={{ width: 1, height: 20, background: 'var(--border)', flexShrink: 0 }} />

      {/* Language switcher */}
      <div style={{ display: 'flex', gap: '3px', flex: 1 }}>
        {langs.map(lang => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            title={t.settings[lang === 'en' ? 'english' : lang === 'ru' ? 'russian' : 'turkmen']}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              padding: '4px 2px',
              background: language === lang ? 'var(--primary-dim)' : 'transparent',
              border: `1px solid ${language === lang ? 'var(--border-strong)' : 'transparent'}`,
              borderRadius: '6px',
              cursor: 'pointer',
              color: language === lang ? 'var(--primary)' : 'var(--text-muted)',
              fontSize: '0.65rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: language === lang ? 700 : 400,
              transition: 'all 0.15s ease',
            }}
          >
            <span style={{ fontSize: '0.75rem' }}>{LANG_FLAGS[lang]}</span>
            {LANG_LABELS[lang]}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Floating version for header bar (compact) ───────────
export function HeaderThemeLanguage() {
  const { theme, toggleTheme, language, setLanguage, t } = useUIStore();
  const langs: Language[] = ['en', 'ru', 'tk'];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {/* Language pill */}
      <div style={{
        display: 'flex',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        {langs.map(lang => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            style={{
              padding: '5px 9px',
              background: language === lang ? 'var(--primary-dim)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: language === lang ? 'var(--primary)' : 'var(--text-muted)',
              fontSize: '0.7rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: language === lang ? 700 : 400,
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
            }}
          >
            <span>{LANG_FLAGS[lang]}</span>
            <span>{LANG_LABELS[lang]}</span>
          </button>
        ))}
      </div>

      {/* Theme icon button */}
      <button
        onClick={toggleTheme}
        style={{
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          cursor: 'pointer',
          color: theme === 'dark' ? 'var(--primary)' : 'var(--warning)',
          transition: 'all 0.2s ease',
        }}
      >
        {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
      </button>
    </div>
  );
}
