import { useState, useEffect } from 'react'
import { GitBranch, RefreshCw, AlertTriangle, Clock, ExternalLink, Database } from 'lucide-react'
import { cn } from '../utils/helpers'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

const CLUSTER_COLORS = {
  'Original':         { bg: 'bg-red-500/20',    text: 'text-red-400',    border: 'border-red-500/30',    dot: '#ef4444' },
  'Early spread':     { bg: 'bg-amber-500/20',  text: 'text-amber-400',  border: 'border-amber-500/30',  dot: '#f59e0b' },
  'Viral mutation':   { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', dot: '#f97316' },
  'Mass replication': { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', dot: '#a855f7' },
}

const PRED_COLORS = {
  FAKE:      'bg-red-500/10 text-red-400',
  REAL:      'bg-emerald-500/10 text-emerald-400',
  UNCERTAIN: 'bg-amber-500/10 text-amber-400',
}

function timeAgo(iso) {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function NetworkGraph({ articles }) {
  if (!articles.length) return null
  const W = 560, H = 260
  const cx = W / 2, cy = H / 2

  // Group articles by clusterLabel
  const groups = {}
  articles.forEach((a) => {
    const label = a.clusterLabel || 'Original'
    if (!groups[label]) groups[label] = []
    groups[label].push(a)
  })

  const nodes = []
  const links = []
  let idx = 0

  Object.entries(groups).forEach(([label, arts]) => {
    const color = CLUSTER_COLORS[label]?.dot || '#6b7280'
    arts.slice(0, 5).forEach((a) => {
      const angle = (idx / Math.min(articles.length, 12)) * Math.PI * 2
      const radius = a.cloneCount > 0 ? 70 : 110
      const x = cx + Math.cos(angle) * radius
      const y = cy + Math.sin(angle) * radius
      const size = Math.max(6, Math.min(16, 6 + (a.cloneCount || 0) * 3))
      nodes.push({ ...a, x, y, color, size, label })
      if (a.cloneCount > 0) links.push({ x1: cx, y1: cy, x2: x, y2: y, color })
      idx++
    })
  })

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="rounded-xl">
      {/* Center hub */}
      <circle cx={cx} cy={cy} r={20} fill="#ef4444" opacity={0.85} />
      <text x={cx} y={cy+1} textAnchor="middle" dominantBaseline="middle" fontSize={8} fill="white" fontWeight="600">DNA HUB</text>

      {/* Links to cloned articles */}
      {links.map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke={l.color} strokeWidth={1.5} opacity={0.5} strokeDasharray="4 3" />
      ))}

      {/* Article nodes */}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={n.size} fill={n.color} opacity={0.85} />
          {n.cloneCount > 0 && (
            <text x={n.x} y={n.y+1} textAnchor="middle" dominantBaseline="middle" fontSize={7} fill="white" fontWeight="700">
              {n.cloneCount}
            </text>
          )}
        </g>
      ))}

      {/* Legend */}
      <text x={10} y={H-8} fontSize={9} fill="#6b7280">Node size = clone count · Lines = related articles</text>
    </svg>
  )
}

