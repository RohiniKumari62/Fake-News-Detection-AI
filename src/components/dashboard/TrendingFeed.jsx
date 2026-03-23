import { TrendingUp, ExternalLink, Flame } from 'lucide-react'
import { LabelBadge } from '../common/Badge'
import Card, { CardHeader, CardBody } from '../common/Card'
import { timeAgo } from '../../utils/helpers'

const MOCK_TRENDING = [
  { id: 1, headline: 'Scientists discover coffee cures all known diseases, study says', label: 'FAKE', confidence: 97, source: 'unknownnews.net', time: new Date(Date.now() - 12 * 60000).toISOString(), hot: true },
  { id: 2, headline: 'Global temperatures hit record high for third consecutive month', label: 'REAL', confidence: 91, source: 'reuters.com', time: new Date(Date.now() - 34 * 60000).toISOString(), hot: false },
  { id: 3, headline: '5G towers proven to control human behaviour, leaked docs show', label: 'FAKE', confidence: 99, source: 'deeptruth.io', time: new Date(Date.now() - 58 * 60000).toISOString(), hot: true },
  { id: 4, headline: 'Central bank raises interest rates by 0.25 basis points', label: 'REAL', confidence: 88, source: 'ft.com', time: new Date(Date.now() - 90 * 60000).toISOString(), hot: false },
  { id: 5, headline: 'Government secretly adding chemicals to rainwater, whistleblower claims', label: 'FAKE', confidence: 98, source: 'truthexposed.net', time: new Date(Date.now() - 140 * 60000).toISOString(), hot: true },
]

export default function TrendingFeed() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <TrendingUp size={15} className="text-primary" />
            <div>
              <h3 className="text-sm font-semibold text-text-base">Trending Stories</h3>
              <p className="text-xs text-text-muted mt-0.5">Most scanned in the last 2 hours</p>
            </div>
          </div>
          <span className="text-xs text-text-muted font-mono bg-surface-2 border border-border px-2 py-1 rounded-lg">
            Live
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-success ml-1.5 animate-pulse-slow" />
          </span>
        </div>
      </CardHeader>
      <CardBody className="p-0">
        <div className="divide-y divide-border">
          {MOCK_TRENDING.map((item, i) => (
            <div key={item.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-surface-2 transition-colors group">
              <span className="text-xs font-mono text-text-muted/50 mt-1 w-4 flex-shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-start gap-2">
                  {item.hot && <Flame size={12} className="text-danger flex-shrink-0 mt-0.5" />}
                  <p className="text-sm text-text-base leading-snug line-clamp-2">{item.headline}</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <LabelBadge label={item.label} size="sm" />
                  <span className="text-xs text-text-muted">{item.confidence}% conf.</span>
                  <span className="text-xs text-text-muted/60 flex items-center gap-1">
                    <ExternalLink size={9} />
                    {item.source}
                  </span>
                  <span className="text-xs text-text-muted/50">{timeAgo(item.time)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}