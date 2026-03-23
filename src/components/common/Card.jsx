import { cn } from '../../utils/helpers'

export default function Card({ children, className, glass = false, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border',
        glass ? 'glass' : 'bg-surface',
        hover && 'hover:border-primary/30 hover:shadow-glow transition-all duration-300 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={cn('px-6 py-4 border-b border-border', className)} {...props}>
      {children}
    </div>
  )
}

export function CardBody({ children, className, ...props }) {
  return (
    <div className={cn('px-6 py-5', className)} {...props}>
      {children}
    </div>
  )
}