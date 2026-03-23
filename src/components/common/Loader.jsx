import { cn } from '../../utils/helpers'

const SIZES = { sm: 'w-4 h-4 border-2', md: 'w-6 h-6 border-2', lg: 'w-10 h-10 border-[3px]' }

export default function Loader({ size = 'md', className, label }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'rounded-full border-transparent border-t-primary animate-spin',
          SIZES[size]
        )}
      />
      {label && <p className="text-sm text-text-muted animate-pulse">{label}</p>}
    </div>
  )
}

export function SkeletonBlock({ className }) {
  return <div className={cn('shimmer-bg rounded-xl', className)} />
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader size="lg" label="Analysing content…" />
    </div>
  )
}