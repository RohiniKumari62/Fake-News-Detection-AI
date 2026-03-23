// src/pages/NewsFeed.jsx — Fully responsive
import { Rss, ScanSearch, TrendingUp, RefreshCw, WifiOff } from 'lucide-react'
import { useLiveFeed } from '../hooks/useLiveFeed'
import { useAnalyzerStore } from '../store/useAnalyzerStore'
import NewsCard from '../components/feed/NewsCard'
import SkeletonCard from '../components/feed/SkeletonCard'
import AlertPopup from '../components/feed/AlertPopup'
import NotificationBell from '../components/feed/NotificationBell'
import { cn } from '../utils/helpers'
import { useNavigate } from 'react-router-dom'

const FILTERS = [
  { label: 'All',      value: 'all' },
  { label: '⚠️ Fake', value: 'FAKE' },
  { label: '✅ Real',  value: 'REAL' },
  { label: '❓ Unsure',value: 'UNCERTAIN' },
]

export default function NewsFeed() {
  const navigate = useNavigate()
  const {
    news: backendNews, alerts, stats,
    isLoading, isFetching, error,
    filter, setFilter,
    refresh, dismissAlert, loadMore,
    hasMore, wsStatus,
  } = useLiveFeed()

  const { history: localHistory } = useAnalyzerStore()

  const allNews = backendNews.length > 0
    ? backendNews
    : localHistory.map((item) => ({
        _id:         item.id,
        title:       item.content?.slice(0, 100) || 'Analysed Article',
        description: item.summary || '',
        image:       '',
        source:      'Manual Analysis',
        prediction:  item.label,
        confidence:  item.confidence,
        createdAt:   item.created_at,
        url:         '#',
      }))

  const filtered = filter === 'all'
    ? allNews
    : allNews.filter((n) => (n.prediction || n.label) === filter)

  const latestFakeAlert = alerts.find((a) => a.type === 'FAKE_SURGE') || null
  const backendOnline   = wsStatus === 'connected' || backendNews.length > 0

  return (
    <div className="min-h-screen bg-[#0B0F19]">

      {/* Sticky header */}
      <header className="sticky top-0 z-40 glass border-b border-white/5">
        <div className="max-w-[620px] mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center shadow-lg shadow-red-500/20 flex-shrink-0">
              <Rss size={13} className="text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-sm sm:text-base text-text-base tracking-tight">
                TruthFeed
              </span>
              <div className={cn(
                'hidden xs:flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full border',
                wsStatus === 'connected'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-white/5 text-text-muted border-white/10'
              )}>
                <span className={cn('w-1.5 h-1.5 rounded-full',
                  wsStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'
                )} />
                <span className="hidden sm:inline">
                  {wsStatus === 'connected' ? 'LIVE' : 'OFFLINE'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={refresh}
              disabled={isFetching}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-surface-2 border border-border flex items-center justify-center hover:border-primary/30 active:scale-95 transition-all"
            >
              <RefreshCw size={13} className={cn('text-text-muted', isFetching && 'animate-spin')} />
            </button>

            {/* Hide analyze button on very small screens */}
            <button
              onClick={() => navigate('/analyze')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-red-500 to-orange-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-500/20 active:scale-95 transition-all"
            >
              <ScanSearch size={13} />
              <span>Analyse</span>
            </button>

            <NotificationBell alerts={alerts} onDismiss={dismissAlert} />
          </div>
        </div>

        {/* Filter tabs — scrollable */}
        <div className="max-w-[620px] mx-auto px-3 sm:px-4 pb-2 sm:pb-3">
          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide">
            {FILTERS.map((f) => {
              const count = f.value === 'all'
                ? allNews.length
                : allNews.filter((n) => (n.prediction || n.label) === f.value).length
              return (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={cn(
                    'flex-shrink-0 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all duration-200 min-h-[30px]',
                    filter === f.value
                      ? 'bg-primary text-white'
                      : 'bg-surface-2 text-text-muted hover:text-text-base border border-border'
                  )}
                >
                  {f.label}
                  <span className="ml-1 opacity-50">{count}</span>
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* Feed */}
      <main className="max-w-[620px] mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-5">

        {/* Stats bar */}
        {stats?.stats && backendOnline && (
          <div className="glass-light rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-4 text-xs font-medium flex-wrap">
            <TrendingUp size={13} className="text-text-muted flex-shrink-0" />
            <span className="text-text-muted">{stats.stats.total} analysed</span>
            <span className="text-red-400">{stats.stats.fake} fake</span>
            <span className="text-emerald-400">{stats.stats.real} real</span>
            <span className="text-amber-400 hidden sm:inline">{stats.stats.uncertain} uncertain</span>
          </div>
        )}

        {/* Offline banner */}
        {!backendOnline && !isLoading && (
          <div className="glass-light rounded-2xl px-3 sm:px-4 py-2.5 flex items-center gap-2 text-xs border border-amber-500/20">
            <WifiOff size={13} className="text-amber-400 flex-shrink-0" />
            <span className="text-amber-400 font-medium">Backend offline</span>
            <span className="text-text-muted hidden sm:inline">— showing local analyses</span>
          </div>
        )}

        {/* Error */}
        {error && !isLoading && backendOnline && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3 sm:p-4 text-sm text-red-400 flex items-center gap-2">
            <WifiOff size={14} />
            <span className="flex-1 truncate">{error}</span>
            <button onClick={refresh} className="underline flex-shrink-0 text-xs">retry</button>
          </div>
        )}

        {/* Skeletons */}
        {isLoading && [...Array(3)].map((_, i) => <SkeletonCard key={i} />)}

        {/* Cards */}
        {!isLoading && filtered.length > 0 && (
          filtered.map((item, i) => (
            <NewsCard
              key={item._id || item.id || `news-${i}`}
              result={item}
              index={i}
            />
          ))
        )}

        {/* Empty state */}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-16 sm:py-20 rounded-3xl border-2 border-dashed border-white/5 px-4">
            <div className="text-3xl sm:text-4xl mb-3">📰</div>
            <p className="font-semibold text-text-muted mb-1 text-sm sm:text-base">
              {filter === 'all' ? 'No articles yet' : `No ${filter.toLowerCase()} articles`}
            </p>
            <p className="text-xs sm:text-sm text-text-muted/40 mb-4 sm:mb-5">
              Auto-fetches every few minutes
            </p>
            <div className="flex gap-2 justify-center flex-wrap">
              <button
                onClick={refresh}
                className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-orange-400 text-white text-sm font-bold rounded-xl shadow-lg active:scale-95 transition-all"
              >
                Refresh
              </button>
              <button
                onClick={() => navigate('/analyze')}
                className="px-4 py-2.5 bg-surface-2 border border-border text-text-muted text-sm rounded-xl active:scale-95 transition-all"
              >
                Analyse manually
              </button>
            </div>
          </div>
        )}

        {/* Load more */}
        {hasMore && !isLoading && (
          <button
            onClick={loadMore}
            disabled={isFetching}
            className="w-full py-3 rounded-2xl bg-surface-2 border border-border text-text-muted text-sm font-medium hover:border-primary/30 active:scale-95 transition-all disabled:opacity-50 min-h-[44px]"
          >
            {isFetching ? 'Loading...' : 'Load more'}
          </button>
        )}
      </main>

      <AlertPopup latestFakeResult={null} serverAlert={latestFakeAlert} />
    </div>
  )
}