import { useState, useMemo } from 'react'
import { History as HistoryIcon, Trash2, ScanSearch, Filter } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAnalyzerStore } from '../store/useAnalyzerStore'
import { LabelBadge } from '../components/common/Badge'
import Button from '../components/common/Button'
import Card, { CardHeader, CardBody } from '../components/common/Card'
import { cn, truncate, formatDateTime } from '../utils/helpers'

const FILTER_LABELS = ['ALL', 'REAL', 'FAKE', 'UNCERTAIN']

export default function History() {
  const navigate = useNavigate()
  const { history, removeHistoryItem, clearHistory } = useAnalyzerStore()
  const [filter, setFilter] = useState('ALL')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return history.filter((item) => {
      if (filter !== 'ALL' && item.label !== filter) return false
      if (search && !item.content?.toLowerCase().includes(search.toLowerCase())) return false
      if (dateFrom && new Date(item.created_at) < new Date(dateFrom)) return false
      if (dateTo && new Date(item.created_at) > new Date(dateTo + 'T23:59:59')) return false
      return true
    })
  }, [history, filter, dateFrom, dateTo, search])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <HistoryIcon size={18} className="text-primary" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-text-base text-lg">Analysis History</h2>
            <p className="text-xs text-text-muted">{history.length} total records stored locally</p>
          </div>
        </div>
        <div className="flex gap-2">
          {history.length > 0 && (
            <Button variant="danger" size="sm" icon={Trash2} onClick={() => { if (confirm('Clear all history?')) clearHistory() }}>
              Clear All
            </Button>
          )}
          <Button variant="primary" size="sm" icon={ScanSearch} onClick={() => navigate('/analyze')}>
            New Analysis
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardBody className="py-4 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={14} className="text-text-muted" />
            <span className="text-xs text-text-muted font-medium mr-1">Verdict:</span>
            {FILTER_LABELS.map((l) => (
              <button
                key={l}
                onClick={() => setFilter(l)}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-medium transition-all border',
                  filter === l
                    ? 'bg-primary text-white border-primary'
                    : 'text-text-muted border-border hover:text-text-base hover:border-text-muted'
                )}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search content…"
              className="input-base max-w-xs text-xs py-2"
            />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="input-base w-36 text-xs py-2"
              title="From date"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="input-base w-36 text-xs py-2"
              title="To date"
            />
            {(search || dateFrom || dateTo || filter !== 'ALL') && (
              <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setDateFrom(''); setDateTo(''); setFilter('ALL') }}>
                Reset
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Table */}
      <Card>
        {filtered.length === 0 ? (
          <CardBody className="py-16 text-center">
            <div className="text-4xl mb-3">🗂️</div>
            <p className="text-sm font-medium text-text-base mb-1">
              {history.length === 0 ? 'No history yet' : 'No results match your filters'}
            </p>
            <p className="text-xs text-text-muted">
              {history.length === 0
                ? 'Run your first analysis to see it recorded here.'
                : 'Try adjusting or clearing your filters.'}
            </p>
          </CardBody>
        ) : (
          <>
            {/* Table header */}
            <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-6 py-3 border-b border-border">
              {['Verdict', 'Content', 'Confidence', 'Date', ''].map((h, i) => (
                <span key={i} className="text-xs font-semibold text-text-muted uppercase tracking-wider">{h}</span>
              ))}
            </div>
            <div className="divide-y divide-border">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-6 py-3.5 items-center hover:bg-surface-2 transition-colors group"
                >
                  <LabelBadge label={item.label} size="sm" />
                  <p className="text-sm text-text-muted truncate min-w-0">{truncate(item.content, 80)}</p>
                  <span className="text-xs font-mono text-text-muted">{item.confidence}%</span>
                  <span className="text-xs text-text-muted/60 hidden md:block whitespace-nowrap">{formatDateTime(item.created_at)}</span>
                  <button
                    onClick={() => removeHistoryItem(item.id)}
                    className="p-1.5 rounded-lg text-text-muted/40 hover:text-danger hover:bg-danger/10 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
            <div className="px-6 py-3 border-t border-border">
              <p className="text-xs text-text-muted">{filtered.length} of {history.length} records</p>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}