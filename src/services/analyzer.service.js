// src/services/analyzer.service.js
import api from './api'

/**
 * Maps ML API response → frontend result shape
 * ML returns: verdict, final_credibility_score, nlp_result, explanation, etc.
 * Frontend expects: label, confidence, reasons, keywords, summary, created_at
 */
const mapMLResponse = (data, content, type) => {
  // Map verdict → label
  const labelMap = {
    'LIKELY FAKE': 'FAKE',
    'LIKELY REAL': 'REAL',
    'UNCERTAIN': 'UNCERTAIN',
  }
  const label = labelMap[data.verdict] || 'UNCERTAIN'

  // Confidence based on label
  const confidence = label === 'FAKE'
    ? Math.round(data.nlp_result?.fake_prob ?? data.final_credibility_score)
    : label === 'REAL'
    ? Math.round(data.nlp_result?.real_prob ?? data.final_credibility_score)
    : Math.round(data.final_credibility_score)

  // Build human-readable reasons from ML signals
  const reasons = []

  if (data.nlp_result?.label === 'FAKE') {
    reasons.push(`NLP model detected fake news patterns (${data.nlp_result.fake_prob}% fake probability)`)
  } else if (data.nlp_result?.label === 'REAL') {
    reasons.push(`NLP model found credible language patterns (${data.nlp_result.real_prob}% real probability)`)
  }

  if (data.source_credibility?.tier === 'high') {
    reasons.push(`Source domain "${data.source_credibility.domain}" is highly credible`)
  } else if (data.source_credibility?.tier === 'low') {
    reasons.push(`Source domain "${data.source_credibility.domain}" has low credibility rating`)
  } else if (data.source_credibility?.tier === 'unknown') {
    reasons.push('Source domain credibility could not be verified')
  }

  if (data.text_features?.clickbait_score > 60) {
    reasons.push(`High clickbait score (${data.text_features.clickbait_score}/100) — sensational language detected`)
  } else if (data.text_features?.clickbait_score < 20) {
    reasons.push('Language tone is neutral and consistent with factual reporting')
  }

  if (data.text_features?.sensational_word_count > 0) {
    reasons.push(`${data.text_features.sensational_word_count} sensational word(s) detected in the content`)
  }

  if (data.image_result?.manipulation_detected) {
    reasons.push('Image analysis detected potential manipulation or text-image inconsistency')
  }

  if (reasons.length === 0) {
    reasons.push('Analysis based on language patterns and source credibility signals')
  }

  // Keywords from LIME explanation
  const keywords = (data.explanation?.feature_importance || [])
    .slice(0, 6)
    .map((f) => f.word)

  // Human-readable summary
  const scoreLabel = data.final_credibility_score >= 70
    ? 'high credibility'
    : data.final_credibility_score >= 45
    ? 'uncertain credibility'
    : 'low credibility'

  const summary = label === 'FAKE'
    ? `This content shows signs of misinformation. Credibility score: ${data.final_credibility_score}/100 (${scoreLabel}). Independent verification is strongly recommended.`
    : label === 'REAL'
    ? `This content appears credible. Credibility score: ${data.final_credibility_score}/100 (${scoreLabel}). Language and source signals are consistent with factual reporting.`
    : `The model is uncertain about this content. Credibility score: ${data.final_credibility_score}/100. Some signals are mixed — consider verifying with trusted sources.`

  return {
    id: crypto.randomUUID(),
    label,
    confidence,
    reasons,
    keywords,
    summary,
    content: (content || '').slice(0, 120) + ((content?.length || 0) > 120 ? '...' : ''),
    type: type || 'text',
    created_at: new Date().toISOString(),
    _raw: data, // Keep raw ML data for advanced use
  }
}

/**
 * Main analyze function — called by useAnalyzerStore
 * payload = { type: 'text'|'url', content: string }
 */
export const analyzeContent = async (payload) => {
  const { type, content } = payload

  const mlResponse = await api.post('/api/v1/predict/text', {
    text: content,
    source_url: null,
    include_explanation: true,
    include_sentence_analysis: false,
  })

  return mapMLResponse(mlResponse, content, type)
}

/**
 * Multimodal analyze (text + image) — called by old Analyzer.jsx
 */
export const analyzeMultimodal = async ({ text, sourceUrl, imageFile }) => {
  const formData = new FormData()
  formData.append('text', text)
  if (sourceUrl) formData.append('source_url', sourceUrl)
  if (imageFile) formData.append('image', imageFile)

  const baseURL = import.meta.env.VITE_ML_API_URL || 'http://127.0.0.1:8000'
  const response = await fetch(`${baseURL}/api/v1/predict/multimodal`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.detail || 'Multimodal analysis failed')
  }

  const mlResponse = await response.json()
  return mapMLResponse(mlResponse, text, 'text')
}

/**
 * Text-only analyze — called by old Analyzer.jsx
 */
export const analyzeText = async ({ text, sourceUrl, includeExplanation = true }) => {
  const mlResponse = await api.post('/api/v1/predict/text', {
    text,
    source_url: sourceUrl || null,
    include_explanation: includeExplanation,
    include_sentence_analysis: false,
  })
  return mapMLResponse(mlResponse, text, 'text')
}

// Stubs for history/stats (backend not wired yet)
export const fetchHistory = async () => ({ results: [], total: 0 })
export const fetchStats = async () => ({ total_analyzed: 0, fake_detected: 0, real_detected: 0, uncertain: 0 })
export const fetchAnalysisById = async () => null
export const checkMLHealth = async () => api.get('/api/v1/health')