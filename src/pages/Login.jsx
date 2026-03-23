import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import RoboMascot from '../components/auth/RoboMascot'
import LoginForm from '../components/auth/LoginForm'

export default function Login() {
  const { isAuthenticated, _hasHydrated } = useAuthStore()
  const [phase, setPhase] = useState('awareness')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (phase === 'welcome') {
      const t = setTimeout(() => setShowForm(true), 600)
      return () => clearTimeout(t)
    }
  }, [phase])

  if (!_hasHydrated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0B0F19',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          border: '3px solid #1F2937',
          borderTopColor: '#3B82F6',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (isAuthenticated) return <Navigate to="/" replace />

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0B0F19',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'DM Sans, sans-serif',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'absolute', top: '15%', left: '20%', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(59,130,246,0.06)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '15%', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(16,185,129,0.05)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '32px',
        width: '100%',
        maxWidth: '440px',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
          }}>🔍</div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: '20px', color: '#E5E7EB' }}>
            Truth<span style={{ color: '#3B82F6' }}>Lens</span>
          </span>
        </div>

        <div style={{
          transition: 'all 0.5s ease',
          transform: showForm ? 'scale(0.78) translateY(-8px)' : 'scale(1)',
        }}>
          <RoboMascot phase={phase} onDone={() => setPhase('welcome')} />
        </div>

        {phase === 'awareness' && (
          <button
            onClick={() => setPhase('welcome')}
            style={{
              background: 'transparent', border: '1px solid rgba(31,41,55,0.9)',
              borderRadius: '8px', color: '#6B7280', fontSize: '12px',
              padding: '6px 16px', cursor: 'pointer', marginTop: '-16px',
              fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#E5E7EB'; e.currentTarget.style.borderColor = 'rgba(107,114,128,0.5)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.borderColor = 'rgba(31,41,55,0.9)' }}
          >
            Skip intro →
          </button>
        )}

        <div style={{
          width: '100%',
          opacity: showForm ? 1 : 0,
          transform: showForm ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          pointerEvents: showForm ? 'auto' : 'none',
        }}>
          <LoginForm />
        </div>

        <p style={{ color: '#374151', fontSize: '11px', textAlign: 'center', lineHeight: '1.6' }}>
          By signing in you agree to our{' '}
          <a href="#" style={{ color: '#3B82F6', textDecoration: 'none' }}>Terms of Service</a>
          {' '}and{' '}
          <a href="#" style={{ color: '#3B82F6', textDecoration: 'none' }}>Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}