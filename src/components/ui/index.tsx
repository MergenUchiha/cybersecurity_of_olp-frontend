import React from 'react';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

// ─── Button ─────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  leftIcon,
  rightIcon,
  fullWidth,
  children,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const styles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    borderRadius: 'var(--radius-md)',
    border: '1px solid transparent',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all var(--transition-base)',
    whiteSpace: 'nowrap',
    width: fullWidth ? '100%' : undefined,
    opacity: disabled || loading ? 0.6 : 1,
    textDecoration: 'none',
    fontSize: size === 'sm' ? '0.8125rem' : size === 'lg' ? '1rem' : '0.875rem',
    padding: size === 'sm' ? '6px 14px' : size === 'lg' ? '14px 28px' : '10px 20px',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'linear-gradient(135deg, var(--primary), var(--accent))',
      color: 'var(--text-inverse)',
      boxShadow: '0 0 20px rgba(0, 212, 170, 0.25)',
    },
    secondary: {
      background: 'var(--secondary-dim)',
      color: 'var(--secondary)',
      borderColor: 'rgba(99, 102, 241, 0.3)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      borderColor: 'transparent',
    },
    danger: {
      background: 'var(--danger-dim)',
      color: 'var(--danger)',
      borderColor: 'rgba(244, 63, 94, 0.3)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--primary)',
      borderColor: 'var(--border-strong)',
    },
    warning: {
      background: 'var(--warning-dim)',
      color: 'var(--warning)',
      borderColor: 'rgba(245,158,11,0.3)',
    },
    success: {
      background: 'var(--success-dim)',
      color: 'var(--success)',
      borderColor: 'rgba(16, 185, 129, 0.3)',
    },
  };

  return (
    <button
      style={{ ...styles, ...variantStyles[variant] }}
      disabled={disabled || loading}
      className={className}
      {...props}
    >
      {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}

// ─── Badge ──────────────────────────────────────────────
interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  dot?: boolean;
}

export function Badge({ variant = 'neutral', size = 'sm', children, dot }: BadgeProps) {
  const colorMap: Record<string, { bg: string; color: string; border: string }> = {
    primary:   { bg: 'var(--primary-dim)',   color: 'var(--primary)',   border: 'rgba(0,212,170,0.25)' },
    secondary: { bg: 'var(--secondary-dim)', color: 'var(--secondary)', border: 'rgba(99,102,241,0.25)' },
    success:   { bg: 'var(--success-dim)',   color: 'var(--success)',   border: 'rgba(16,185,129,0.25)' },
    warning:   { bg: 'var(--warning-dim)',   color: 'var(--warning)',   border: 'rgba(245,158,11,0.25)' },
    danger:    { bg: 'var(--danger-dim)',    color: 'var(--danger)',    border: 'rgba(244,63,94,0.25)' },
    info:      { bg: 'var(--info-dim)',      color: 'var(--info)',      border: 'rgba(59,130,246,0.25)' },
    neutral:   { bg: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)', border: 'var(--border)' },
  };

  const c = colorMap[variant];
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      background: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
      borderRadius: 'var(--radius-sm)',
      padding: size === 'sm' ? '2px 8px' : '4px 12px',
      fontSize: size === 'sm' ? '0.75rem' : '0.8125rem',
      fontWeight: 500,
      fontFamily: 'var(--font-body)',
      lineHeight: 1.5,
    }}>
      {dot && (
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: c.color,
          flexShrink: 0,
        }} />
      )}
      {children}
    </span>
  );
}

// ─── Spinner ─────────────────────────────────────────────
export function Spinner({ size = 24, color }: { size?: number; color?: string }) {
  return (
    <div style={{
      width: size,
      height: size,
      border: `2px solid var(--border)`,
      borderTopColor: color || 'var(--primary)',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
      flexShrink: 0,
    }} />
  );
}

export function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      flexDirection: 'column',
      gap: '16px',
    }}>
      <Spinner size={40} />
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading...</p>
    </div>
  );
}

// ─── Card ────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  hover?: boolean;
  glow?: boolean;
  padding?: string;
  onClick?: () => void;
}

