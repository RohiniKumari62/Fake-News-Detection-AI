// src/components/layout/Navbar.jsx
import { Menu, Search, Bell, User, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '../../utils/helpers'

// Format date nicely
function formatDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
}

export default function Navbar({ onMenuToggle }) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()

  // Get page title from URL
  const path  = window.location.pathname
  const title = path === '/'          ? 'Home'
              : path === '/analyze'   ? 'Analyzer'
              : path === '/feed'      ? 'Live Feed'
              : path === '/dashboard' ? 'Dashboard'
              : path === '/history'   ? 'History'
              : path === '/dna'       ? 'DNA Tracker'
              : path === '/bias'      ? 'Bias Scanner'
              : 'TruthLens'

  return (
    <header className="flex-shrink-0 h-14 sm:h-16 bg-surface border-b border-border flex items-center px-3 sm:px-6 gap-3 relative z-20">

      {/* Left: hamburger + title */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        {/* Hamburger — always visible on mobile */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-2 transition-colors flex-shrink-0"
          aria-label="Toggle menu"
        >
          <Menu size={20} className="text-text-muted" />
        </button>

        <div className="min-w-0">
          <h1 className="font-display font-semibold text-text-base text-sm sm:text-base truncate">
            {title}
          </h1>
          <p className="text-text-muted text-[10px] sm:text-xs truncate hidden sm:block">
            {formatDate()}
          </p>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        {/* Search — hidden on very small screens */}
        <button className="hidden sm:flex w-9 h-9 items-center justify-center rounded-xl hover:bg-surface-2 transition-colors">
          <Search size={18} className="text-text-muted" />
        </button>

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-2 transition-colors">
          <Bell size={18} className="text-text-muted" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User avatar */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu((v) => !v)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center"
          >
            <span className="text-primary text-xs font-bold">R</span>
          </button>

          {/* Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 top-11 w-48 bg-surface border border-border rounded-2xl shadow-xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-xs font-semibold text-text-base">revelak3</p>
                <p className="text-[11px] text-text-muted">revelak3@gmail.com</p>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}