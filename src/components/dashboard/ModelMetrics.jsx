// src/components/dashboard/ModelMetrics.jsx
import { useState, useEffect } from 'react'
import { Brain, TrendingUp, Target, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '../../utils/helpers'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
const ML_URL      = import.meta.env.VITE_ML_API_URL  || 'http://localhost:8000'

export default function ModelMetrics() {
  const [metrics,   setMetrics]   = useState(null)
  const [status,    setStatus]    = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error,     setError]     = useState(null)

  const fetchMetrics = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const [metricsRes, statusRes] = await Promise.allSettled([
        fetch(`${ML_URL}/api/v1/model/metrics`),
        fetch(`${ML_URL}/api/v1/model/status`),
      ])

      if (metricsRes.status === 'fulfilled' && metricsRes.value.ok) {
        const data = await metricsRes.value.json()
        setMetrics(data)
      }
      if (statusRes.status === 'fulfilled' && statusRes.value.ok) {
        const data = await statusRes.value.json()
        setStatus(data)
      }
    } catch (err) {
      setError('Could not load model metrics')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchMetrics() }, [])

  const isTrained = metrics?.trained && status?.model_used === 'trained'

  const METRIC_CARDS = metrics?.display ? [
    { label: 'Accuracy',  value: metrics.display.accuracy,  color: 'text-primary',    icon: Target },
    { label: 'F1 Score',  value: metrics.display.f1_score,  color: 'text-emerald-400',icon: TrendingUp },
    { label: 'Precision', value: metrics.display.precision, color: 'text-blue-400',   icon: Brain },
    { label: 'Recall',    value: metrics.display.recall,    color: 'text-amber-400',  icon: CheckCircle },
  ] : []

  if (isLoading) {
    return (
      <div className="glass-light rounded-2xl p-5 animate-pulse">
        <div className="h-4 bg-white/5 rounded w-1/3 mb-4" />
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-white/5 rounded-xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="glass-light rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Brain size={15} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-base">AI Model Performance</h3>
            <p className="text-[11px] text-text-muted">
              {status?.model_name || 'Not loaded'} · {metrics?.dataset || ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn(
            'flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border',
            isTrained
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          )}>
            {isTrained
              ? <><CheckCircle size={10} /> Trained</>
              : <><AlertCircle size={10} /> Fallback</>
            }
          </div>
          <button onClick={fetchMetrics}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <RefreshCw size={13} className="text-text-muted" />
          </button>
        </div>
      </div>

      {/* Not trained warning */}
      {!isTrained && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-400">
          <p className="font-semibold mb-0.5">Model not trained yet</p>
          <p className="text-amber-400/70">
            Run: <code className="bg-black/20 px-1 rounded">python ml/training/train.py --dataset liar --epochs 3</code>
          </p>
        </div>
      )}

      {/* Metric cards */}
      {METRIC_CARDS.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {METRIC_CARDS.map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="bg-surface rounded-xl p-3 border border-border">
              <div className="flex items-center gap-2 mb-1.5">
                <Icon size={13} className={cn('opacity-70', color)} />
                <span className="text-[11px] text-text-muted font-medium">{label}</span>
              </div>
              <p className={cn('text-xl font-display font-bold', color)}>{value}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-text-muted text-sm">
          <Brain size={28} className="opacity-20 mx-auto mb-2" />
          <p>Train the model to see metrics here</p>
        </div>
      )}

      {/* Training history sparkline */}
      {metrics?.history?.length > 0 && (
        <div>
          <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">
            Training history (F1 per epoch)
          </p>
          <div className="flex items-end gap-1 h-12">
            {metrics.history.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-primary/60 rounded-sm"
                  style={{ height: `${(h.f1_score || 0) * 48}px` }}
                />
                <span className="text-[9px] text-text-muted">{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Model info footer */}
      {metrics?.trained_at && (
        <p className="text-[10px] text-text-muted/50">
          Trained: {new Date(metrics.trained_at).toLocaleDateString()} ·
          Epochs: {metrics.epochs} ·
          Dataset: {metrics.dataset}
        </p>
      )}
    </div>
  )
}