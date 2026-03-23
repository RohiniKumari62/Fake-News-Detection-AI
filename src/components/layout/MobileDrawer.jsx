import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ScanSearch, History, Home, X, Shield } from 'lucide-react'
import { cn } from '../../utils/helpers'

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/analyze', label: 'Analyzer', icon: ScanSearch },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/history', label: 'History', icon: History },
]

export default function MobileDrawer({ open, onClose }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className={cn(
        'absolute left-0 top-0 bottom-0 w-64 bg-surface border-r border-border',
        'flex flex-col animate-slide-up'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Shield size={16} className="text-primary" />
            </div>
            <span className="font-display font-bold text-text-base text-base tracking-tight">
              TruthLens
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-text-muted hover:text-text-base hover:bg-surface-2 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  'hover:bg-surface-2 hover:text-text-base',
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-text-muted'
                )
              }
            >
              <Icon size={18} className="flex-shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-4 pb-4">
          <div className="text-xs text-text-muted font-mono bg-surface-2 rounded-lg px-3 py-2 border border-border">
            v1.0.0 · Beta
          </div>
        </div>
      </div>
    </div>
  )
}