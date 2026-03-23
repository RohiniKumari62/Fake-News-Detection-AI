import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ScanSearch, History, Home, ChevronLeft, Shield, Rss, GitBranch, Brain } from 'lucide-react'
import { cn } from '../../utils/helpers'

const NAV_ITEMS = [
  { to: '/',          label: 'Home',        icon: Home,          end: true },
  { to: '/analyze',   label: 'Analyzer',    icon: ScanSearch },
  { to: '/feed',      label: 'Live Feed',   icon: Rss,           live: true },
  { to: '/dashboard', label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/history',   label: 'History',     icon: History },
]

const DNA_ITEMS = [
  { to: '/dna',  label: 'DNA Tracker',  icon: GitBranch, isNew: true },
  { to: '/bias', label: 'Bias Scanner', icon: Brain,     isNew: true },
]

export default function Sidebar({ open, onToggle }) {
  return (
    <aside className={cn(
      'flex flex-col bg-surface border-r border-border transition-all duration-300 flex-shrink-0 relative z-20',
      open ? 'w-56' : 'w-16'
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
          <Shield size={16} className="text-primary" />
        </div>
        {open && (
          <span className="font-display font-bold text-text-base text-base tracking-tight whitespace-nowrap">
            TruthLens
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end, live }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              'hover:bg-surface-2 hover:text-text-base',
              isActive
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-text-muted'
            )}
          >
            <Icon size={18} className="flex-shrink-0" />
            {open && (
              <span className="whitespace-nowrap flex items-center gap-2 flex-1">
                {label}
                {live && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse ml-auto" />
                )}
              </span>
            )}
          </NavLink>
        ))}

        {/* DNA section divider */}
        {open && (
          <div className="pt-3 pb-1 px-3">
            <p className="text-[10px] font-semibold text-text-muted/50 uppercase tracking-widest">
              MisInfo DNA
            </p>
          </div>
        )}
        {!open && <div className="border-t border-border/50 my-2" />}

        {DNA_ITEMS.map(({ to, label, icon: Icon, isNew }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              isActive
                ? to === '/dna'
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                : 'text-text-muted hover:bg-surface-2 hover:text-text-base'
            )}
          >
            <Icon size={18} className="flex-shrink-0" />
            {open && (
              <span className="whitespace-nowrap flex items-center gap-2 flex-1">
                {label}
                {isNew && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/20 ml-auto">
                    NEW
                  </span>
                )}
              </span>
            )}
            {/* Show dot when collapsed */}
            {!open && isNew && (
              <span className="absolute right-2 top-2 w-1.5 h-1.5 rounded-full bg-amber-400" />
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="m-3 mt-0 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-text-muted hover:text-text-base hover:bg-surface-2 transition-all duration-200 text-sm"
      >
        <ChevronLeft size={16} className={cn('transition-transform duration-300 flex-shrink-0', !open && 'rotate-180')} />
        {open && <span>Collapse</span>}
      </button>

      {open && (
        <div className="px-4 pb-4">
          <div className="text-xs text-text-muted font-mono bg-surface-2 rounded-lg px-3 py-2 border border-border">
            v2.0.0 · MisInfo DNA
          </div>
        </div>
      )}
    </aside>
  )
}