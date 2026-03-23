import { useState } from 'react'
import { cn } from '../../utils/helpers'

export default function Tooltip({ children, content, position = 'top' }) {
  const [visible, setVisible] = useState(false)

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && content && (
        <div
          className={cn(
            'absolute z-50 px-2.5 py-1.5 bg-surface-2 border border-border rounded-lg',
            'text-xs text-text-base whitespace-nowrap shadow-glass pointer-events-none',
            'animate-fade-in',
            positions[position]
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}