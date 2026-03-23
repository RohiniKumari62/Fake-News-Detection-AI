import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import Card, { CardHeader, CardBody } from '../common/Card'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-2 border border-border rounded-xl px-4 py-3 shadow-glass">
      <p className="text-xs text-text-muted mb-2 font-medium">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-text-muted capitalize">{p.dataKey}:</span>
          <span className="text-text-base font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export function TrendChart({ data }) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-semibold text-text-base">7-Day Detection Trend</h3>
        <p className="text-xs text-text-muted mt-0.5">Daily breakdown of analysis results</p>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
            <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="real" stroke="#10B981" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#10B981' }} />
            <Line type="monotone" dataKey="fake" stroke="#EF4444" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#EF4444' }} />
            <Line type="monotone" dataKey="uncertain" stroke="#F59E0B" strokeWidth={1.5} dot={false} strokeDasharray="4 2" activeDot={{ r: 3, fill: '#F59E0B' }} />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-5 mt-3 justify-center">
          {[
            { color: '#10B981', label: 'Real' },
            { color: '#EF4444', label: 'Fake' },
            { color: '#F59E0B', label: 'Uncertain' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-xs text-text-muted">
              <span className="w-3 h-0.5 rounded" style={{ background: color }} />
              {label}
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}

const RADIAN = Math.PI / 180
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null
  const r = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="600">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function DistributionChart({ data }) {
  if (!data?.length) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-sm font-semibold text-text-base">Category Distribution</h3>
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-center h-[220px] text-text-muted text-sm">
            No data yet. Run some analyses first.
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-semibold text-text-base">Category Distribution</h3>
        <p className="text-xs text-text-muted mt-0.5">Result breakdown by verdict</p>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              dataKey="value"
              labelLine={false}
              label={renderCustomLabel}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Legend
              formatter={(value) => <span style={{ color: '#9CA3AF', fontSize: 12 }}>{value}</span>}
            />
            <Tooltip
              formatter={(value, name) => [value, name]}
              contentStyle={{ background: '#1a2236', border: '1px solid #1F2937', borderRadius: 12 }}
              labelStyle={{ color: '#E5E7EB' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  )
}