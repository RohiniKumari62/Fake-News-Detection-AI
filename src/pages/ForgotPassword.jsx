import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, Shield, CheckCircle } from 'lucide-react'
import Button from '../components/common/Button'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) { setError('Please enter your email.'); return }
    setError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4" style={{
      backgroundImage: 'linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)',
      backgroundSize: '40px 40px',
    }}>
      <div className="w-full max-w-sm animate-slide-up">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Shield size={16} className="text-primary" />
          </div>
          <span className="font-display font-bold text-xl text-text-base">
            Truth<span className="text-primary">Lens</span>
          </span>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-8 shadow-card">
          {!sent ? (
            <>
              <div className="text-center mb-6">
                <h1 className="font-display text-xl font-bold text-text-base mb-1">Reset password</h1>
                <p className="text-sm text-text-muted">Enter your email and we'll send a reset link.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="input-base pl-10"
                  />
                </div>
                {error && (
                  <p className="text-xs text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">{error}</p>
                )}
                <Button
                  variant="primary" size="lg"
                  loading={loading}
                  className="w-full justify-center"
                  type="submit"
                >
                  Send reset link
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-2">
              <div className="w-12 h-12 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={22} className="text-success" />
              </div>
              <h2 className="font-display text-lg font-bold text-text-base mb-2">Check your inbox</h2>
              <p className="text-sm text-text-muted leading-relaxed mb-4">
                We've sent a password reset link to <span className="text-text-base font-medium">{email}</span>
              </p>
              <p className="text-xs text-text-muted">Didn't receive it? Check your spam folder.</p>
            </div>
          )}

          <div className="mt-5 pt-5 border-t border-border text-center">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors">
              <ArrowLeft size={13} />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}