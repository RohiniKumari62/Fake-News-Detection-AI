import { Globe, ShieldCheck, Lock, ExternalLink } from 'lucide-react'
import { cn } from '../../utils/helpers'

const MOCK_SOURCES = [
  { domain: 'reuters.com', score: 94, tier: 'Highly credible', color: 'success' },
  { domain: 'apnews.com', score: 91, tier: 'Highly credible', color: 'success' },
  { domain: 'bbc.com', score: 88, tier: 'Credible', color: 'success' },
]

const TIER_STYLES = {
  success: 'text-success bg-success/10 border-success/20',
  warning: 'text-warning bg-warning/10 border-warning/20',
  danger: 'text-danger bg-danger/10 border-danger/20',
}

export default function SourcePanel({ url }) {
  const isLocked = !url

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
        <Globe size={15} className="text-primary" />
        <span className="text-sm font-semibold text-text-base">Source Credibility</span>
        <span className="ml-auto text-xs text-warning bg-warning/10 border border-warning/20 px-2 py-0.5 rounded-md flex items-center gap-1">
          <Lock size={10} />
          Phase 4
        </span>
      </div>

      <div className="px-5 py-4">
        {isLocked ? (
          <div className="text-center py-4">
            <ShieldCheck size={28} className="text-text-muted mx-auto mb-2" />
            <p className="text-sm text-text-base font-medium mb-1">Source scoring ready</p>
            <p className="text-xs text-text-muted">Submit a URL to see the domain credibility score.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-text-muted mb-3">
              Credibility scores are based on historical accuracy, editorial standards and bias tracking.
            </p>
            {MOCK_SOURCES.map((source) => (
              <div key={source.domain} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-surface-2 border border-border flex items-center justify-center flex-shrink-0">
                  <Globe size={13} className="text-text-muted" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-text-base truncate">{source.domain}</span>
                    <a href={`https://${source.domain}`} target="_blank" rel="noopener noreferrer"
                      className="text-text-muted hover:text-primary transition-colors">
                      <ExternalLink size={10} />
                    </a>
                  </div>
                  <span className={cn('text-xs px-1.5 py-0.5 rounded border', TIER_STYLES[source.color])}>
                    {source.tier}
                  </span>
                </div>
                <span className={cn('text-sm font-display font-bold flex-shrink-0', {
                  'text-success': source.score >= 80,
                  'text-warning': source.score >= 50 && source.score < 80,
                  'text-danger': source.score < 50,
                })}>
                  {source.score}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}