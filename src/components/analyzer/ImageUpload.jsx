import { useState, useRef } from 'react'
import { ImagePlus, X, Loader2, Lock } from 'lucide-react'
import { cn } from '../../utils/helpers'

export default function ImageUpload({ disabled = false }) {
  const [preview, setPreview] = useState(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef()

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleClear = () => {
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-3">
      {/* Coming soon badge */}
      <div className="flex items-center gap-2 text-xs text-warning bg-warning/10 border border-warning/20 rounded-lg px-3 py-2">
        <Lock size={12} />
        <span>Image detection is coming in Phase 4 — UI ready, backend pending.</span>
      </div>

      {!preview ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3',
            'transition-all duration-200 cursor-pointer',
            dragging
              ? 'border-primary/60 bg-primary/5'
              : 'border-border hover:border-primary/40 hover:bg-surface-2',
            disabled && 'opacity-40 cursor-not-allowed'
          )}
        >
          <div className="w-12 h-12 rounded-xl bg-surface-2 border border-border flex items-center justify-center">
            <ImagePlus size={20} className="text-text-muted" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-text-base">Drop an image here</p>
            <p className="text-xs text-text-muted mt-1">PNG, JPG, WEBP up to 10MB</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={disabled}
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-border">
          <img src={preview} alt="Preview" className="w-full max-h-64 object-cover" />
          <button
            onClick={handleClear}
            className="absolute top-2 right-2 p-1.5 bg-bg/80 backdrop-blur-sm rounded-lg text-text-muted hover:text-danger transition-colors"
          >
            <X size={14} />
          </button>
          <div className="absolute bottom-0 inset-x-0 bg-bg/80 backdrop-blur-sm px-4 py-3 flex items-center justify-between">
            <span className="text-xs text-text-muted">Image ready for analysis</span>
            <div className="flex items-center gap-1.5 text-xs text-warning">
              <Loader2 size={11} className="animate-spin" />
              Backend not yet connected
            </div>
          </div>
        </div>
      )}
    </div>
  )
}