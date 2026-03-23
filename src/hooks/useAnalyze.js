import { useState } from 'react'
import { useAnalyzerStore } from '../store/useAnalyzerStore'

export const useAnalyze = () => {
  const [inputType, setInputType] = useState('text')
  const [content, setContent] = useState('')
  const { analyze, isLoading, result, error, clearResult } = useAnalyzerStore()

  const handleSubmit = async () => {
    if (!content.trim()) return
    await analyze({ type: inputType, content: content.trim() })
  }

  const handleClear = () => {
    setContent('')
    clearResult()
  }

  return {
    inputType,
    setInputType,
    content,
    setContent,
    isLoading,
    result,
    error,
    handleSubmit,
    handleClear,
  }
}