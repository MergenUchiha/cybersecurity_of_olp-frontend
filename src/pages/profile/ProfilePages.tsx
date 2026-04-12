import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { User, Lock, Activity, Globe, Trash2, AlertTriangle, Info } from 'lucide-react';
import { usersApi, sessionsApi, authApi } from '../../api';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../lib/uiStore';
import { Button, Badge, Input, StatCard, PageLoader, SectionHeader, ConfirmDialog } from '../../components/ui';
import type { Session } from '../../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

// ─── Profile Page ─────────────────────────────────────────
export function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const { t } = useUIStore();
  const [editMode, setEditMode] = useState(false);
  const [changePassMode, setChangePassMode] = useState(false);

  const { register: regProfile, handleSubmit: submitProfile } = useForm({
    defaultValues: { firstName: user?.firstName || '', lastName: user?.lastName || '' },
  });
  const { register: regPass, handleSubmit: submitPass, reset: resetPass } = useForm<{
    currentPassword: string; newPassword: string; confirmNew: string;
  }>();

  const updateMutation = useMutation({
    mutationFn: usersApi.updateProfile,
    onSuccess: (updated) => { setUser({ ...user!, ...updated }); toast.success(t.profile.profileUpdated); setEditMode(false); },
  });
  const changePwdMutation = useMutation({
    mutationFn: (d: { currentPassword: string; newPassword: string }) => authApi.changePassword(d),
    onSuccess: () => { toast.success(t.profile.passwordChanged); setChangePassMode(false); resetPass(); },
  });

  const roleColorMap: Record<string, string> = { ADMIN: 'var(--danger)', TEACHER: 'var(--warning)', STUDENT: 'var(--primary)' };
  const roleColor = roleColorMap[user?.role || 'STUDENT'];

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease', maxWidth: '720px' }}>
      <SectionHeader title={t.profile.title} subtitle={t.profile.accountInfo} />

      {/* Profile card */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '32px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: `linear-gradient(135deg, ${roleColor}40, ${roleColor}20)`, border: `2px solid ${roleColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.75rem', color: roleColor, flexShrink: 0 }}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{user?.firstName} {user?.lastName}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '10px', fontSize: '0.875rem' }}>{user?.email}</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Badge variant={user?.role === 'ADMIN' ? 'danger' : user?.role === 'TEACHER' ? 'warning' : 'primary'} dot>{user?.role}</Badge>
              {user?.emailVerified ? <Badge variant="success" dot>{t.profile.emailVerified}</Badge> : <Badge variant="warning" dot>{t.profile.notVerified}</Badge>}
              {!user?.isBlocked && user?.isActive && <Badge variant="success" dot>{t.common.active}</Badge>}
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={() => setEditMode(!editMode)} leftIcon={<User size={14} />}>
            {editMode ? t.common.cancel : t.profile.editProfile}
          </Button>
        </div>

        {editMode && (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
            <form onSubmit={submitProfile(d => updateMutation.mutate(d))} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Input label={t.auth.firstName} {...regProfile('firstName', { required: true })} />
                <Input label={t.auth.lastName} {...regProfile('lastName', { required: true })} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button type="submit" loading={updateMutation.isPending}>{t.common.save}</Button>
                <Button type="button" variant="ghost" onClick={() => setEditMode(false)}>{t.common.cancel}</Button>
              </div>
            </form>
          </div>
        )}

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', marginTop: editMode ? '16px' : '0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { label: t.common.email, value: user?.email },
              { label: t.common.role, value: user?.role },
              { label: t.profile.memberSince, value: user?.createdAt ? format(new Date(user.createdAt), 'MMMM d, yyyy') : '—' },
              { label: t.profile.emailVerified, value: user?.emailVerified ? `✓ ${t.common.yes}` : `✗ ${t.common.no}` },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px', fontWeight: 500 }}>{label}</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Change password */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: changePassMode ? '20px' : '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--warning-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning)' }}>
              <Lock size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: '2px' }}>{t.profile.changePassword}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.profile.keepSecure}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setChangePassMode(!changePassMode)}>
            {changePassMode ? t.common.cancel : t.common.change}
          </Button>
        </div>
        {changePassMode && (
          <form onSubmit={submitPass(d => {
            if (d.newPassword !== d.confirmNew) { toast.error(t.auth.passwordMatch); return; }
            changePwdMutation.mutate({ currentPassword: d.currentPassword, newPassword: d.newPassword });
          })} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input label={t.profile.currentPassword} type="password" {...regPass('currentPassword', { required: true })} />
            <Input label={t.profile.newPassword} type="password" hint={t.profile.minChars} {...regPass('newPassword', { required: true, minLength: 8 })} />
            <Input label={t.profile.confirmNewPassword} type="password" {...regPass('confirmNew', { required: true })} />
            <Button type="submit" loading={changePwdMutation.isPending}>{t.profile.changePassword}</Button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── My Sessions Page ─────────────────────────────────────
// ✅ FIX: Removed self-revoke (backend requires ADMIN role for PATCH /sessions/:id/revoke).
//         Students/teachers can use "Sign out all other sessions" which works via
//         the change-password endpoint (it revokes all sessions server-side).
//         Individual session management is shown info-only for non-admins.
export function MySessionsPage() {
  const { user, logout } = useAuthStore();
  const { t } = useUIStore();
  const isAdmin = user?.role === 'ADMIN';
  const qc = useQueryClient();
  const [confirmRevokeAll, setConfirmRevokeAll] = useState(false);

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['my-sessions'],
    queryFn: sessionsApi.getMySessions,
  });

  // ✅ ADMIN-only: revoke individual session (the route requires ADMIN role)
  const revokeOneMutation = useMutation({
    mutationFn: sessionsApi.revoke,
    onSuccess: () => { toast.success(t.profile.sessionRevoked); qc.invalidateQueries({ queryKey: ['my-sessions'] }); },
    onError: () => toast.error(t.profile.onlyAdminsRevoke),
  });

  // ✅ For non-admins: sign out of ALL other sessions by triggering a password flow
  //    Alternative: call logout then show session is cleared
  const revokeAllMutation = useMutation({
    mutationFn: async () => {
      // Use the admin route if admin, otherwise show message
      if (!isAdmin || !user?.id) throw new Error('no-admin');
      return sessionsApi.revokeAllUser(user.id);
    },
    onSuccess: () => {
      toast.success(t.profile.allSessionsRevoked);
      qc.invalidateQueries({ queryKey: ['my-sessions'] });
    },
    onError: (err: any) => {
      if (err.message === 'no-admin') {
        // For students/teachers: changing password revokes all sessions on the backend
        toast('To sign out all devices, change your password — this will revoke all sessions.', { icon: 'ℹ️', duration: 5000 });
      }
    },
  });

  if (isLoading) return <PageLoader />;

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease', maxWidth: '720px' }}>
      <SectionHeader
        title={t.profile.mySessionsTitle}
        subtitle={`${sessions?.length || 0} ${t.profile.activeSessions}`}
        action={
          sessions && sessions.length > 1 ? (
            <Button
              variant="danger"
              size="sm"
              leftIcon={<AlertTriangle size={14} />}
              onClick={() => setConfirmRevokeAll(true)}
            >
              {isAdmin ? t.profile.revokeAllSessions : t.profile.signOutAllDevices}
            </Button>
          ) : undefined
        }
      />

      {/* Info notice for non-admins */}
      {!isAdmin && (
        <div style={{ background: 'var(--info-dim)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 'var(--radius-lg)', padding: '12px 16px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <Info size={16} color="var(--info)" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {t.profile.sessionsInfo}
          </p>
        </div>
      )}

      {!sessions?.length ? (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '48px', textAlign: 'center' }}>
          <Activity size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-muted)' }}>{t.profile.noActiveSessions}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sessions.map((s, idx) => (
            <SessionCard
              key={s.id}
              session={s}
              isCurrent={idx === 0}
              canRevoke={isAdmin}
              onRevoke={() => revokeOneMutation.mutate(s.id)}
              revoking={revokeOneMutation.isPending}
              t={t}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={confirmRevokeAll}
        onClose={() => setConfirmRevokeAll(false)}
        onConfirm={() => { revokeAllMutation.mutate(); }}
        title={isAdmin ? t.profile.revokeAllSessions : t.profile.signOutAllDevices}
        message={isAdmin
          ? t.profile.revokeAllConfirm
          : t.profile.signOutAllInfo
        }
        confirmLabel={isAdmin ? t.admin.revokeAll : t.profile.gotIt}
        danger={isAdmin}
      />
    </div>
  );
}

