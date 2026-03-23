import { Type, Link2, X } from 'lucide-react'
import { cn } from '../../utils/helpers'
import Button from '../common/Button'

export default function InputBox({ inputType, setInputType, content, setContent, onSubmit, onClear, isLoading }) {
  const charLimit = 3000
  const isUrl = inputType === 'url'

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <div className="flex items-center gap-1 bg-surface-2 rounded-xl p-1 w-fit border border-border">
        {[
          { type: 'text', label: 'Text', Icon: Type },
          { type: 'url', label: 'URL', Icon: Link2 },
        ].map(({ type, label, Icon }) => (
          <button
            key={type}
            onClick={() => { setInputType(type); setContent('') }}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              inputType === type
                ? 'bg-primary text-white shadow-glow'
                : 'text-text-muted hover:text-text-base'
            )}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="relative">
        {isUrl ? (
          <input
            type="url"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="https://example.com/news-article"
            className="input-base pr-10"
            onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
          />
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, charLimit))}
            placeholder="Paste a news headline or full article text here to verify its credibility…"
            rows={7}
            className="input-base resize-none leading-relaxed"
          />
        )}
        {content && (
          <button
            onClick={onClear}
            className="absolute top-3 right-3 p-1 rounded-lg text-text-muted hover:text-text-base hover:bg-surface-2 transition-all"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between">
        {!isUrl && (
          <span className={cn(
            'text-xs font-mono transition-colors',
            content.length > charLimit * 0.9 ? 'text-warning' : 'text-text-muted'
          )}>
            {content.length} / {charLimit}
          </span>
        )}
        <div className={cn('flex gap-3', isUrl && 'ml-auto')}>
          {content && (
            <Button variant="secondary" size="md" onClick={onClear}>
              Clear
            </Button>
          )}
          <Button
            variant="primary"
            size="md"
            loading={isLoading}
            disabled={!content.trim() || isLoading}
            onClick={onSubmit}
          >
            {isLoading ? 'Analysing…' : 'Analyse Content'}
          </Button>
        </div>
      </div>
    </div>
  )
}