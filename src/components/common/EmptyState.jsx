import { cn } from '../../utils/helpers'
import Button from './Button'

export default function EmptyState({
  icon: Icon,
  emoji,
  title,
  description,
  action,
  actionLabel,
  actionIcon,
  className,
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}>
      {emoji && <div className="text-4xl mb-4">{emoji}</div>}
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-surface-2 border border-border flex items-center justify-center mx-auto mb-4">
          <Icon size={22} className="text-text-muted" />
        </div>
      )}
      <h3 className="font-semibold text-text-base text-base mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-text-muted leading-relaxed max-w-xs mb-6">{description}</p>
      )}
      {action && actionLabel && (
        <Button variant="primary" size="md" icon={actionIcon} onClick={action}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}