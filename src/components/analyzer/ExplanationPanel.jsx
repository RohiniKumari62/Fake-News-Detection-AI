import { useState } from 'react'
import { ChevronDown, Tag, ListChecks } from 'lucide-react'
import { cn, getLabelConfig } from '../../utils/helpers'
import Card, { CardHeader, CardBody } from '../common/Card'

export default function ExplanationPanel({ result }) {
  const [open, setOpen] = useState(true)

  if (!result) return null

  const config = getLabelConfig(result.label)

  return (
    <Card className="animate-slide-up animation-delay-100">
      <CardHeader>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center justify-between w-full text-left group"
        >
          <div className="flex items-center gap-2.5">
            <ListChecks size={16} className="text-primary" />
            <span className="font-semibold text-text-base text-sm">Explanation & Evidence</span>
          </div>
          <ChevronDown
            size={16}
            className={cn('text-text-muted transition-transform duration-300', open && 'rotate-180')}
          />
        </button>
      </CardHeader>

      {open && (
        <CardBody className="space-y-5">
          {/* Reasons */}
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              Detection Reasons
            </p>
            <ul className="space-y-2.5">
              {result.reasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-text-muted leading-relaxed">
                  <span className={cn(
                    'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5',
                    config.bg, config.color, 'border', config.border
                  )}>
                    {i + 1}
                  </span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          {/* Keywords */}
          {result.keywords?.length > 0 && (
            <div className="border-t border-border pt-5">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={13} className="text-text-muted" />
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Flagged Keywords
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className={cn(
                      'inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium border transition-all hover:scale-105',
                      result.label === 'REAL'
                        ? 'bg-success/10 text-success border-success/20'
                        : 'bg-danger/10 text-danger border-danger/20'
                    )}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardBody>
      )}
    </Card>
  )
}