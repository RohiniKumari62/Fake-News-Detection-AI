import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield } from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'
import { cn } from '../../utils/helpers'

const GOOGLE_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

const APPLE_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
)

export default function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loginWithGoogle, loginWithApple } = useAuthStore()

  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState('')

  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }

    setLoading('email')
    await new Promise((r) => setTimeout(r, 900))

    const user = {
      id: 'user-' + Date.now(),
      name: name || email.split('@')[0],
      email,
      avatar: (name || email)[0].toUpperCase(),
      provider: 'email',
    }
    login(user, 'mock-jwt-token-' + Date.now())
    setLoading(null)
    navigate(from, { replace: true })
  }

  const handleGoogle = async () => {
    setLoading('google')
    await new Promise((r) => setTimeout(r, 1000))
    loginWithGoogle()
    setLoading(null)
    navigate(from, { replace: true })
  }

  const handleApple = async () => {
    setLoading('apple')
    await new Promise((r) => setTimeout(r, 1000))
    loginWithApple()
    setLoading(null)
    navigate(from, { replace: true })
  }

  return (
    <div style={{
      background: 'rgba(17,24,39,0.92)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(31,41,55,0.9)',
      borderRadius: '24px',
      padding: '36px 32px',
      width: '100%',
      maxWidth: '400px',
      boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 12px',
        }}>
          <Shield size={20} color="#60A5FA"/>
        </div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', fontWeight: 700, color: '#E5E7EB', margin: '0 0 4px' }}>
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h1>
        <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>
          {mode === 'login' ? 'Sign in to TruthLens' : 'Start detecting misinformation today'}
        </p>
      </div>

      {/* Social login */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={handleGoogle}
          disabled={!!loading}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', padding: '10px 0',
            background: 'rgba(26,34,54,0.8)', border: '1px solid rgba(31,41,55,0.9)',
            borderRadius: '12px', color: '#E5E7EB', fontSize: '13px', fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading && loading !== 'google' ? 0.5 : 1,
            transition: 'all 0.2s', fontFamily: 'DM Sans, sans-serif',
          }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(31,41,55,0.9)' }}
        >
          {loading === 'google'
            ? <div style={{ width: '16px', height: '16px', border: '2px solid #374151', borderTopColor: '#3B82F6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
            : GOOGLE_ICON}
          Google
        </button>

        <button
          onClick={handleApple}
          disabled={!!loading}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', padding: '10px 0',
            background: 'rgba(26,34,54,0.8)', border: '1px solid rgba(31,41,55,0.9)',
            borderRadius: '12px', color: '#E5E7EB', fontSize: '13px', fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading && loading !== 'apple' ? 0.5 : 1,
            transition: 'all 0.2s', fontFamily: 'DM Sans, sans-serif',
          }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(31,41,55,0.9)' }}
        >
          {loading === 'apple'
            ? <div style={{ width: '16px', height: '16px', border: '2px solid #374151', borderTopColor: '#E5E7EB', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
            : APPLE_ICON}
          Apple
        </button>
      </div>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{ flex: 1, height: '1px', background: 'rgba(31,41,55,0.9)' }}/>
        <span style={{ color: '#6B7280', fontSize: '12px' }}>or continue with email</span>
        <div style={{ flex: 1, height: '1px', background: 'rgba(31,41,55,0.9)' }}/>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {mode === 'signup' && (
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              style={inputStyle}
            />
          </div>
        )}

        <div style={{ position: 'relative' }}>
          <Mail size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }}/>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            style={{ ...inputStyle, paddingLeft: '40px' }}
          />
        </div>

        <div style={{ position: 'relative' }}>
          <Lock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }}/>
          <input
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{ ...inputStyle, paddingLeft: '40px', paddingRight: '44px' }}
          />
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: '2px' }}
          >
            {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
          </button>
        </div>

        {mode === 'login' && (
          <div style={{ textAlign: 'right', marginTop: '-6px' }}>
            <button type="button" style={{ background: 'none', border: 'none', color: '#3B82F6', fontSize: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
              Forgot password?
            </button>
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '10px 14px', color: '#F87171', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!!loading}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '13px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
            border: 'none', color: 'white', fontSize: '14px', fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading && loading !== 'email' ? 0.6 : 1,
            transition: 'all 0.2s', fontFamily: 'DM Sans, sans-serif',
            boxShadow: '0 4px 16px rgba(59,130,246,0.3)',
            marginTop: '4px',
          }}
        >
          {loading === 'email'
            ? <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
            : <>
                {mode === 'login' ? 'Sign in' : 'Create account'}
                <ArrowRight size={15}/>
              </>
          }
        </button>
      </form>

      {/* Toggle mode */}
      <p style={{ textAlign: 'center', marginTop: '20px', color: '#6B7280', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
        <button
          onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
          style={{ background: 'none', border: 'none', color: '#3B82F6', cursor: 'pointer', fontWeight: 600, fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}
        >
          {mode === 'login' ? 'Sign up free' : 'Sign in'}
        </button>
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '11px 14px',
  background: 'rgba(26,34,54,0.8)',
  border: '1px solid rgba(31,41,55,0.9)',
  borderRadius: '12px',
  color: '#E5E7EB', fontSize: '14px',
  fontFamily: 'DM Sans, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
}