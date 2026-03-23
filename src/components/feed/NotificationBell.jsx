// src/components/feed/NotificationBell.jsx
import { useState, useRef, useEffect } from 'react'
import { Bell, AlertTriangle, CheckCircle, HelpCircle, X } from 'lucide-react'
import { cn } from '../../utils/helpers'

const LABEL_CFG = {
  FAKE:      { Icon: AlertTriangle, color: 'text-red-400',     bg: 'bg-red-500/10' },
  REAL:      { Icon: CheckCircle,   color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  UNCERTAIN: { Icon: HelpCircle,    color: 'text-amber-400',   bg: 'bg-amber-500/10' },
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  return `${Math.floor(m / 60)}h ago`
}

export default function NotificationBell({ alerts = [] }) {
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState(new Set())
  const ref = useRef(null)

  const fakeAlerts = alerts.filter((a) => a.label === 'FAKE' && !dismissed.has(a.id))

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const scrollToCard = (id) => {
    const el = document.getElementById(`card-${id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.classList.add('ring-2', 'ring-red-500/50')
      setTimeout(() => el.classList.remove('ring-2', 'ring-red-500/50'), 2000)
    }
    setOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200',
          'bg-surface-2 border border-border hover:border-primary/30 active:scale-95',
          open && 'bg-surface border-primary/30'
        )}
      >
        <Bell size={16} className={fakeAlerts.length > 0 ? 'text-red-400 animate-bell-ring' : 'text-text-muted'} />
        {fakeAlerts.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-[9px] text-white font-bold">{fakeAlerts.length}</span>
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 glass rounded-2xl shadow-2xl overflow-hidden z-50 animate-dropdown-in">
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-text-base">Alerts</h3>
              <p className="text-xs text-text-muted">{fakeAlerts.length} fake news detected</p>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-white/5 transition-colors">
              <X size={14} className="text-text-muted" />
            </button>
          </div>

          {/* List */}
          <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
            {alerts.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell size={22} className="text-text-muted/30 mx-auto mb-2" />
                <p className="text-sm text-text-muted">No alerts yet</p>
              </div>
            ) : alerts.slice(0, 10).map((alert) => {
              const cfg = LABEL_CFG[alert.label] || LABEL_CFG.UNCERTAIN
              return (
                <div
                  key={alert.id}
                  onClick={() => scrollToCard(alert.id)}
                  className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-white/5"
                >
                  <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0', cfg.bg)}>
                    <cfg.Icon size={13} className={cfg.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-text-base line-clamp-2 leading-snug">
                      {alert.content?.slice(0, 70) || 'News article'}...
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn(
                        'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                        alert.label === 'FAKE' ? 'bg-red-500/15 text-red-400' :
                        alert.label === 'REAL' ? 'bg-emerald-500/15 text-emerald-400' :
                        'bg-amber-500/15 text-amber-400'
                      )}>
                        {alert.label}
                      </span>
                      <span className="text-[10px] text-text-muted/50">{timeAgo(alert.created_at)}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDismissed((p) => new Set([...p, alert.id])) }}
                    className="p-1 rounded-lg hover:bg-white/5 flex-shrink-0"
                  >
                    <X size={11} className="text-text-muted/30" />
                  </button>
                </div>
              )
            })}
          </div>

          {alerts.length > 0 && (
            <div className="px-4 py-3 border-t border-white/5">
              <button
                onClick={() => setDismissed(new Set(alerts.map((a) => a.id)))}
                className="text-xs text-text-muted hover:text-text-base transition-colors"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}