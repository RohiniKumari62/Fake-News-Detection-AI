import { useState } from 'react'
import { Share2, Copy, Download, Check, Link } from 'lucide-react'
import { cn, getLabelConfig } from '../../utils/helpers'
import { useToast } from '../common/Toast'

export default function ShareResult({ result }) {
  const { success } = useToast()
  const [copied, setCopied] = useState(false)

  if (!result) return null

  const config = getLabelConfig(result.label)

  const shareText = `TruthLens Analysis Result\n\nVerdict: ${result.label}\nConfidence: ${result.confidence}%\n\nSummary: ${result.summary}\n\nAnalysed at truthlens.app`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      success('Link copied', 'Share link copied to clipboard.')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      success('Copied', 'Result text copied.')
    }
  }

  const handleCopyText = async () => {
    await navigator.clipboard.writeText(shareText)
    success('Copied', 'Result text copied to clipboard.')
  }

  const handleDownload = () => {
    const blob = new Blob([shareText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `truthlens-result-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
    success('Downloaded', 'Result saved as text file.')
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: 'TruthLens Analysis', text: shareText, url: window.location.href })
    } else {
      handleCopyText()
    }
  }

  const actions = [
    { icon: copied ? Check : Link, label: copied ? 'Copied!' : 'Copy link', onClick: handleCopyLink },
    { icon: Copy, label: 'Copy text', onClick: handleCopyText },
    { icon: Download, label: 'Download', onClick: handleDownload },
    { icon: Share2, label: 'Share', onClick: handleNativeShare },
  ]

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-text-muted font-medium">Share:</span>
      {actions.map(({ icon: Icon, label, onClick }) => (
        <button
          key={label}
          onClick={onClick}
          title={label}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium',
            'bg-surface-2 border border-border text-text-muted',
            'hover:text-text-base hover:border-primary/30 transition-all duration-200'
          )}
        >
          <Icon size={12} />
          {label}
        </button>
      ))}
    </div>
  )
}