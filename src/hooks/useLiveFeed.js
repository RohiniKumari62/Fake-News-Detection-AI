// src/hooks/useLiveFeed.js
import { useState, useEffect, useRef, useCallback } from 'react'

const BACKEND_URL      = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
const WS_URL           = import.meta.env.VITE_WS_URL      || 'ws://localhost:5000/ws'
const POLL_INTERVAL_MS = 45000

export const useLiveFeed = () => {
  const [news,       setNews]       = useState([])
  const [alerts,     setAlerts]     = useState([])
  const [stats,      setStats]      = useState(null)
  const [isLoading,  setIsLoading]  = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [error,      setError]      = useState(null)
  const [filter,     setFilter]     = useState('all')
  const [wsStatus,   setWsStatus]   = useState('connecting')
  const [hasMore,    setHasMore]    = useState(false)
  const [page,       setPage]       = useState(1)

  const wsRef      = useRef(null)
  const pollRef    = useRef(null)
  const mounted    = useRef(true)
  // ─── FIX: Use ref for filter/page inside callbacks to avoid stale closures
  const filterRef  = useRef(filter)
  const pageRef    = useRef(page)

  useEffect(() => { filterRef.current = filter }, [filter])
  useEffect(() => { pageRef.current   = page   }, [page])

  // ─── Fetch news ───────────────────────────────────────────────────────────
  const fetchNews = useCallback(async (resetPage = true) => {
    if (!mounted.current) return
    try {
      setIsFetching(true)
      setError(null)

      const currentPage = resetPage ? 1 : pageRef.current
      const params = new URLSearchParams({ page: currentPage, limit: 20 })
      if (filterRef.current !== 'all') params.append('prediction', filterRef.current)

      console.log('[useLiveFeed] Fetching:', `${BACKEND_URL}/api/news?${params}`)

      const res = await fetch(`${BACKEND_URL}/api/news?${params}`)
      if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`)
      const data = await res.json()

      console.log('[useLiveFeed] Got', data.results?.length ?? 0, 'articles')

      if (!mounted.current) return

      if (resetPage) {
        setNews(data.results || [])
        setPage(1)
      } else {
        setNews((prev) => {
          const ids   = new Set(prev.map((n) => n._id || n.id))
          const fresh = (data.results || []).filter((n) => !ids.has(n._id || n.id))
          return [...prev, ...fresh]
        })
      }

      setHasMore(data.pagination?.hasNext ?? false)
    } catch (err) {
      console.error('[useLiveFeed] fetchNews error:', err.message)
      if (mounted.current) setError(`Backend unavailable: ${err.message}`)
    } finally {
      if (mounted.current) {
        setIsFetching(false)
        setIsLoading(false)
      }
    }
  }, []) // ─── FIX: Empty deps — uses refs to avoid stale closure loops

  // ─── Fetch alerts ─────────────────────────────────────────────────────────
  const fetchAlerts = useCallback(async () => {
    try {
      const res  = await fetch(`${BACKEND_URL}/api/alerts`)
      const data = await res.json()
      if (mounted.current) setAlerts(data.alerts || [])
    } catch (err) {
      console.warn('[useLiveFeed] fetchAlerts error:', err.message)
    }
  }, [])

  // ─── Fetch stats ──────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const res  = await fetch(`${BACKEND_URL}/api/stats`)
      const data = await res.json()
      if (mounted.current) setStats(data)
    } catch (err) {
      console.warn('[useLiveFeed] fetchStats error:', err.message)
    }
  }, [])

  // ─── Refresh all ──────────────────────────────────────────────────────────
  const refresh = useCallback(() => {
    fetchNews(true)
    fetchAlerts()
    fetchStats()
  }, [fetchNews, fetchAlerts, fetchStats])

  // ─── WebSocket ────────────────────────────────────────────────────────────
  const connectWebSocket = useCallback(() => {
    try {
      if (wsRef.current?.readyState === WebSocket.OPEN) return
      setWsStatus('connecting')

      const ws = new WebSocket(WS_URL)
      wsRef.current = ws

      ws.onopen = () => {
        if (!mounted.current) return
        setWsStatus('connected')
        clearInterval(pollRef.current)
        console.log('[useLiveFeed] WebSocket connected ✅')
      }

      ws.onmessage = (event) => {
        if (!mounted.current) return
        try {
          const msg = JSON.parse(event.data)
          if (msg.type === 'NEW_NEWS' && Array.isArray(msg.items)) {
            setNews((prev) => {
              const ids   = new Set(prev.map((n) => n._id || n.id))
              const fresh = msg.items.filter((n) => !ids.has(n._id || n.id))
              return fresh.length ? [...fresh, ...prev] : prev
            })
          }
          if (msg.type === 'ALERT') {
            setAlerts((prev) => [msg, ...prev])
          }
        } catch (_) {}
      }

      ws.onerror = () => {
        if (!mounted.current) return
        setWsStatus('disconnected')
        startPolling()
      }

      ws.onclose = () => {
        if (!mounted.current) return
        setWsStatus('disconnected')
        setTimeout(() => { if (mounted.current) connectWebSocket() }, 5000)
      }
    } catch (err) {
      console.warn('[useLiveFeed] WebSocket failed:', err.message)
      setWsStatus('disconnected')
      startPolling()
    }
  }, []) // ─── FIX: Empty deps

  // ─── Polling fallback ─────────────────────────────────────────────────────
  const startPolling = useCallback(() => {
    clearInterval(pollRef.current)
    pollRef.current = setInterval(() => {
      if (mounted.current) fetchNews(true)
    }, POLL_INTERVAL_MS)
  }, [fetchNews])

  // ─── Dismiss alert ────────────────────────────────────────────────────────
  const dismissAlert = useCallback(async (alertId) => {
    if (!alertId) return
    try {
      await fetch(`${BACKEND_URL}/api/alerts/${alertId}/dismiss`, { method: 'PATCH' })
    } catch (_) {}
    setAlerts((prev) => prev.filter((a) => (a._id || a.id) !== alertId))
  }, [])

  // ─── Load more ────────────────────────────────────────────────────────────
  const loadMore = useCallback(() => {
    if (!hasMore || isFetching) return
    setPage((p) => {
      pageRef.current = p + 1
      return p + 1
    })
    fetchNews(false)
  }, [hasMore, isFetching, fetchNews])

  // ─── Mount / unmount ──────────────────────────────────────────────────────
  useEffect(() => {
    mounted.current = true
    refresh()
    connectWebSocket()
    startPolling()
    return () => {
      mounted.current = false
      clearInterval(pollRef.current)
      wsRef.current?.close()
    }
  }, []) // ─── FIX: Run once on mount only

  // ─── Re-fetch when filter changes ─────────────────────────────────────────
  useEffect(() => {
    if (!isLoading) {
      fetchNews(true)
    }
  }, [filter]) // ─── FIX: Only filter as dep, not fetchNews (avoids loops)

  return {
    news, alerts, stats,
    isLoading, isFetching, error,
    filter, setFilter,
    refresh, dismissAlert, loadMore,
    hasMore, wsStatus,
  }
}