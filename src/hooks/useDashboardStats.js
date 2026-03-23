import { useMemo } from 'react'
import { useAnalyzerStore } from '../store/useAnalyzerStore'

export const useDashboardStats = () => {
  const { history } = useAnalyzerStore()

  const stats = useMemo(() => {
    const total = history.length
    const fake = history.filter((h) => h.label === 'FAKE').length
    const real = history.filter((h) => h.label === 'REAL').length
    const uncertain = history.filter((h) => h.label === 'UNCERTAIN').length
    const avgConf =
      total > 0
        ? Math.round(history.reduce((acc, h) => acc + h.confidence, 0) / total)
        : 0

    // Build trend data: last 7 days
    const now = new Date()
    const trendData = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(now)
      d.setDate(d.getDate() - (6 - i))
      const label = d.toLocaleDateString('en-GB', { weekday: 'short' })
      const dayItems = history.filter((h) => {
        const hd = new Date(h.created_at)
        return hd.toDateString() === d.toDateString()
      })
      return {
        day: label,
        fake: dayItems.filter((h) => h.label === 'FAKE').length,
        real: dayItems.filter((h) => h.label === 'REAL').length,
        uncertain: dayItems.filter((h) => h.label === 'UNCERTAIN').length,
        total: dayItems.length,
      }
    })

    const pieData = [
      { name: 'Real', value: real || 0, color: '#10B981' },
      { name: 'Fake', value: fake || 0, color: '#EF4444' },
      { name: 'Uncertain', value: uncertain || 0, color: '#F59E0B' },
    ].filter((d) => d.value > 0)

    return { total, fake, real, uncertain, avgConf, trendData, pieData }
  }, [history])

  return stats
}