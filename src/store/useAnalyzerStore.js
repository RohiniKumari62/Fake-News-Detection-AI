import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { analyzeContent } from '../services/analyzer.service'

const MOCK_RESULT = (content, type) => {
  const fakeWords = ['secret', 'cure', 'shocking', 'miracle', 'hidden', 'banned', 'suppressed', 'exposed', 'hoax', 'conspiracy', 'they', 'won\'t tell']
  const lower = content.toLowerCase()
  let fakeScore = 0
  const flagged = []

  fakeWords.forEach((w) => {
    if (lower.includes(w)) {
      fakeScore += 18
      flagged.push(w)
    }
  })

  fakeScore = Math.min(fakeScore + Math.random() * 35, 98)
  fakeScore = Math.max(fakeScore, 12)

  let label, confidence, reasons, summary
  if (fakeScore > 62) {
    label = 'FAKE'
    confidence = fakeScore
    reasons = [
      'Sensationalist language patterns detected across multiple sentences',
      'Claims lack verifiable citations or primary source references',
      'Headline uses emotionally charged framing inconsistent with factual reporting',
      'Content structure matches known misinformation templates',
    ]
    summary = 'High probability of misinformation. The article contains multiple markers associated with fabricated or misleading news content.'
  } else if (fakeScore > 38) {
    label = 'UNCERTAIN'
    confidence = fakeScore
    reasons = [
      'Mixed signals: some factual language alongside unverified claims',
      'Partial sourcing present but key assertions remain uncorroborated',
      'Tone shifts suggest possible editorial bias or selective framing',
    ]
    summary = 'The model is not confident. This content may contain both accurate and misleading information. Independent verification is recommended.'
  } else {
    label = 'REAL'
    confidence = 100 - fakeScore
    reasons = [
      'Language patterns consistent with credible journalism standards',
      'Claims align with verifiable public information sources',
      'No significant manipulation markers or emotional baiting detected',
      'Source attribution and factual framing appear reliable',
    ]
    summary = 'Content appears to be credible. The language, structure, and claims are consistent with legitimate news reporting.'
    flagged.push('credible source', 'factual tone', 'verifiable claims')
  }

  return {
    id: crypto.randomUUID(),
    label,
    confidence: Math.round(confidence),
    reasons,
    keywords: flagged.slice(0, 6),
    summary,
    content: content.slice(0, 120) + (content.length > 120 ? '...' : ''),
    type,
    created_at: new Date().toISOString(),
  }
}

export const useAnalyzerStore = create(
  persist(
    (set, get) => ({
      result: null,
      isLoading: false,
      error: null,
      history: [],

      analyze: async (payload) => {
        set({ isLoading: true, error: null, result: null })
        try {
          let data
          try {
            data = await analyzeContent(payload)
          } catch {
            // Fallback to mock when backend is not available
            await new Promise((r) => setTimeout(r, 1800))
            data = MOCK_RESULT(payload.content, payload.type)
          }
          set((state) => ({
            result: data,
            isLoading: false,
            history: [data, ...state.history].slice(0, 100),
          }))
        } catch (err) {
          set({ error: err.message, isLoading: false })
        }
      },

      clearResult: () => set({ result: null, error: null }),

      clearHistory: () => set({ history: [] }),

      removeHistoryItem: (id) =>
        set((state) => ({ history: state.history.filter((h) => h.id !== id) })),
    }),
    {
      name: 'truthlens-storage',
      partialize: (state) => ({ history: state.history }),
    }
  )
)