import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScanSearch, Zap, ShieldCheck, BarChart3, ArrowRight, Link2, Type } from 'lucide-react'
import { cn } from '../utils/helpers'
import Button from '../components/common/Button'

const STEPS = [
  {
    icon: Type,
    step: '01',
    title: 'Submit Content',
    desc: 'Paste a news headline, full article, or a URL from any news website.',
  },
  {
    icon: Zap,
    step: '02',
    title: 'AI Analysis',
    desc: 'Our DistilBERT model analyses the content for misinformation patterns in under 2 seconds.',
  },
  {
    icon: ShieldCheck,
    step: '03',
    title: 'Explainable Result',
    desc: 'Receive a verdict with confidence score, highlighted keywords and detailed reasoning.',
  },
]

const STATS = [
  { value: '94.2%', label: 'Model Accuracy' },
  { value: '< 2s', label: 'Response Time' },
  { value: '50K+', label: 'Articles Verified' },
  { value: '12+', label: 'Languages Supported' },
]

export default function Home() {
  const navigate = useNavigate()
  const [inputType, setInputType] = useState('text')
  const [heroInput, setHeroInput] = useState('')

  const handleQuickAnalyze = () => {
    if (!heroInput.trim()) {
      navigate('/analyze')
      return
    }
    navigate('/analyze', { state: { content: heroInput, type: inputType } })
  }

  return (
    <div className="space-y-16 pb-8 animate-fade-in">
      {/* Hero */}
      <section className="text-center pt-8 space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-4 py-2 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          AI-Powered · Explainable · Real-Time
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight text-balance">
          Verify News Instantly{' '}
          <span className="gradient-text">with AI</span>
        </h1>

        <p className="text-text-muted text-lg leading-relaxed max-w-xl mx-auto">
          TruthLens uses transformer-based AI to detect misinformation with explainable results —
          showing you <em className="not-italic text-text-base">why</em> something is flagged, not just that it is.
        </p>

        {/* Quick input */}
        <div className="bg-surface border border-border rounded-2xl p-4 text-left shadow-card max-w-xl mx-auto space-y-3">
          <div className="flex gap-1 bg-surface-2 rounded-xl p-1 w-fit border border-border">
            {[
              { type: 'text', label: 'Text', Icon: Type },
              { type: 'url', label: 'URL', Icon: Link2 },
            ].map(({ type, label, Icon }) => (
              <button
                key={type}
                onClick={() => setInputType(type)}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  inputType === type ? 'bg-primary text-white' : 'text-text-muted hover:text-text-base'
                )}
              >
                <Icon size={12} />{label}
              </button>
            ))}
          </div>

          {inputType === 'url' ? (
            <input
              type="url"
              value={heroInput}
              onChange={(e) => setHeroInput(e.target.value)}
              placeholder="https://example.com/article"
              className="input-base"
            />
          ) : (
            <textarea
              value={heroInput}
              onChange={(e) => setHeroInput(e.target.value)}
              placeholder="Paste a news headline or article…"
              rows={3}
              className="input-base resize-none"
            />
          )}

          <Button
            variant="primary"
            size="lg"
            icon={ScanSearch}
            className="w-full justify-center"
            onClick={handleQuickAnalyze}
          >
            Analyse Now
          </Button>
        </div>
      </section>

      {/* Stats row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
        {STATS.map(({ value, label }) => (
          <div key={label} className="text-center">
            <p className="font-display text-2xl font-bold gradient-text">{value}</p>
            <p className="text-xs text-text-muted mt-1">{label}</p>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl font-bold text-text-base mb-2">How It Works</h2>
          <p className="text-text-muted text-sm">Three steps from input to insight</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* connector line */}
          <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          {STEPS.map(({ icon: Icon, step, title, desc }) => (
            <div key={step} className="bg-surface border border-border rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 group">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Icon size={18} className="text-primary" />
                </div>
                <span className="font-mono text-xs text-text-muted mt-1 pt-2">{step}</span>
              </div>
              <h3 className="font-semibold text-text-base mb-2">{title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button variant="secondary" size="lg" icon={ArrowRight} onClick={() => navigate('/analyze')}>
            Try the Analyser
          </Button>
        </div>
      </section>

      {/* Feature callouts */}
      <section className="bg-surface border border-border rounded-2xl p-8 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '🤖', title: 'DistilBERT Model', desc: 'Transformer model fine-tuned on thousands of real and fake news articles.' },
            { icon: '💡', title: 'LIME & SHAP XAI', desc: 'Explainability layer highlights exactly which words triggered the verdict.' },
            { icon: '📊', title: 'Analytics Dashboard', desc: 'Track trends, view history, and monitor detection patterns over time.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="space-y-2">
              <div className="text-2xl">{icon}</div>
              <h3 className="font-semibold text-text-base text-sm">{title}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}