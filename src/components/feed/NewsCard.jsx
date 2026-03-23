// src/components/feed/NewsCard.jsx — Fully responsive
import { useState } from 'react'
import { Heart, Share2, Bookmark, ExternalLink, AlertTriangle, GitBranch, Brain } from 'lucide-react'
import { cn } from '../../utils/helpers'
import GraphView from './GraphView'
import BiasPanel from './BiasPanel'

const STATUS_CONFIG = {
  FAKE: {
    badge: '⚠️ FAKE', badgeClass: 'bg-red-500/90 text-white',
    borderClass: 'border-red-500/30', glowClass: 'shadow-[0_0_24px_rgba(239,68,68,0.10)]',
    warning: '⚠️ Potentially misleading content',
    warningClass: 'bg-red-500/10 border-red-500/20 text-red-400',
    barClass: 'from-red-500 to-red-400', iconClass: 'text-red-400', pulse: true,
  },
  REAL: {
    badge: '✅ TRUE', badgeClass: 'bg-emerald-500/90 text-white',
    borderClass: 'border-emerald-500/20', glowClass: '',
    warning: null, warningClass: '',
    barClass: 'from-emerald-500 to-emerald-400', iconClass: 'text-emerald-400', pulse: false,
  },
  UNCERTAIN: {
    badge: '❓ UNCERTAIN', badgeClass: 'bg-amber-500/90 text-white',
    borderClass: 'border-amber-500/20', glowClass: '',
    warning: null, warningClass: '',
    barClass: 'from-amber-400 to-amber-300', iconClass: 'text-amber-400', pulse: false,
  },
}

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80',
  'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&q=80',
  'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=600&q=80',
  'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80',
]

function timeAgo(iso) {
  if (!iso) return 'recently'
  try {
    const diff = Date.now() - new Date(iso).getTime()
    if (isNaN(diff)) return 'recently'
    const m = Math.floor(diff / 60000)
    if (m < 1) return 'just now'
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  } catch { return 'recently' }
}

