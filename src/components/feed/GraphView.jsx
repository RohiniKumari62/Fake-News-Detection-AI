// src/components/feed/GraphView.jsx
import { useEffect, useRef, useState, useCallback } from 'react'
import { X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { cn } from '../../utils/helpers'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

const NODE_COLORS = {
  FAKE:      '#ef4444',
  REAL:      '#22c55e',
  UNCERTAIN: '#f59e0b',
}

// Simple canvas-based force graph (no external library needed)
function ForceGraph({ nodes, links, onNodeClick }) {
  const canvasRef = useRef(null)
  const animRef   = useRef(null)
  const stateRef  = useRef({ nodes: [], links: [], dragging: null, offset: { x: 0, y: 0 }, scale: 1 })

  useEffect(() => {
    if (!nodes.length) return
    const W = canvasRef.current?.offsetWidth || 600
    const H = canvasRef.current?.offsetHeight || 400

    // Initialize node positions in a circle
    const initNodes = nodes.map((n, i) => ({
      ...n,
      x: W / 2 + Math.cos((i / nodes.length) * Math.PI * 2) * (n.isRoot ? 0 : 120 + Math.random() * 60),
      y: H / 2 + Math.sin((i / nodes.length) * Math.PI * 2) * (n.isRoot ? 0 : 120 + Math.random() * 60),
      vx: 0, vy: 0,
      radius: n.isRoot ? 18 : 10 + (n.confidence || 50) / 10,
    }))

    stateRef.current = { ...stateRef.current, nodes: initNodes, links }

    const tick = () => {
      const { nodes: ns, links: ls } = stateRef.current

      // Force simulation
      ns.forEach((n) => {
        // Center gravity
        n.vx += (W / 2 - n.x) * 0.001
        n.vy += (H / 2 - n.y) * 0.001

        // Repulsion between nodes
        ns.forEach((m) => {
          if (m === n) return
          const dx = n.x - m.x
          const dy = n.y - m.y
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const force = 800 / (dist * dist)
          n.vx += (dx / dist) * force * 0.01
          n.vy += (dy / dist) * force * 0.01
        })

        // Link attraction
        ls.forEach((l) => {
          const src = ns.find((x) => x.id === l.source)
          const tgt = ns.find((x) => x.id === l.target)
          if (!src || !tgt) return
          const isNode = n === src || n === tgt
          if (!isNode) return
          const other = n === src ? tgt : src
          const dx = other.x - n.x
          const dy = other.y - n.y
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const strength = (l.value || 0.5) * 0.05
          n.vx += (dx / dist) * strength * dist * 0.02
          n.vy += (dy / dist) * strength * dist * 0.02
        })

        // Damping
        n.vx *= 0.85
        n.vy *= 0.85
        n.x  += n.vx
        n.y  += n.vy

        // Boundary
        n.x = Math.max(n.radius + 5, Math.min(W - n.radius - 5, n.x))
        n.y = Math.max(n.radius + 5, Math.min(H - n.radius - 5, n.y))
      })

      draw()
      animRef.current = requestAnimationFrame(tick)
    }

    const draw = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      const { nodes: ns, links: ls } = stateRef.current

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw links
      ls.forEach((l) => {
        const src = ns.find((x) => x.id === l.source)
        const tgt = ns.find((x) => x.id === l.target)
        if (!src || !tgt) return
        ctx.beginPath()
        ctx.moveTo(src.x, src.y)
        ctx.lineTo(tgt.x, tgt.y)
        ctx.strokeStyle = `rgba(99,102,241,${(l.value || 0.5) * 0.6})`
        ctx.lineWidth = (l.value || 0.5) * 2
        ctx.setLineDash([4, 4])
        ctx.stroke()
        ctx.setLineDash([])
      })

      // Draw nodes
      ns.forEach((n) => {
        const color = NODE_COLORS[n.prediction] || NODE_COLORS.UNCERTAIN

        // Glow for root
        if (n.isRoot) {
          ctx.beginPath()
          ctx.arc(n.x, n.y, n.radius + 6, 0, Math.PI * 2)
          ctx.fillStyle = `${color}33`
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
        ctx.strokeStyle = 'rgba(255,255,255,0.2)'
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Label
        const label = (n.isRoot ? '★ ' : '') + (n.source || '').slice(0, 10)
        ctx.fillStyle = 'rgba(255,255,255,0.75)'
        ctx.font = `${n.isRoot ? 'bold ' : ''}10px sans-serif`
        ctx.textAlign = 'center'
        ctx.fillText(label, n.x, n.y + n.radius + 12)
      })
    }

    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [nodes, links])

  const handleClick = useCallback((e) => {
    const rect   = canvasRef.current?.getBoundingClientRect()
    const mx     = e.clientX - rect.left
    const my     = e.clientY - rect.top
    const { nodes: ns } = stateRef.current
    const hit    = ns.find((n) => {
      const dx = n.x - mx
      const dy = n.y - my
      return Math.sqrt(dx * dx + dy * dy) <= n.radius + 4
    })
    if (hit && onNodeClick) onNodeClick(hit)
  }, [onNodeClick])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width  = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
  }, [])

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      className="w-full h-full cursor-pointer"
      style={{ background: 'transparent' }}
    />
  )
}

