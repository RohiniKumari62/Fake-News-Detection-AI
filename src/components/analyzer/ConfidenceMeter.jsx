import { useEffect, useState } from 'react'
import { cn, getLabelConfig } from '../../utils/helpers'

export default function ConfidenceMeter({ confidence, label, size = 'md' }) {
  const [animated, setAnimated] = useState(0)
  const config = getLabelConfig(label)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(confidence), 100)
    return () => clearTimeout(timer)
  }, [confidence])

  const sizes = {
    sm: { r: 36, stroke: 6, textSize: 'text-lg', labelSize: 'text-xs' },
    md: { r: 52, stroke: 8, textSize: 'text-2xl', labelSize: 'text-xs' },
    lg: { r: 68, stroke: 10, textSize: 'text-3xl', labelSize: 'text-sm' },
  }

  const { r, stroke, textSize, labelSize } = sizes[size]
  const cx = r + stroke
  const cy = r + stroke
  const svgSize = (r + stroke) * 2
  const circumference = 2 * Math.PI * r
  const offset = circumference - (animated / 100) * circumference

  const strokeColors = {
    FAKE: '#EF4444',
    REAL: '#10B981',
    UNCERTAIN: '#F59E0B',
  }
  const strokeColor = strokeColors[label] || '#3B82F6'

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: svgSize, height: svgSize }}>
        <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
          {/* Track */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="rgba(31,41,55,0.8)"
            strokeWidth={stroke}
          />
          {/* Progress */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={strokeColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('font-display font-bold leading-none', textSize, config.color)}>
            {animated}%
          </span>
          <span className={cn('text-text-muted mt-0.5', labelSize)}>confidence</span>
        </div>
      </div>
    </div>
  )
}