export default function NewsCard({ result, index = 0 }) {
  const [liked,      setLiked]      = useState(false)
  const [saved,      setSaved]      = useState(false)
  const [likeCount]                 = useState(Math.floor(Math.random() * 400) + 20)
  const [localLikes, setLocalLikes] = useState(0)
  const [copied,     setCopied]     = useState(false)
  const [imgError,   setImgError]   = useState(false)
  const [showGraph,  setShowGraph]  = useState(false)
  const [showBias,   setShowBias]   = useState(false)

  const label      = result?.prediction  || result?.label      || 'UNCERTAIN'
  const cfg        = STATUS_CONFIG[label] || STATUS_CONFIG.UNCERTAIN
  const title      = result?.title       || 'Untitled Article'
  const body       = result?.description || result?.summary    || result?.content || ''
  const sourceName = result?.source      || 'TruthLens AI'
  const timestamp  = result?.createdAt   || result?.created_at || result?.publishedAt
  const confidence = result?.confidence  ?? 50
  const cardId     = result?._id         || result?.id         || `card-${index}`
  const articleUrl = result?.url         || '#'
  const clusterId  = result?.clusterId   || null
  const cloneCount = result?.cloneCount  || 0
  const hasBias    = result?.biasData?.manipulation_score > 20
  const primaryBias= result?.biasData?.primary_label

  const imgSrc = (!imgError && result?.image)
    ? result.image
    : PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length]

  const handleLike = () => {
    setLiked((v) => { setLocalLikes((c) => v ? c - 1 : c + 1); return !v })
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { }
  }

  return (
    <>
      <article
        id={`card-${cardId}`}
        className={cn(
          'news-card rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-300 border',
          'hover:-translate-y-0.5',
          cfg.borderClass, cfg.glowClass,
          'animate-card-in'
        )}
        style={{ animationDelay: `${Math.min(index, 10) * 70}ms` }}
      >
        {/* Image — lazy loaded */}
        <div className="relative overflow-hidden">
          <img
            src={imgSrc}
            alt={title}
            loading="lazy"
            className="w-full h-44 sm:h-52 object-cover transition-transform duration-500 hover:scale-105"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Status badge — always top right */}
          <div className={cn(
            'absolute top-2 right-2 sm:top-3 sm:right-3 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold shadow-lg backdrop-blur-md',
            cfg.badgeClass,
            cfg.pulse && 'animate-badge-pulse'
          )}>
            {cfg.badge}
          </div>

          {/* Clone badge */}
          {cloneCount > 0 && (
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-1 rounded-full text-[9px] sm:text-[10px] font-bold bg-blue-500/80 text-white backdrop-blur-md">
              🧬 {cloneCount}
            </div>
          )}

          {/* Source */}
          <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
            <span className="text-white/80 text-[10px] sm:text-xs font-medium bg-black/30 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg">
              {sourceName}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-3 sm:p-4 space-y-2.5 sm:space-y-3">

          {/* Title */}
          <h2 className="font-display font-bold text-text-base text-sm leading-snug line-clamp-2">
            {title}
          </h2>

          {/* Description */}
          {body && (
            <p className="text-xs text-text-muted leading-relaxed line-clamp-2 sm:line-clamp-3">
              {body}
            </p>
          )}

          {/* Bias badge */}
          {hasBias && primaryBias && (
            <button
              onClick={() => setShowBias(true)}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] sm:text-[11px] font-medium hover:bg-purple-500/20 transition-colors min-h-[28px]"
            >
              <Brain size={10} />
              🧠 {primaryBias}
            </button>
          )}

          {/* Warning */}
          {cfg.warning && (
            <div className={cn(
              'flex items-start gap-2 p-2.5 sm:p-3 rounded-xl border text-[10px] sm:text-xs font-medium',
              cfg.warningClass
            )}>
              <AlertTriangle size={11} className="flex-shrink-0 mt-0.5" />
              {cfg.warning}
            </div>
          )}

          {/* Confidence bar */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] sm:text-[11px] text-text-muted font-medium">AI Confidence</span>
              <span className={cn('text-[10px] sm:text-[11px] font-bold', cfg.iconClass)}>
                {confidence}%
              </span>
            </div>
            <div className="h-1 sm:h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-1000', cfg.barClass)}
                style={{ width: `${Math.min(Number(confidence) || 0, 100)}%` }}
              />
            </div>
          </div>

          {/* Actions — min 44px touch targets */}
          <div className="border-t border-white/5 pt-2.5 sm:pt-3 flex items-center justify-between">
            <div className="flex items-center gap-0.5 sm:gap-1">
              <button
                onClick={handleLike}
                className={cn(
                  'flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 rounded-xl text-[11px] sm:text-xs font-medium transition-all active:scale-90 min-h-[36px] sm:min-h-[44px]',
                  liked ? 'text-red-400 bg-red-500/10' : 'text-text-muted hover:text-red-400 hover:bg-red-500/10'
                )}
              >
                <Heart size={13} fill={liked ? 'currentColor' : 'none'} />
                <span>{likeCount + localLikes}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 rounded-xl text-[11px] sm:text-xs font-medium text-text-muted hover:text-blue-400 hover:bg-blue-500/10 transition-all active:scale-90 min-h-[36px] sm:min-h-[44px]"
              >
                <Share2 size={13} />
                <span className="hidden xs:inline">{copied ? 'Copied!' : 'Share'}</span>
              </button>
            </div>

            <div className="flex items-center gap-0.5 sm:gap-1">
              {/* View Spread */}
              {clusterId && (
                <button
                  onClick={() => setShowGraph(true)}
                  className="flex items-center gap-1 px-2 py-2 rounded-xl text-[10px] sm:text-[11px] font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 transition-all active:scale-90 min-h-[36px] sm:min-h-[44px]"
                >
                  <GitBranch size={12} />
                  <span className="hidden sm:inline">Spread</span>
                </button>
              )}

              <button
                onClick={() => setSaved((v) => !v)}
                className={cn(
                  'p-2 rounded-xl transition-all active:scale-90 min-h-[36px] min-w-[36px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center',
                  saved ? 'text-amber-400 bg-amber-500/10' : 'text-text-muted hover:text-amber-400 hover:bg-amber-500/10'
                )}
              >
                <Bookmark size={13} fill={saved ? 'currentColor' : 'none'} />
              </button>

              <a
                href={articleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl text-text-muted hover:text-blue-400 hover:bg-blue-500/10 transition-all min-h-[36px] min-w-[36px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center"
              >
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          <p className="text-[9px] sm:text-[10px] text-text-muted/40 font-medium">
            {timeAgo(timestamp)} · TruthLens AI
          </p>
        </div>
      </article>

      {showGraph && clusterId && (
        <GraphView clusterId={clusterId} onClose={() => setShowGraph(false)} />
      )}
      {showBias && (
        <BiasPanel article={result} onClose={() => setShowBias(false)} />
      )}
    </>
  )
}