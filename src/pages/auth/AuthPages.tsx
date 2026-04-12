import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, ArrowRight, User } from 'lucide-react';
import { authApi } from '../../api';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../lib/uiStore';
import { Button, Input } from '../../components/ui';
import toast from 'react-hot-toast';

// APP_FULL_NAME is now sourced from translations: t.app.fullName

// ─── Shared Logo Header ───────────────────────────────────
function AppLogoHeader({ subtitle, appName }: { subtitle?: string; appName: string }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '36px' }}>
      <div style={{
        width: 76, height: 76,
        margin: '0 auto 14px',
        borderRadius: '18px',
        overflow: 'hidden',
        border: '2px solid var(--border-strong)',
        background: '#ffffff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: 'var(--shadow-glow-primary)',
      }}>
        <img
          src="/logo.jpeg"
          alt="Oguz Han Engineering and Technology University of Turkmenistan"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
      <h1 style={{ fontSize: '1.05rem', marginBottom: '6px', lineHeight: 1.4, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>
        {appName}
      </h1>
      {subtitle && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{subtitle}</p>
      )}
    </div>
  );
}

// ─── Login ────────────────────────────────────────────────
export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore(s => s.setAuth);
  const { t } = useUIStore();
  const [showPass, setShowPass] = useState(false);

  const loginSchema = z.object({
    email: z.string().email(t.auth.invalidEmail),
    password: z.string().min(1, t.auth.required),
  });
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      const res = await authApi.login(data);
      setAuth(res.user, res.accessToken, res.refreshToken);
      toast.success(`${t.auth.welcomeMsg} ${res.user.firstName}!`);
      if (res.user.role === 'ADMIN') navigate('/admin');
      else if (res.user.role === 'TEACHER') navigate('/teacher');
      else navigate('/dashboard');
    } catch {}
  };

  return (
    <div style={{ width: '100%', maxWidth: 440, animation: 'fadeInUp 0.4s ease' }}>
      <AppLogoHeader subtitle={t.auth.welcomeBack} appName={t.app.fullName} />

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '32px', boxShadow: 'var(--shadow-lg)' }}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Input label={t.auth.email} type="email" placeholder={t.auth.emailPlaceholder}
            leftIcon={<Mail size={16} />} error={errors.email?.message as string}
            autoComplete="email" {...register('email')} />
          <Input label={t.auth.password} type={showPass ? 'text' : 'password'}
            placeholder={t.auth.passwordPlaceholder} leftIcon={<Lock size={16} />}
            rightIcon={
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--text-muted)' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            error={errors.password?.message as string} autoComplete="current-password"
            {...register('password')} />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="/forgot-password" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              {t.auth.forgotPassword}
            </Link>
          </div>
          <Button type="submit" fullWidth loading={isSubmitting} size="lg" rightIcon={<ArrowRight size={16} />}>
            {t.auth.signIn}
          </Button>
        </form>
        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            {t.auth.noAccount}{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 500 }}>{t.auth.createAccount}</Link>
          </p>
        </div>
      </div>

      {/* Demo credentials */}
      <div style={{ marginTop: '20px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>
          // {t.auth.demoCredentials}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[
            { role: 'Admin', email: 'admin@merdan.com', pass: 'Admin123!' },
            { role: 'Teacher', email: 'teacher@merdan.com', pass: 'Teacher123!' },
            { role: 'Student', email: 'student@merdan.com', pass: 'Student123!' },
          ].map(({ role, email, pass }) => (
            <div key={role} style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', display: 'flex', gap: '8px' }}>
              <span style={{ color: 'var(--primary)', minWidth: '60px' }}>[{role}]</span>
              <span>{email} / {pass}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Register ─────────────────────────────────────────────
export function RegisterPage() {
  const navigate = useNavigate();
  const { t } = useUIStore();
  const [showPass, setShowPass] = useState(false);

  const registerSchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(t.auth.invalidEmail),
    password: z.string().min(8, t.auth.passwordMin)
      .regex(/[A-Z]/, t.auth.mustContainUppercase)
      .regex(/[0-9]/, t.auth.mustContainNumber),
    confirmPassword: z.string(),
  }).refine(d => d.password === d.confirmPassword, { message: t.auth.passwordMatch, path: ['confirmPassword'] });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      await authApi.register({ email: data.email, password: data.password, firstName: data.firstName, lastName: data.lastName });
      toast.success(t.auth.accountCreated);
      navigate('/login');
    } catch {}
  };

  return (
    <div style={{ width: '100%', maxWidth: 480, animation: 'fadeInUp 0.4s ease' }}>
      <AppLogoHeader subtitle={`${t.auth.createAccount} — ${t.auth.secureLms}`} appName={t.app.fullName} />

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '32px', boxShadow: 'var(--shadow-lg)' }}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input label={t.auth.firstName} placeholder={t.auth.firstNamePlaceholder} leftIcon={<User size={16} />}
              error={errors.firstName?.message as string} {...register('firstName')} />
            <Input label={t.auth.lastName} placeholder={t.auth.lastNamePlaceholder}
              error={errors.lastName?.message as string} {...register('lastName')} />
          </div>
          <Input label={t.auth.email} type="email" placeholder={t.auth.emailPlaceholder}
            leftIcon={<Mail size={16} />} error={errors.email?.message as string} {...register('email')} />
          <Input label={t.auth.password} type={showPass ? 'text' : 'password'}
            placeholder={t.auth.passwordHint} leftIcon={<Lock size={16} />}
            rightIcon={
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--text-muted)' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            error={errors.password?.message as string} {...register('password')} />
          <Input label={t.auth.confirmPassword} type={showPass ? 'text' : 'password'}
            placeholder={t.auth.repeatPassword} leftIcon={<Lock size={16} />}
            error={errors.confirmPassword?.message as string} {...register('confirmPassword')} />
          <Button type="submit" fullWidth loading={isSubmitting} size="lg" rightIcon={<ArrowRight size={16} />}>
            {t.auth.register}
          </Button>
        </form>
        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            {t.auth.haveAccount}{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>{t.auth.signIn}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Forgot Password ──────────────────────────────────────
export function ForgotPasswordPage() {
  const { t } = useUIStore();
  const [sent, setSent] = useState(false);
  const [token, setToken] = useState('');
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<{ email: string }>();

  const onSubmit = async (data: { email: string }) => {
    try {
      const res: any = await authApi.requestPasswordReset(data.email);
      if (res.token) setToken(res.token);
      setSent(true);
    } catch {}
  };

  return (
    <div style={{ width: '100%', maxWidth: 400, animation: 'fadeInUp 0.4s ease' }}>
      <AppLogoHeader subtitle={t.auth.resetPassword} appName={t.app.fullName} />
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '32px' }}>
        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✅</div>
            <h3 style={{ marginBottom: '8px' }}>{t.auth.checkEmail}</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              {t.auth.resetLinkSent}
            </p>
            {token && (
              <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '12px', marginBottom: '12px' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>// Dev token (prod: sent via email)</p>
                <Link to={`/reset-password?token=${token}`} style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{t.auth.useToken}</Link>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Input label={t.auth.email} type="email" placeholder={t.auth.emailPlaceholder} leftIcon={<Mail size={16} />} {...register('email', { required: true })} />
            <Button type="submit" fullWidth loading={isSubmitting}>{t.auth.sendResetLink}</Button>
          </form>
        )}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link to="/login" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{t.auth.backToLogin}</Link>
        </div>
      </div>
    </div>
  );
}