export function Card({ children, style, hover, glow, padding = '24px', onClick, className }: CardProps) {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding,
        transition: 'all var(--transition-base)',
        cursor: onClick ? 'pointer' : undefined,
        ...(hover ? { ':hover': { borderColor: 'var(--border-strong)', transform: 'translateY(-2px)' } } : {}),
        ...(glow ? { boxShadow: 'var(--shadow-glow-primary)' } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Input ──────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label, error, hint, leftIcon, rightIcon, className, ...props
}, ref) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label style={{
          fontSize: '0.8125rem',
          fontWeight: 500,
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-body)',
        }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {leftIcon && (
          <div style={{
            position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-muted)', pointerEvents: 'none',
          }}>
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          style={{
            width: '100%',
            background: 'var(--bg-elevated)',
            border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-md)',
            padding: `10px ${rightIcon ? '40px' : '14px'} 10px ${leftIcon ? '40px' : '14px'}`,
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            fontFamily: 'var(--font-body)',
            outline: 'none',
            transition: 'border-color var(--transition-fast)',
          }}
          onFocus={e => e.target.style.borderColor = error ? 'var(--danger)' : 'var(--primary)'}
          onBlur={e => e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border)'}
          className={className}
          {...props}
        />
        {rightIcon && (
          <div style={{
            position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
          }}>
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p style={{ fontSize: '0.75rem', color: 'var(--danger)', fontFamily: 'var(--font-body)' }}>{error}</p>}
      {hint && !error && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>{hint}</p>}
    </div>
  );
});
Input.displayName = 'Input';

// ─── Textarea ────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label, error, ...props
}, ref) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    {label && (
      <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
        {label}
      </label>
    )}
    <textarea
      ref={ref}
      style={{
        width: '100%',
        background: 'var(--bg-elevated)',
        border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        color: 'var(--text-primary)',
        fontSize: '0.9rem',
        fontFamily: 'var(--font-body)',
        outline: 'none',
        resize: 'vertical',
        minHeight: '100px',
        transition: 'border-color var(--transition-fast)',
      }}
      onFocus={e => e.target.style.borderColor = 'var(--primary)'}
      onBlur={e => e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border)'}
      {...props}
    />
    {error && <p style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{error}</p>}
  </div>
));
Textarea.displayName = 'Textarea';

// ─── Select ──────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
  label, error, options, ...props
}, ref) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    {label && (
      <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
        {label}
      </label>
    )}
    <select
      ref={ref}
      style={{
        width: '100%',
        background: 'var(--bg-elevated)',
        border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        color: 'var(--text-primary)',
        fontSize: '0.9rem',
        fontFamily: 'var(--font-body)',
        outline: 'none',
        cursor: 'pointer',
        appearance: 'none',
      }}
      {...props}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
));
Select.displayName = 'Select';

