// src/components/feed/BiasPanel.jsx
import { X, Brain, AlertTriangle, TrendingUp } from 'lucide-react'
import { cn } from '../../utils/helpers'

const BIAS_COLORS = {
  red:    { bar: 'bg-red-500',    text: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20' },
  amber:  { bar: 'bg-amber-500',  text: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20' },
  blue:   { bar: 'bg-blue-500',   text: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20' },
  purple: { bar: 'bg-purple-500', text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
}

const RISK_CONFIG = {
  critical: { label: 'Critical',  color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30' },
  high:     { label: 'High',      color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  medium:   { label: 'Medium',    color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/30' },
  low:      { label: 'Low',       color: 'text-emerald-400',bg: 'bg-emerald-500/10',border: 'border-emerald-500/30' },
}

export default function BiasPanel({ article, onClose }) {
  if (!article) return null

  const bias    = article.biasData
  const hasBias = bias && bias.biases && bias.biases.length > 0
  const risk    = RISK_CONFIG[bias?.risk_level] || RISK_CONFIG.low
  const score   = bias?.manipulation_score || 0

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg glass rounded-3xl overflow-hidden border border-white/10 shadow-2xl animate-popup-in">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Brain size={15} className="text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-text-base text-sm">Bias Analysis</h3>
              <p className="text-[11px] text-text-muted line-clamp-1">{article.title?.slice(0, 60)}...</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition-colors">
            <X size={15} className="text-text-muted" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Score + risk */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className={cn(
                'text-4xl font-display font-bold',
                score >= 75 ? 'text-red-400' :
                score >= 50 ? 'text-amber-400' :
                score >= 25 ? 'text-yellow-400' : 'text-emerald-400'
              )}>
                {score}
              </div>
              <div className="text-[11px] text-text-muted">/ 100</div>
              <div className="text-[10px] text-text-muted mt-0.5">Manipulation</div>
            </div>

            <div className="flex-1 space-y-2">
              {bias?.risk_level && (
                <span className={cn('inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border', risk.bg, risk.color, risk.border)}>
                  <AlertTriangle size={11} />
                  {risk.label} risk
                </span>
              )}
              {bias?.primary_label && bias.primary_label !== 'None detected' && (
                <div>
                  <p className="text-[10px] text-text-muted mb-0.5">Primary technique</p>
                  <p className="text-xs font-semibold text-red-400">{bias.primary_label}</p>
                </div>
              )}
              {bias?.secondary_label && (
                <div>
                  <p className="text-[10px] text-text-muted mb-0.5">Secondary</p>
                  <p className="text-xs font-semibold text-amber-400">{bias.secondary_label}</p>
                </div>
              )}
            </div>
          </div>

          {/* Explanation */}
          {bias?.explanation && (
            <p className="text-xs text-text-muted leading-relaxed bg-white/5 rounded-xl p-3 border border-white/5">
              {bias.explanation}
            </p>
          )}

          {/* Bias bars */}
          {hasBias && (
            <div className="space-y-2.5">
              <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Detected techniques</p>
              {bias.biases.filter((b) => b.score > 0).slice(0, 5).map((b) => {
                const cfg = BIAS_COLORS[b.color] || BIAS_COLORS.amber
                return (
                  <div key={b.type}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className={cn('text-xs font-medium', cfg.text)}>{b.label}</span>
                        {b.matched_words?.slice(0, 2).map((w) => (
                          <span key={w} className={cn('text-[9px] px-1.5 py-0.5 rounded font-medium', cfg.bg, cfg.text)}>
                            {w}
                          </span>
                        ))}
                      </div>
                      <span className={cn('text-xs font-bold', cfg.text)}>{b.score}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={cn('h-full rounded-full transition-all duration-700', cfg.bar)}
                        style={{ width: `${b.score}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* No bias */}
          {(!hasBias || score === 0) && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <TrendingUp size={16} className="text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-400">No manipulation detected</p>
                <p className="text-xs text-text-muted">Content appears to use neutral, factual language.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}