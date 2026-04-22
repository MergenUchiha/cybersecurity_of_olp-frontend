import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, MobileNav } from './Sidebar';
import { useAuthStore } from '../../store/authStore';
import { Badge } from '../ui';
import { HeaderThemeLanguage } from '../ui/ThemeLanguageSwitcher';

export function AppLayout() {
  const { user } = useAuthStore();
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      <div className="sidebar-wrapper"><Sidebar /></div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header className="app-header" style={{ height: 'var(--header-height)', background: 'var(--bg-surface)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 50, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><MobileNav /></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <HeaderThemeLanguage />
            <Badge variant={user?.role === 'ADMIN' ? 'danger' : user?.role === 'TEACHER' ? 'warning' : 'primary'} dot>{user?.role}</Badge>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-dim), var(--accent-dim))', border: '1px solid var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem', color: 'var(--primary)', cursor: 'pointer' }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
          </div>
        </header>
        <main style={{ flex: 1, padding: '28px', overflowY: 'auto', overflowX: 'hidden' }}><Outlet /></main>
      </div>
    </div>
  );
}

export function AuthLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', top: '20px', right: '24px', zIndex: 10 }}><HeaderThemeLanguage /></div>
      <div style={{ position: 'fixed', top: '-20%', left: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,170,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-20%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <Outlet />
    </div>
  );
}
