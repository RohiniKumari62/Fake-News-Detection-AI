import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, ScanSearch } from 'lucide-react'
import { useDashboardStats } from '../hooks/useDashboardStats'
import { useAnalyzerStore } from '../store/useAnalyzerStore'
import KPIGrid from '../components/dashboard/KPIGrid'
import { TrendChart, DistributionChart } from '../components/dashboard/Charts'
import DataTable from '../components/dashboard/DataTable'
import Button from '../components/common/Button'

export default function Dashboard() {
  const navigate = useNavigate()
  const { history } = useAnalyzerStore()
  const stats = useDashboardStats()

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <LayoutDashboard size={18} className="text-primary" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-text-base text-lg">Analytics Dashboard</h2>
            <p className="text-xs text-text-muted">Overview of your detection activity</p>
          </div>
        </div>
        <Button variant="primary" size="md" icon={ScanSearch} onClick={() => navigate('/analyze')}>
          New Analysis
        </Button>
      </div>

      {/* KPIs */}
      <KPIGrid stats={stats} />

      {/* Charts */}
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <TrendChart data={stats.trendData} />
        </div>
        <div className="lg:col-span-2">
          <DistributionChart data={stats.pieData} />
        </div>
      </div>

      {/* Recent table */}
      <DataTable data={history} limit={6} />

      {/* Empty state overlay */}
      {history.length === 0 && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center" style={{ top: 200 }}>
          <div className="pointer-events-auto text-center bg-surface border border-border rounded-2xl p-8 shadow-glass max-w-sm mx-4">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-semibold text-text-base mb-2">No Data Yet</h3>
            <p className="text-sm text-text-muted mb-4">
              Run your first analysis to start seeing trends and statistics here.
            </p>
            <Button variant="primary" onClick={() => navigate('/analyze')}>
              Go to Analyser
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}