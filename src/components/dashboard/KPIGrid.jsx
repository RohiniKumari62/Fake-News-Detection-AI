import { TrendingUp, ShieldAlert, ShieldCheck, Activity } from 'lucide-react'
import { cn } from '../../utils/helpers'

const KPI_CONFIG = [
  {
    key: 'total',
    label: 'Total Analyses',
    icon: Activity,
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    suffix: '',
  },
  {
    key: 'fake',
    label: 'Fake Detected',
    icon: ShieldAlert,
    color: 'text-danger',
    bg: 'bg-danger/10',
    border: 'border-danger/20',
    suffix: '',
  },
  {
    key: 'real',
    label: 'Real Confirmed',
    icon: ShieldCheck,
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/20',
    suffix: '',
  },
  {
    key: 'avgConf',
    label: 'Avg Confidence',
    icon: TrendingUp,
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/20',
    suffix: '%',
  },
]

export default function KPIGrid({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {KPI_CONFIG.map(({ key, label, icon: Icon, color, bg, border, suffix }) => (
        <div
          key={key}
          className={cn(
            'bg-surface rounded-2xl border p-5 hover:border-opacity-60 transition-all duration-300 hover:-translate-y-0.5',
            border
          )}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center border', bg, border)}>
              <Icon size={18} className={color} />
            </div>
          </div>
          <p className="text-2xl font-display font-bold text-text-base mb-1">
            {stats[key] ?? 0}{suffix}
          </p>
          <p className="text-xs text-text-muted font-medium">{label}</p>
        </div>
      ))}
    </div>
  )
}