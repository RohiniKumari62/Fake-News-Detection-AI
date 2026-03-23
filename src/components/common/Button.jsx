import { cn } from '../../utils/helpers'
import Loader from './Loader'

const VARIANTS = {
  primary: 'bg-primary hover:bg-primary-dark text-white shadow-glow hover:shadow-glow',
  secondary: 'bg-surface-2 hover:bg-border text-text-base border border-border',
  danger: 'bg-danger/10 hover:bg-danger/20 text-danger border border-danger/30',
  ghost: 'hover:bg-surface-2 text-text-muted hover:text-text-base',
  success: 'bg-success/10 hover:bg-success/20 text-success border border-success/30',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2.5',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader size="sm" />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 13 : size === 'lg' ? 18 : 15} className="flex-shrink-0" />
      ) : null}
      {children}
    </button>
  )
}