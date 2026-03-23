import { useNavigate } from 'react-router-dom'
import { cn, truncate, timeAgo } from '../../utils/helpers'
import { LabelBadge } from '../common/Badge'
import Card, { CardHeader, CardBody } from '../common/Card'
import Button from '../common/Button'
import { ArrowRight } from 'lucide-react'

export default function DataTable({ data = [], limit = 5 }) {
  const navigate = useNavigate()
  const rows = data.slice(0, limit)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-text-base">Recent Analyses</h3>
            <p className="text-xs text-text-muted mt-0.5">Latest {limit} results from your history</p>
          </div>
          <Button variant="ghost" size="sm" icon={ArrowRight} onClick={() => navigate('/history')}>
            View all
          </Button>
        </div>
      </CardHeader>
      <CardBody className="p-0">
        {rows.length === 0 ? (
          <div className="py-12 text-center text-text-muted text-sm">
            No analyses yet. Go to the{' '}
            <button className="text-primary underline" onClick={() => navigate('/analyze')}>
              Analyzer
            </button>{' '}
            to get started.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {rows.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-surface-2 transition-colors">
                <LabelBadge label={item.label} size="sm" />
                <p className="flex-1 text-sm text-text-muted truncate min-w-0">{truncate(item.content, 70)}</p>
                <span className="text-xs font-mono text-text-muted/60 flex-shrink-0">{item.confidence}%</span>
                <span className="text-xs text-text-muted/50 flex-shrink-0 hidden md:block">{timeAgo(item.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  )
}