// ─── Reset Password ───────────────────────────────────────
export function ResetPasswordPage() {
  const navigate = useNavigate();
  const { t } = useUIStore();
  const token = new URLSearchParams(window.location.search).get('token') || '';
  const [done, setDone] = useState(false);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<{ newPassword: string; confirm: string }>();

  const onSubmit = async (data: { newPassword: string; confirm: string }) => {
    if (data.newPassword !== data.confirm) { toast.error(t.auth.passwordMatch); return; }
    try {
      await authApi.resetPassword({ token, newPassword: data.newPassword });
      setDone(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch {}
  };

  return (
    <div style={{ width: '100%', maxWidth: 400, animation: 'fadeInUp 0.4s ease' }}>
      <AppLogoHeader subtitle={t.auth.resetPassword} appName={t.app.fullName} />
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '32px' }}>
        {done ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>✅</div>
            <p>{t.auth.passwordResetDone}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Input label={t.auth.newPassword} type="password" leftIcon={<Lock size={16} />} {...register('newPassword', { required: true, minLength: 8 })} />
            <Input label={t.auth.confirmPassword} type="password" leftIcon={<Lock size={16} />} {...register('confirm', { required: true })} />
            <Button type="submit" fullWidth loading={isSubmitting}>{t.auth.resetPassword}</Button>
          </form>
        )}
      </div>
    </div>
  );
}