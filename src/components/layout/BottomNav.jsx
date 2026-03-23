// src/components/layout/BottomNav.jsx
import { NavLink } from 'react-router-dom'
import { Home, ScanSearch, Rss, LayoutDashboard, GitBranch } from 'lucide-react'
import { cn } from '../../utils/helpers'

const NAV_ITEMS = [
  { to: '/',          label: 'Home',    icon: Home,          end: true },
  { to: '/feed',      label: 'Feed',    icon: Rss },
  { to: '/analyze',   label: 'Analyze', icon: ScanSearch },
  { to: '/dashboard', label: 'Stats',   icon: LayoutDashboard },
  { to: '/dna',       label: 'DNA',     icon: GitBranch },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden">
      {/* Backdrop blur bar */}
      <div className="bg-surface/95 backdrop-blur-xl border-t border-border">
        <div className="flex items-center justify-around px-2 py-1 safe-area-bottom">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 min-w-[52px]',
                  isActive
                    ? 'text-primary'
                    : 'text-text-muted'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className={cn(
                    'p-1.5 rounded-xl transition-all duration-200',
                    isActive ? 'bg-primary/15' : ''
                  )}>
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  </div>
                  <span className={cn(
                    'text-[10px] font-medium transition-all',
                    isActive ? 'opacity-100' : 'opacity-60'
                  )}>
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}