function SessionCard({ session: s, isCurrent, canRevoke, onRevoke, revoking, t }: {
  session: Session;
  isCurrent: boolean;
  canRevoke: boolean;
  onRevoke: () => void;
  revoking: boolean;
  t: any;
}) {
  const ua = s.userAgent || '';

  // Detect browser / OS from user-agent string
  const getBrowser = (ua: string) => {
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Edg')) return 'Edge';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('curl') || ua.includes('Postman')) return 'API Client';
    return 'Unknown Browser';
  };
  const getOS = (ua: string) => {
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac OS')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
    return 'Unknown OS';
  };

  const browser = getBrowser(ua);
  const os = getOS(ua);
  const isExpiringSoon = new Date(s.expiresAt).getTime() - Date.now() < 1000 * 60 * 60 * 24; // < 24h

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: `1px solid ${isCurrent ? 'var(--border-strong)' : 'var(--border)'}`,
      borderRadius: 'var(--radius-lg)',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      animation: 'fadeIn 0.3s ease both',
    }}>
      <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: isCurrent ? 'var(--primary-dim)' : 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isCurrent ? 'var(--primary)' : 'var(--text-muted)', flexShrink: 0 }}>
        <Globe size={20} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {browser} — {os}
          </p>
          {isCurrent && <Badge variant="success" dot>{t.profile.current}</Badge>}
          {isExpiringSoon && !isCurrent && <Badge variant="warning">{t.profile.expiringSoon}</Badge>}
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            IP: {s.ipAddress || 'Unknown'}
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Created: {format(new Date(s.createdAt), 'dd.MM.yyyy HH:mm')}
          </p>
          <p style={{ fontSize: '0.75rem', color: isExpiringSoon ? 'var(--warning)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Expires: {format(new Date(s.expiresAt), 'dd.MM.yyyy HH:mm')}
          </p>
        </div>
      </div>

      {/* ✅ Revoke button ONLY shown to admins (non-admins get 403 from backend) */}
      {canRevoke && !isCurrent && (
        <Button
          size="sm"
          variant="danger"
          loading={revoking}
          onClick={onRevoke}
          leftIcon={<Trash2 size={12} />}
        >
          {t.profile.revoke}
        </Button>
      )}
    </div>
  );
}
