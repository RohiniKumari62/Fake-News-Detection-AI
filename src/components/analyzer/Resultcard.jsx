import { cn, getLabelConfig, timeAgo } from '../../utils/helpers'
import { LabelBadge } from '../common/Badge'
import { ShieldCheck, ShieldAlert, ShieldQuestion, Clock } from 'lucide-react'

const ICONS = {
  REAL: ShieldCheck,
  FAKE: ShieldAlert,
  UNCERTAIN: ShieldQuestion,
}

export default function ResultCard({ result }) {
  if (!result) return null

  const config = getLabelConfig(result.label)
  const Icon = ICONS[result.label] || ShieldQuestion

  return (
    <div className={cn(
      'rounded-2xl border p-6 animate-slide-up transition-all duration-300',
      'bg-surface',
      config.border,
    )}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-4">
          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', config.bg, 'border', config.border)}>
            <Icon size={22} className={config.color} />
          </div>
          <div>
            <p className="text-xs text-text-muted font-medium mb-1 uppercase tracking-wider">Verdict</p>
            <LabelBadge label={result.label} size="lg" />
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-muted mb-1 uppercase tracking-wider">Confidence</p>
          <p className={cn('text-3xl font-display font-bold', config.color)}>{result.confidence}%</p>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-text-muted mb-1.5">
          <span>Confidence Score</span>
          <span className="font-mono">{result.confidence}%</span>
        </div>
        <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-1000 ease-out', {
              'bg-gradient-to-r from-danger to-red-400': result.label === 'FAKE',
              'bg-gradient-to-r from-success to-emerald-400': result.label === 'REAL',
              'bg-gradient-to-r from-warning to-amber-300': result.label === 'UNCERTAIN',
            })}
            style={{ width: `${result.confidence}%` }}
          />
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm text-text-muted leading-relaxed border-t border-border pt-4">
        {result.summary}
      </p>

      {/* Timestamp */}
      <div className="flex items-center gap-1.5 mt-3 text-xs text-text-muted/60">
        <Clock size={11} />
        <span>Analysed {timeAgo(result.created_at)}</span>
      </div>
    </div>
  )
}