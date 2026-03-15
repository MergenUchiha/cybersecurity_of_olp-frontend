import React from 'react';

// Base shimmer animation
const shimmerStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--bg-hover) 50%, var(--bg-elevated) 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
  borderRadius: 'var(--radius-md)',
};

function SkeletonBox({ w, h, style }: { w?: string | number; h?: string | number; style?: React.CSSProperties }) {
  return (
    <div style={{ ...shimmerStyle, width: w || '100%', height: h || 16, flexShrink: 0, ...style }} />
  );
}

export function SkeletonCard() {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <SkeletonBox h={120} style={{ borderRadius: 'var(--radius-md)' }} />
      <SkeletonBox w="70%" h={18} />
      <SkeletonBox w="90%" h={13} />
      <SkeletonBox w="50%" h={13} />
      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
        <SkeletonBox w="40%" h={34} />
        <SkeletonBox w="30%" h={34} />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
      <SkeletonBox w={36} h={36} style={{ borderRadius: '50%', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <SkeletonBox w="55%" h={14} />
        <SkeletonBox w="35%" h={11} />
      </div>
      <SkeletonBox w={80} h={26} />
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      <SkeletonBox w={48} h={48} style={{ borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <SkeletonBox w="60%" h={12} />
        <SkeletonBox w="40%" h={28} />
      </div>
    </div>
  );
}

export function SkeletonStats({ count = 4 }: { count?: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${count}, 1fr)`, gap: '16px' }}>
      {Array.from({ length: count }).map((_, i) => <SkeletonStat key={i} />)}
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div>
      <div style={{ display: 'flex', gap: '16px', padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
        {Array.from({ length: cols }).map((_, i) => <SkeletonBox key={i} w={`${100 / cols}%`} h={12} />)}
      </div>
      {Array.from({ length: rows }).map((_, i) => <SkeletonRow key={i} />)}
    </div>
  );
}

export function SkeletonCards({ count = 6 }: { count?: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  const widths = ['100%', '85%', '92%', '70%', '88%', '75%'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBox key={i} w={widths[i % widths.length]} h={14} />
      ))}
    </div>
  );
}