export default function DNATracker() {
  const [articles, setArticles] = useState([])
  const [stats,    setStats]    = useState(null)
  const [selected, setSelected] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error,    setError]    = useState(null)
  const [filter,   setFilter]   = useState('all')

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch ALL fingerprinted articles from /api/news
      const [newsRes, statsRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/news?limit=50`),
        fetch(`${BACKEND_URL}/api/dna/stats`),
      ])

      const newsData  = await newsRes.json()
      const statsData = await statsRes.json()

      // Filter only fingerprinted articles
      const fingerprinted = (newsData.results || []).filter(
        (a) => a.fingerprint && a.fingerprint.length > 0
      )

      setArticles(fingerprinted)
      setStats(statsData.stats || null)
    } catch (err) {
      setError('Could not load DNA data. Is the backend running?')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const filtered = filter === 'all'
    ? articles
    : filter === 'clones'
    ? articles.filter((a) => a.cloneCount > 0)
    : articles.filter((a) => a.clusterLabel === filter)

  const withClones = articles.filter((a) => a.cloneCount > 0)

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <GitBranch size={18} className="text-red-400" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-text-base text-lg">MisInfo DNA Tracker</h2>
            <p className="text-xs text-text-muted">Track how fake news spreads and mutates across sources</p>
          </div>
        </div>
        <button onClick={fetchData} disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-2 border border-border text-text-muted text-sm hover:border-primary/30 active:scale-95 transition-all">
          <RefreshCw size={14} className={cn(isLoading && 'animate-spin')} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Fingerprinted',      value: articles.length,                    color: 'text-primary' },
          { label: 'Articles with clones', value: withClones.length,                color: 'text-amber-400' },
          { label: 'Top clone count',    value: Math.max(0, ...articles.map(a => a.cloneCount || 0)), color: 'text-red-400' },
        ].map((s) => (
          <div key={s.label} className="glass-light rounded-2xl p-4 text-center">
            <div className={cn('text-2xl font-display font-bold', s.color)}>{s.value}</div>
            <div className="text-xs text-text-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-sm text-red-400 flex items-center gap-2">
          <AlertTriangle size={15} /> {error}
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Graph */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-light rounded-2xl p-4">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              Propagation network ({articles.length} articles)
            </p>
            {isLoading ? (
              <div className="h-64 flex items-center justify-center text-text-muted text-sm">Loading...</div>
            ) : articles.length > 0 ? (
              <NetworkGraph articles={articles} />
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-text-muted text-sm gap-2">
                <Database size={32} className="opacity-20" />
                <p>No fingerprinted articles yet</p>
                <p className="text-xs opacity-60">Run the backfill command first</p>
              </div>
            )}
          </div>

          {/* Cluster legend */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(CLUSTER_COLORS).map(([label, c]) => (
              <button
                key={label}
                onClick={() => setFilter(filter === label ? 'all' : label)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                  c.bg, c.text, c.border,
                  filter === label && 'ring-2 ring-white/20'
                )}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
                {label} ({articles.filter(a => (a.clusterLabel || 'Original') === label).length})
              </button>
            ))}
            <button
              onClick={() => setFilter(filter === 'clones' ? 'all' : 'clones')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                'bg-purple-500/20 text-purple-400 border-purple-500/30',
                filter === 'clones' && 'ring-2 ring-white/20'
              )}>
              🧬 With clones ({withClones.length})
            </button>
          </div>
        </div>

        {/* Right: Article list */}
        <div className="lg:col-span-2 space-y-2">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            {filter === 'all' ? 'All articles' : filter === 'clones' ? 'Articles with clones' : filter}
            <span className="ml-2 font-normal">({filtered.length})</span>
          </p>

          <div className="space-y-2 max-h-[420px] overflow-y-auto scrollbar-hide pr-1">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="glass-light rounded-xl p-3 animate-pulse">
                  <div className="h-3 bg-white/5 rounded w-3/4 mb-2" />
                  <div className="h-2.5 bg-white/5 rounded w-1/2" />
                </div>
              ))
            ) : filtered.length > 0 ? (
              filtered.map((a) => {
                const cfg = CLUSTER_COLORS[a.clusterLabel || 'Original'] || CLUSTER_COLORS['Original']
                return (
                  <button
                    key={a._id}
                    onClick={() => setSelected(selected?._id === a._id ? null : a)}
                    className={cn(
                      'w-full text-left glass-light rounded-xl p-3 border transition-all hover:border-primary/30 active:scale-[0.99]',
                      selected?._id === a._id ? 'border-primary/40 bg-primary/5' : 'border-transparent'
                    )}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-medium text-text-base line-clamp-2 leading-snug flex-1">
                        {a.title}
                      </p>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        {a.cloneCount > 0 && (
                          <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', cfg.bg, cfg.text, cfg.border)}>
                            🧬 {a.cloneCount}
                          </span>
                        )}
                        <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', PRED_COLORS[a.prediction] || PRED_COLORS.UNCERTAIN)}>
                          {a.prediction}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] text-text-muted">{a.source}</span>
                      <span className="text-[10px] text-text-muted/50">·</span>
                      <Clock size={9} className="text-text-muted/50" />
                      <span className="text-[10px] text-text-muted/50">{timeAgo(a.createdAt)}</span>
                    </div>
                    {a.biasData?.primary_label && a.biasData.primary_label !== 'None detected' && (
                      <div className="mt-1.5">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          🧠 {a.biasData.primary_label}
                        </span>
                      </div>
                    )}
                  </button>
                )
              })
            ) : (
              <div className="text-center py-10 text-text-muted text-sm">
                <p>No articles in this filter</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected article detail */}
      {selected && (
        <div className="glass rounded-2xl p-5 border border-primary/20 space-y-4 animate-fade-in">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Selected article</p>
              <h3 className="font-semibold text-text-base text-sm leading-snug">{selected.title}</h3>
              <p className="text-xs text-text-muted mt-1">{selected.source} · {timeAgo(selected.createdAt)}</p>
            </div>
            <a href={selected.url} target="_blank" rel="noopener noreferrer"
              className="p-2 rounded-xl bg-surface-2 hover:bg-primary/10 transition-colors flex-shrink-0">
              <ExternalLink size={14} className="text-text-muted" />
            </a>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className={cn('text-xs px-3 py-1 rounded-full font-medium border',
              CLUSTER_COLORS[selected.clusterLabel || 'Original']?.bg,
              CLUSTER_COLORS[selected.clusterLabel || 'Original']?.text,
              CLUSTER_COLORS[selected.clusterLabel || 'Original']?.border
            )}>🧬 {selected.clusterLabel || 'Original'}</span>
            <span className="text-xs px-3 py-1 rounded-full font-medium bg-white/5 text-text-muted border border-white/10">
              {selected.cloneCount} clone{selected.cloneCount !== 1 ? 's' : ''} detected
            </span>
            <span className={cn('text-xs px-3 py-1 rounded-full font-medium', PRED_COLORS[selected.prediction] || PRED_COLORS.UNCERTAIN)}>
              {selected.prediction} ({selected.confidence}%)
            </span>
          </div>

          {/* Bias breakdown */}
          {selected.biasData?.biases?.length > 0 && (
            <div className="border-t border-white/5 pt-4">
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-3">Psychological bias detected</p>
              <div className="space-y-2">
                {selected.biasData.biases.filter(b => b.score > 0).slice(0, 4).map((b) => (
                  <div key={b.type} className="flex items-center gap-3">
                    <span className="text-xs text-text-muted w-36 flex-shrink-0">{b.label}</span>
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={cn('h-full rounded-full',
                        b.color === 'red' ? 'bg-red-500' :
                        b.color === 'amber' ? 'bg-amber-500' :
                        b.color === 'purple' ? 'bg-purple-500' : 'bg-blue-500'
                      )} style={{ width: `${b.score}%` }} />
                    </div>
                    <span className="text-xs text-text-muted w-8 text-right">{b.score}%</span>
                  </div>
                ))}
              </div>
              {selected.biasData.explanation && (
                <p className="text-xs text-text-muted/70 mt-3 leading-relaxed border-t border-white/5 pt-3">
                  {selected.biasData.explanation}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}