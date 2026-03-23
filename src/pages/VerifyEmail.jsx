import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, CheckCircle, RefreshCw, Mail } from 'lucide-react'
import Button from '../components/common/Button'
import { useAuthStore } from '../store/useAuthStore'

export default function VerifyEmail() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [resent, setResent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleResend = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    setResent(true)
    setTimeout(() => setResent(false), 5000)
  }

  const handleVerified = () => navigate('/')

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

        <div className="bg-surface border border-border rounded-2xl p-8 shadow-card text-center">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
            <Mail size={24} className="text-primary" />
          </div>

          <h1 className="font-display text-xl font-bold text-text-base mb-2">Verify your email</h1>
          <p className="text-sm text-text-muted leading-relaxed mb-1">
            We sent a verification link to
          </p>
          <p className="text-sm font-medium text-text-base mb-6">
            {user?.email || 'your email address'}
          </p>

          <div className="bg-surface-2 border border-border rounded-xl p-4 text-left mb-6 space-y-2">
            {[
              'Open your email inbox',
              'Click the verification link',
              'You\'ll be redirected back automatically',
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-text-muted">
                <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">
                  {i + 1}
                </div>
                {step}
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <Button variant="primary" size="md" icon={CheckCircle} className="w-full justify-center" onClick={handleVerified}>
              I've verified my email
            </Button>
            <Button
              variant="secondary" size="md" icon={RefreshCw}
              loading={loading}
              className="w-full justify-center"
              onClick={handleResend}
            >
              {resent ? 'Email sent!' : 'Resend email'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}