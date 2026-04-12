import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUIStore } from '../lib/uiStore';
import { Button } from '../components/ui';
import { ArrowLeft, Home, Shield } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();
  const { t } = useUIStore();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'var(--bg-base)',
      flexDirection: 'column',
      textAlign: 'center',
      gap: '0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Glow bg */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,170,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ animation: 'fadeInUp 0.5s ease', maxWidth: '480px', position: 'relative' }}>
        {/* Big 404 */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(6rem, 20vw, 9rem)',
          lineHeight: 1,
          background: 'linear-gradient(135deg, var(--primary), var(--accent))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '16px',
          letterSpacing: '-4px',
        }}>
          404
        </div>

        {/* Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{ width: 64, height: 64, borderRadius: '20px', background: 'var(--primary-dim)', border: '1px solid var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <Shield size={30} />
          </div>
        </div>

        <h1 style={{ fontSize: '1.625rem', marginBottom: '12px', fontFamily: 'var(--font-display)' }}>
          {t.notFound.title}
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '36px', lineHeight: 1.7, fontSize: '0.9375rem' }}>
          {t.notFound.description}
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="ghost" leftIcon={<ArrowLeft size={16} />} onClick={() => navigate(-1)}>
            {t.notFound.goBack}
          </Button>
          <Link to="/">
            <Button leftIcon={<Home size={16} />}>
              {t.notFound.goHome}
            </Button>
          </Link>
        </div>
      </div>

      {/* Matrix-style decorative lines */}
      <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', opacity: 0.4, whiteSpace: 'nowrap' }}>
        ERR_ROUTE_NOT_FOUND :: 0x404 :: CyberLearn Secure LMS
      </div>
    </div>
  );
}
