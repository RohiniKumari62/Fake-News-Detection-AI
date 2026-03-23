import { cn, getLabelConfig } from '../../utils/helpers'

export function LabelBadge({ label, size = 'md' }) {
  const config = getLabelConfig(label)
  const sizes = { sm: 'text-xs px-2 py-0.5', md: 'text-sm px-3 py-1', lg: 'text-base px-4 py-1.5' }

  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-lg font-semibold tracking-wide', config.badge, sizes[size])}>
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {label}
    </span>
  )
}

export function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-surface-2 text-text-muted border border-border',
    primary: 'bg-primary/10 text-primary border border-primary/20',
    success: 'bg-success/10 text-success border border-success/20',
    warning: 'bg-warning/10 text-warning border border-warning/20',
    danger: 'bg-danger/10 text-danger border border-danger/20',
  }
  return (
    <span className={cn('inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md', variants[variant], className)}>
      {children}
    </span>
  )
}