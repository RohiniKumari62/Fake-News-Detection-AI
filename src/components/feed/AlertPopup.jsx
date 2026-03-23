// src/components/feed/AlertPopup.jsx — Responsive
import { useState, useEffect } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { cn } from '../../utils/helpers'

const GLOBAL_ALERTS = [
  { id: 'g1', message: 'Fake news trending globally', sub: 'AI-generated images spreading rapidly' },
  { id: 'g2', message: 'Misinformation spike detected', sub: 'Health-related false claims up 40%' },
  { id: 'g3', message: 'Viral hoax identified', sub: 'Fabricated statement circulating' },
]

export default function AlertPopup({ latestFakeResult = null, serverAlert = null }) {
  const [visible, setVisible] = useState(false)
  const [current, setCurrent] = useState(null)
  const [queue,   setQueue]   = useState([])
  const [shownIds] = useState(new Set())

  useEffect(() => {
    if (latestFakeResult?.label === 'FAKE' && !shownIds.has(latestFakeResult.id)) {
      shownIds.add(latestFakeResult.id)
      setQueue((q) => [...q, {
        id: latestFakeResult.id,
        message: 'Fake news detected!',
        sub: (latestFakeResult.content || '').slice(0, 60) + '...',
        resultId: latestFakeResult.id,
      }])
    }
  }, [latestFakeResult])

  useEffect(() => {
    if (serverAlert && !shownIds.has(serverAlert._id || serverAlert.id)) {
      shownIds.add(serverAlert._id || serverAlert.id)
      setQueue((q) => [...q, {
        id: serverAlert._id || serverAlert.id,
        message: serverAlert.message || 'Fake news surge detected!',
        sub: serverAlert.subtext || '',
      }])
    }
  }, [serverAlert])

  useEffect(() => {
    const t = setTimeout(() => {
      setQueue((q) => [...q, GLOBAL_ALERTS[Math.floor(Math.random() * GLOBAL_ALERTS.length)]])
    }, 4000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!visible && queue.length > 0) {
      const [next, ...rest] = queue
      setCurrent(next)
      setVisible(true)
      setQueue(rest)
      const t = setTimeout(() => setVisible(false), 5000)
      return () => clearTimeout(t)
    }
  }, [queue, visible])

  const scrollToCard = () => {
    if (current?.resultId) {
      const el = document.getElementById(`card-${current.resultId}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.classList.add('ring-2', 'ring-red-500/50')
        setTimeout(() => el.classList.remove('ring-2', 'ring-red-500/50'), 2000)
      }
    }
    setVisible(false)
  }

  if (!visible || !current) return null

  return (
    <>
      {/* Mobile: top banner */}
      <div className={cn(
        'fixed top-14 left-2 right-2 z-50 sm:hidden',
        'glass rounded-2xl overflow-hidden border border-red-500/20 shadow-2xl animate-popup-in'
      )}>
        <div className="h-0.5 bg-gradient-to-r from-red-500 to-orange-400" />
        <div className="p-3 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={14} className="text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-text-base leading-snug">{current.message}</p>
            <p className="text-[10px] text-text-muted mt-0.5 line-clamp-1">{current.sub}</p>
          </div>
          <button onClick={() => setVisible(false)} className="p-1 rounded-lg hover:bg-white/5 flex-shrink-0">
            <X size={13} className="text-text-muted" />
          </button>
        </div>
        <div className="flex gap-2 px-3 pb-3">
          {current.resultId && (
            <button onClick={scrollToCard}
              className="flex-1 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-xl active:scale-95 transition-all">
              View
            </button>
          )}
          <button onClick={() => setVisible(false)}
            className="flex-1 py-1.5 bg-white/5 text-text-muted text-xs font-semibold rounded-xl active:scale-95 transition-all">
            Dismiss
          </button>
        </div>
        <div className="h-0.5 bg-white/5">
          <div className="h-full bg-red-500/60 animate-progress-bar" />
        </div>
      </div>

      {/* Desktop: floating corner popup */}
      <div className={cn(
        'fixed top-4 right-4 z-50 w-72 hidden sm:block',
        'glass rounded-2xl overflow-hidden border border-red-500/20 shadow-2xl animate-popup-in'
      )}>
        <div className="h-0.5 bg-gradient-to-r from-red-500 to-orange-400" />
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={15} className="text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-base leading-snug">{current.message}</p>
              <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{current.sub}</p>
            </div>
            <button onClick={() => setVisible(false)} className="p-1 rounded-lg hover:bg-white/5 flex-shrink-0">
              <X size={13} className="text-text-muted" />
            </button>
          </div>
          <div className="flex gap-2 mt-3">
            {current.resultId && (
              <button onClick={scrollToCard}
                className="flex-1 py-2 px-3 bg-red-500 text-white text-xs font-semibold rounded-xl hover:bg-red-600 active:scale-95 transition-all">
                View Details
              </button>
            )}
            <button onClick={() => setVisible(false)}
              className="flex-1 py-2 px-3 bg-white/5 text-text-muted text-xs font-semibold rounded-xl hover:bg-white/10 active:scale-95 transition-all">
              Dismiss
            </button>
          </div>
        </div>
        <div className="h-0.5 bg-white/5">
          <div className="h-full bg-red-500/60 animate-progress-bar" />
        </div>
      </div>
    </>
  )
}