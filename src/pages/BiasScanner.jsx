// src/pages/BiasScanner.jsx
import { useState } from 'react'
import { Brain, AlertTriangle, Send, RefreshCw } from 'lucide-react'
import { cn } from '../utils/helpers'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

const BIAS_COLORS = {
  red:    { bg: 'bg-red-500/10',    text: 'text-red-400',    bar: 'bg-red-500',    border: 'border-red-500/20' },
  amber:  { bg: 'bg-amber-500/10',  text: 'text-amber-400',  bar: 'bg-amber-500',  border: 'border-amber-500/20' },
  blue:   { bg: 'bg-blue-500/10',   text: 'text-blue-400',   bar: 'bg-blue-500',   border: 'border-blue-500/20' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', bar: 'bg-purple-500', border: 'border-purple-500/20' },
  green:  { bg: 'bg-emerald-500/10',text: 'text-emerald-400',bar: 'bg-emerald-500',border: 'border-emerald-500/20' },
}

const RISK_CONFIG = {
  critical: { label: 'Critical', color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30' },
  high:     { label: 'High',     color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  medium:   { label: 'Medium',   color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/30' },
  low:      { label: 'Low',      color: 'text-emerald-400',bg: 'bg-emerald-500/10',border: 'border-emerald-500/30' },
}

export default function BiasScanner() {
  const [text,      setText]      = useState('')
  const [result,    setResult]    = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error,     setError]     = useState(null)

  const handleAnalyze = async () => {
    if (!text.trim() || text.length < 20) return
    setIsLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch(`${BACKEND_URL}/api/dna/analyze`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ text }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'Analysis failed')
      // Extract bias data from response
      setResult(data.bias || data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const riskCfg = result ? (RISK_CONFIG[result.risk_level] || RISK_CONFIG.low) : null

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
          <Brain size={18} className="text-purple-400" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-text-base text-lg">Psychological Bias Scanner</h2>
          <p className="text-xs text-text-muted">Detect which manipulation techniques an article uses against you</p>
        </div>
      </div>

      {/* Input */}
      <div className="glass rounded-2xl p-5 space-y-4">
        <label className="block text-sm font-medium text-text-base">Paste article text to analyze</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 5000))}
          placeholder="Paste any news article, headline, or social media post here to detect psychological manipulation techniques..."
          rows={5}
          className="input-base resize-none"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted font-mono">{text.length} / 5,000</span>
          <div className="flex gap-2">
            {result && (
              <button onClick={() => { setResult(null); setText('') }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-2 border border-border text-text-muted text-sm hover:text-text-base active:scale-95 transition-all">
                <RefreshCw size={13} /> Clear
              </button>
            )}
            <button
              onClick={handleAnalyze}
              disabled={isLoading || text.length < 20}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-semibold rounded-xl disabled:opacity-50 active:scale-95 transition-all shadow-lg shadow-purple-500/20"
            >
              {isLoading ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
              {isLoading ? 'Scanning...' : 'Scan for bias'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-sm text-red-400 flex items-center gap-2">
          <AlertTriangle size={15} /> {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-5 animate-fade-in">
          {/* Score header */}
          <div className="grid grid-cols-3 gap-4">
            {/* Manipulation score */}
            <div className="col-span-1 glass-light rounded-2xl p-5 flex flex-col items-center justify-center text-center">
              <div className={cn(
                'text-4xl font-display font-bold mb-1',
                result.manipulation_score >= 75 ? 'text-red-400' :
                result.manipulation_score >= 50 ? 'text-amber-400' :
                result.manipulation_score >= 25 ? 'text-yellow-400' : 'text-emerald-400'
              )}>
                {result.manipulation_score}
              </div>
              <div className="text-xs text-text-muted">/ 100</div>
              <div className="text-xs font-semibold text-text-muted mt-1">Manipulation score</div>
              {riskCfg && (
                <span className={cn('mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full border', riskCfg.bg, riskCfg.color, riskCfg.border)}>
                  {riskCfg.label} risk
                </span>
              )}
            </div>

            {/* Primary + secondary bias */}
            <div className="col-span-2 glass-light rounded-2xl p-5 space-y-3">
              <div>
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Primary technique</p>
                <p className="text-sm font-semibold text-red-400">{result.primary_label || 'None detected'}</p>
              </div>
              {result.secondary_label && (
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Secondary technique</p>
                  <p className="text-sm font-semibold text-amber-400">{result.secondary_label}</p>
                </div>
              )}
              <p className="text-xs text-text-muted leading-relaxed border-t border-white/5 pt-3">
                {result.explanation}
              </p>
            </div>
          </div>

          {/* Bias breakdown bars */}
          {result.biases?.length > 0 && (
            <div className="glass-light rounded-2xl p-5">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Detected manipulation techniques</p>
              <div className="space-y-3">
                {result.biases.filter(b => b.score > 0).map((bias) => {
                  const cfg = BIAS_COLORS[bias.color] || BIAS_COLORS.amber
                  return (
                    <div key={bias.type}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className={cn('text-xs font-semibold', cfg.text)}>{bias.label}</span>
                          {bias.matched_words?.length > 0 && (
                            <div className="flex gap-1">
                              {bias.matched_words.slice(0, 3).map((w) => (
                                <span key={w} className={cn('text-[9px] px-1.5 py-0.5 rounded font-medium', cfg.bg, cfg.text)}>
                                  {w}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className={cn('text-xs font-bold', cfg.text)}>{bias.score}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={cn('h-full rounded-full transition-all duration-700', cfg.bar)}
                          style={{ width: `${bias.score}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-text-muted/60 mt-1 leading-relaxed">{bias.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {result.manipulation_score === 0 && (
            <div className="glass-light rounded-2xl p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-400 text-lg">✓</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-400">No manipulation detected</p>
                <p className="text-xs text-text-muted">This content appears to use neutral, factual language.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* How it works */}
      {!result && !isLoading && (
        <div className="glass-light rounded-2xl p-5">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">What we detect</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Fear baiting',          desc: 'Triggers threat response', color: 'red' },
              { label: 'False urgency',          desc: 'Artificial time pressure', color: 'amber' },
              { label: 'Authority bias',         desc: 'False credibility claims', color: 'amber' },
              { label: 'Bandwagon effect',       desc: 'Conformity pressure',      color: 'blue' },
              { label: 'Emotional manipulation', desc: 'Extreme emotional language',color: 'red' },
              { label: 'Conspiracy framing',     desc: 'Hidden agenda narratives', color: 'purple' },
            ].map((b) => {
              const cfg = BIAS_COLORS[b.color]
              return (
                <div key={b.label} className={cn('flex items-start gap-2 p-2.5 rounded-xl border', cfg.bg, cfg.border)}>
                  <div className={cn('w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0', `bg-${b.color}-400`)} />
                  <div>
                    <p className={cn('text-xs font-semibold', cfg.text)}>{b.label}</p>
                    <p className="text-[10px] text-text-muted">{b.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}