// ─── Modal ──────────────────────────────────────────────
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  const widthMap = { sm: 400, md: 560, lg: 720, xl: 900 };
  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(5, 11, 20, 0.85)',
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.2s ease',
        padding: '20px',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-strong)',
        borderRadius: 'var(--radius-xl)',
        width: '100%',
        maxWidth: widthMap[size],
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        animation: 'fadeInUp 0.3s ease',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
      }}>
        {title && (
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{title}</h3>
            <button
              onClick={onClose}
              style={{
                background: 'transparent', border: 'none', color: 'var(--text-muted)',
                cursor: 'pointer', padding: '4px', borderRadius: '6px',
                display: 'flex', alignItems: 'center',
                transition: 'color var(--transition-fast)',
              }}
            >
              ✕
            </button>
          </div>
        )}
        <div style={{ padding: '24px', overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Table ──────────────────────────────────────────────
interface Column<T> {
  key: string;
  header: string;
  width?: string;
  render?: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function Table<T extends { id: string }>({
  columns, data, loading, emptyMessage = 'No data found', onRowClick,
}: TableProps<T>) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)' }}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderBottom: '1px solid var(--border)',
                background: 'var(--bg-surface)',
                width: col.width,
                whiteSpace: 'nowrap',
              }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Spinner />
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{
                padding: '48px', textAlign: 'center',
                color: 'var(--text-muted)', fontSize: '0.875rem',
              }}>
                {emptyMessage}
              </td>
            </tr>
          ) : data.map((row, idx) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              style={{
                borderBottom: '1px solid var(--border-subtle)',
                cursor: onRowClick ? 'pointer' : undefined,
                transition: 'background var(--transition-fast)',
                animation: `fadeIn 0.3s ease ${idx * 0.02}s both`,
              }}
              onMouseEnter={e => { if (onRowClick) (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              {columns.map(col => (
                <td key={col.key} style={{
                  padding: '14px 16px',
                  fontSize: '0.875rem',
                  color: 'var(--text-primary)',
                  verticalAlign: 'middle',
                }}>
                  {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Stat Card ───────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'secondary';
  trend?: { value: number; label: string };
  delay?: number;
}

export function StatCard({ label, value, icon, color = 'primary', delay = 0 }: StatCardProps) {
  const colorMap = {
    primary:   { bg: 'var(--primary-dim)',   color: 'var(--primary)' },
    success:   { bg: 'var(--success-dim)',   color: 'var(--success)' },
    warning:   { bg: 'var(--warning-dim)',   color: 'var(--warning)' },
    danger:    { bg: 'var(--danger-dim)',    color: 'var(--danger)' },
    info:      { bg: 'var(--info-dim)',      color: 'var(--info)' },
    secondary: { bg: 'var(--secondary-dim)', color: 'var(--secondary)' },
  };
  const c = colorMap[color];

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px',
      animation: `fadeInUp 0.4s ease ${delay}s both`,
      transition: 'border-color var(--transition-base), transform var(--transition-base)',
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLElement).style.borderColor = c.color;
      (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 'var(--radius-md)',
        background: c.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: c.color, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 500 }}>
          {label}
        </p>
        <p style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', lineHeight: 1 }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>
    </div>
  );
}

// ─── Empty State ─────────────────────────────────────────
export function EmptyState({ icon, title, description, action }: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '64px 24px', gap: '16px', textAlign: 'center',
    }}>
      {icon && (
        <div style={{ color: 'var(--text-muted)', opacity: 0.5 }}>
          {icon}
        </div>
      )}
      <div>
        <h3 style={{ marginBottom: '8px', fontSize: '1.125rem' }}>{title}</h3>
        {description && <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{description}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── Pagination ──────────────────────────────────────────
export function Pagination({
  page, totalPages, onChange,
}: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', padding: '16px 0' }}>
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        style={{
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          color: page <= 1 ? 'var(--text-muted)' : 'var(--text-secondary)',
          borderRadius: 'var(--radius-sm)', padding: '6px 12px', cursor: page <= 1 ? 'not-allowed' : 'pointer',
          fontSize: '0.875rem', fontFamily: 'var(--font-body)',
        }}
      >←</button>
      {pages.map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          style={{
            background: p === page ? 'var(--primary)' : 'var(--bg-elevated)',
            border: `1px solid ${p === page ? 'var(--primary)' : 'var(--border)'}`,
            color: p === page ? 'var(--text-inverse)' : 'var(--text-secondary)',
            borderRadius: 'var(--radius-sm)', padding: '6px 12px', cursor: 'pointer',
            fontSize: '0.875rem', fontFamily: 'var(--font-body)', fontWeight: p === page ? 600 : 400,
            minWidth: '36px',
          }}
        >{p}</button>
      ))}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        style={{
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          color: page >= totalPages ? 'var(--text-muted)' : 'var(--text-secondary)',
          borderRadius: 'var(--radius-sm)', padding: '6px 12px', cursor: page >= totalPages ? 'not-allowed' : 'pointer',
          fontSize: '0.875rem', fontFamily: 'var(--font-body)',
        }}
      >→</button>
    </div>
  );
}

// ─── Section Header ──────────────────────────────────────
export function SectionHeader({ title, subtitle, action }: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      marginBottom: '24px', gap: '16px', flexWrap: 'wrap',
    }}>
      <div>
        <h2 style={{ fontSize: '1.375rem', marginBottom: subtitle ? '4px' : 0 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── Confirm Dialog ──────────────────────────────────────
export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', danger }: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p style={{ marginBottom: '24px', color: 'var(--text-secondary)' }}>{message}</p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant={danger ? 'danger' : 'primary'} onClick={() => { onConfirm(); onClose(); }}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
