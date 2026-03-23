import { format, formatDistanceToNow } from 'date-fns'
import clsx from 'clsx'

export { clsx }

export const cn = (...args) => clsx(args)

export const formatDate = (dateStr) => {
  try {
    return format(new Date(dateStr), 'MMM d, yyyy')
  } catch {
    return '—'
  }
}

export const formatDateTime = (dateStr) => {
  try {
    return format(new Date(dateStr), 'MMM d, yyyy · HH:mm')
  } catch {
    return '—'
  }
}

export const timeAgo = (dateStr) => {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
  } catch {
    return '—'
  }
}

export const getLabelConfig = (label) => {
  const configs = {
    FAKE: {
      color: 'text-danger',
      bg: 'bg-danger/10',
      border: 'border-danger/30',
      glow: 'shadow-glow-danger',
      dot: 'bg-danger',
      badge: 'bg-danger/15 text-danger border border-danger/30',
    },
    REAL: {
      color: 'text-success',
      bg: 'bg-success/10',
      border: 'border-success/30',
      glow: 'shadow-glow-success',
      dot: 'bg-success',
      badge: 'bg-success/15 text-success border border-success/30',
    },
    UNCERTAIN: {
      color: 'text-warning',
      bg: 'bg-warning/10',
      border: 'border-warning/30',
      glow: 'shadow-warning/20',
      dot: 'bg-warning',
      badge: 'bg-warning/15 text-warning border border-warning/30',
    },
  }
  return configs[label] || configs.UNCERTAIN
}

export const getLabelIcon = (label) => {
  return { FAKE: '⚠', REAL: '✓', UNCERTAIN: '?' }[label] || '?'
}

export const truncate = (str, n = 80) =>
  str && str.length > n ? str.slice(0, n) + '…' : str