import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, GraduationCap, Users, Shield,
  BarChart3, Layers, ClipboardList, LogOut, X, Menu,
  Settings, BookMarked, Award, Database, Activity,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../lib/uiStore';
import { authApi } from '../../api';
import { ThemeLanguageSwitcher } from '../ui/ThemeLanguageSwitcher';
import toast from 'react-hot-toast';

interface NavItem { label: string; icon: React.ReactNode; to: string; }
interface NavGroup { title?: string; items: NavItem[]; }

function getNavGroups(role: string, t: any): NavGroup[] {
  if (role === 'ADMIN') return [
    { items: [{ label: t.nav.dashboard, icon: <LayoutDashboard size={18} />, to: '/admin' }] },
    { title: t.nav.management, items: [
      { label: t.nav.users,     icon: <Users size={18} />,        to: '/admin/users' },
      { label: t.nav.courses,   icon: <BookOpen size={18} />,     to: '/admin/courses' },
      { label: t.nav.sessions,  icon: <Database size={18} />,     to: '/admin/sessions' },
      { label: t.nav.auditLogs, icon: <ClipboardList size={18}/>, to: '/admin/audit-logs' },
    ]},
    { title: t.nav.cybersecurity, items: [
      { label: t.nav.security,  icon: <Shield size={18} />,    to: '/admin/security' },
      { label: t.nav.analytics, icon: <BarChart3 size={18} />, to: '/admin/analytics' },
    ]},
    { title: t.nav.account, items: [
      { label: t.nav.profile, icon: <Settings size={18} />, to: '/profile' },
    ]},
  ];
  if (role === 'TEACHER') return [
    { items: [{ label: t.nav.dashboard, icon: <LayoutDashboard size={18} />, to: '/teacher' }] },
    { title: t.nav.teaching, items: [
      { label: t.nav.courses, icon: <BookOpen size={18} />, to: '/teacher/courses' },
    ]},
    { title: t.nav.explore, items: [
      { label: t.nav.courses,   icon: <GraduationCap size={18}/>, to: '/courses' },
      { label: t.nav.myCourses, icon: <BookMarked size={18} />,   to: '/my-courses' },
      { label: t.nav.myResults, icon: <Award size={18} />,        to: '/my-results' },
    ]},
    { title: t.nav.account, items: [
      { label: t.nav.profile,  icon: <Settings size={18} />, to: '/profile' },
      { label: t.nav.sessions, icon: <Activity size={18} />, to: '/sessions' },
    ]},
  ];
  return [
    { items: [{ label: t.nav.dashboard, icon: <LayoutDashboard size={18} />, to: '/dashboard' }] },
    { title: t.nav.learning, items: [
      { label: t.nav.courses,   icon: <GraduationCap size={18}/>, to: '/courses' },
      { label: t.nav.myCourses, icon: <BookMarked size={18} />,   to: '/my-courses' },
      { label: t.nav.myResults, icon: <Award size={18} />,        to: '/my-results' },
    ]},
    { title: t.nav.account, items: [
      { label: t.nav.profile,  icon: <Settings size={18} />, to: '/profile' },
      { label: t.nav.sessions, icon: <Activity size={18} />, to: '/sessions' },
    ]},
  ];
}

interface SidebarProps { mobile?: boolean; onClose?: () => void; }

export function Sidebar({ mobile, onClose }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const { t } = useUIStore();
  const role = user?.role || 'STUDENT';
  const navGroups = getNavGroups(role, t);
  const roleColorMap: Record<string, string> = { ADMIN: 'var(--danger)', TEACHER: 'var(--warning)', STUDENT: 'var(--primary)' };
  const roleColor = roleColorMap[role] || 'var(--primary)';

  const handleLogout = async () => {
    try { const rt = localStorage.getItem('refreshToken'); if (rt) await authApi.logout(rt); } catch {}
    logout(); toast.success(t.auth.loggedOut);
  };

  return (
    <aside style={{
      width: 'var(--sidebar-width)', height: '100vh',
      background: 'var(--bg-surface)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', top: 0, left: 0,
      zIndex: mobile ? 200 : 100, overflowY: 'auto',
    }}>
      {/* Logo & Title */}
      <div style={{
        padding: '16px 16px 14px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1, minWidth: 0 }}>
          {/* University Logo */}
          <div style={{
            width: 44, height: 44, flexShrink: 0,
            borderRadius: '10px', overflow: 'hidden',
            border: '1px solid var(--border-strong)',
            background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img
              src="/logo.jpeg"
              alt="University Logo"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          {/* Title */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '0.72rem',
              lineHeight: 1.35,
              color: 'var(--text-primary)',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            }}>
              {t.app.fullName}
            </p>
            <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '3px' }}>
              {t.app.version}
            </p>
          </div>
        </div>
        {mobile && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', flexShrink: 0 }}>
            <X size={20} />
          </button>
        )}
      </div>

      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        {navGroups.map((group, gi) => (
          <div key={gi} style={{ marginBottom: '4px' }}>
            {group.title && <p style={{ fontSize: '0.63rem', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase', padding: '10px 20px 4px', fontFamily: 'var(--font-mono)' }}>{group.title}</p>}
            {group.items.map(item => (
              <NavLink key={item.to} to={item.to} end={['/','/admin','/teacher','/dashboard'].includes(item.to)} onClick={mobile ? onClose : undefined}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '9px 20px', margin: '1px 8px', borderRadius: 'var(--radius-md)',
                  textDecoration: 'none', fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? roleColor : 'var(--text-secondary)',
                  background: isActive ? `${roleColor}18` : 'transparent',
                  transition: 'all var(--transition-fast)',
                  borderLeft: isActive ? `3px solid ${roleColor}` : '3px solid transparent',
                })}>
                {item.icon}
                <span style={{ flex: 1 }}>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div style={{ padding: '12px 12px 14px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        <ThemeLanguageSwitcher />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', border: '1px solid var(--border)', marginBottom: '8px' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${roleColor}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: roleColor, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0 }}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.firstName} {user?.lastName}</p>
            <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: roleColor, fontWeight: 500 }}>{role}</span>
          </div>
        </div>
        <button onClick={handleLogout}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8125rem', fontFamily: 'var(--font-body)', transition: 'all var(--transition-fast)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--danger)'; (e.currentTarget as HTMLElement).style.color = 'var(--danger)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
        >
          <LogOut size={15} />{t.nav.signOut}
        </button>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '8px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
        <Menu size={20} />
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 190, background: 'rgba(5,11,20,0.7)', backdropFilter: 'blur(4px)' }} />
          <Sidebar mobile onClose={() => setOpen(false)} />
        </>
      )}
    </>
  );
}