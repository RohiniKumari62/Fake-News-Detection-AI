import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '../../utils/helpers'
import { TOAST_TYPES, TOAST_DURATION } from '../../utils/constants'

const ToastContext = createContext(null)

const TOAST_CONFIG = {
  [TOAST_TYPES.SUCCESS]: {
    icon: CheckCircle,
    classes: 'border-success/30 bg-success/10',
    iconClass: 'text-success',
    titleClass: 'text-success',
  },
  [TOAST_TYPES.ERROR]: {
    icon: XCircle,
    classes: 'border-danger/30 bg-danger/10',
    iconClass: 'text-danger',
    titleClass: 'text-danger',
  },
  [TOAST_TYPES.WARNING]: {
    icon: AlertTriangle,
    classes: 'border-warning/30 bg-warning/10',
    iconClass: 'text-warning',
    titleClass: 'text-warning',
  },
  [TOAST_TYPES.INFO]: {
    icon: Info,
    classes: 'border-primary/30 bg-primary/10',
    iconClass: 'text-primary',
    titleClass: 'text-primary',
  },
}

function ToastItem({ toast, onDismiss }) {
  const config = TOAST_CONFIG[toast.type] || TOAST_CONFIG[TOAST_TYPES.INFO]
  const Icon = config.icon

  return (
    <div
      className={cn(
        'flex items-start gap-3 px-4 py-3 rounded-xl border shadow-glass',
        'animate-slide-up backdrop-blur-sm min-w-[280px] max-w-[380px]',
        'bg-surface',
        config.classes
      )}
    >
      <Icon size={17} className={cn('flex-shrink-0 mt-0.5', config.iconClass)} />
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className={cn('text-sm font-semibold leading-none mb-1', config.titleClass)}>
            {toast.title}
          </p>
        )}
        {toast.message && (
          <p className="text-xs text-text-muted leading-relaxed">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-0.5 rounded text-text-muted hover:text-text-base transition-colors flex-shrink-0"
      >
        <X size={13} />
      </button>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current[id])
    delete timers.current[id]
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    ({ type = TOAST_TYPES.INFO, title, message, duration = TOAST_DURATION }) => {
      const id = crypto.randomUUID()
      setToasts((prev) => [...prev.slice(-4), { id, type, title, message }])
      if (duration > 0) {
        timers.current[id] = setTimeout(() => dismiss(id), duration)
      }
      return id
    },
    [dismiss]
  )

  const success = useCallback((title, message) => toast({ type: TOAST_TYPES.SUCCESS, title, message }), [toast])
  const error = useCallback((title, message) => toast({ type: TOAST_TYPES.ERROR, title, message }), [toast])
  const warning = useCallback((title, message) => toast({ type: TOAST_TYPES.WARNING, title, message }), [toast])
  const info = useCallback((title, message) => toast({ type: TOAST_TYPES.INFO, title, message }), [toast])

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info, dismiss }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}