export default function GraphView({ clusterId, onClose }) {
  const [graphData,    setGraphData]    = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [isLoading,    setIsLoading]    = useState(true)
  const [error,        setError]        = useState(null)

  useEffect(() => {
    if (!clusterId) return
    const load = async () => {
      try {
        setIsLoading(true)
        const res  = await fetch(`${BACKEND_URL}/api/clusters/${clusterId}/graph`)
        const data = await res.json()
        if (data.success) setGraphData(data.graph)
        else setError(data.error)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [clusterId])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-3xl glass rounded-3xl overflow-hidden border border-white/10 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div>
            <h3 className="font-display font-bold text-text-base text-base">📡 Propagation Graph</h3>
            <p className="text-xs text-text-muted mt-0.5">
              {graphData ? `${graphData.nodes.length} articles · ${graphData.links.length} connections` : 'Loading...'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition-colors">
            <X size={16} className="text-text-muted" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 px-5 py-2 border-b border-white/5">
          {Object.entries(NODE_COLORS).map(([label, color]) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: color }} />
              <span className="text-[11px] text-text-muted">{label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 ml-2">
            <div className="w-3 h-3 rounded-full ring-2 ring-white/40 bg-gray-500" />
            <span className="text-[11px] text-text-muted">★ Root article</span>
          </div>
        </div>

        {/* Graph */}
        <div className="relative" style={{ height: 380 }}>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-text-muted text-sm">Loading graph...</div>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-red-400 text-sm">{error}</div>
            </div>
          ) : graphData?.nodes?.length > 0 ? (
            <ForceGraph
              nodes={graphData.nodes}
              links={graphData.links}
              onNodeClick={setSelectedNode}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-text-muted text-sm">
              No graph data available
            </div>
          )}
        </div>

        {/* Selected node detail */}
        {selectedNode && (
          <div className="border-t border-white/5 px-5 py-4 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-xs font-semibold text-text-base line-clamp-2">{selectedNode.title}</p>
                <p className="text-[11px] text-text-muted mt-1">{selectedNode.source}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={cn(
                  'text-[10px] font-bold px-2 py-0.5 rounded-full',
                  selectedNode.prediction === 'FAKE' ? 'bg-red-500/20 text-red-400' :
                  selectedNode.prediction === 'REAL' ? 'bg-emerald-500/20 text-emerald-400' :
                  'bg-amber-500/20 text-amber-400'
                )}>
                  {selectedNode.prediction}
                </span>
                {selectedNode.url && (
                  <a href={selectedNode.url} target="_blank" rel="noopener noreferrer"
                    className="text-[11px] text-primary underline">
                    View →
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}