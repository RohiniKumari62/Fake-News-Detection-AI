// src/pages/Analyzer.jsx — Fully responsive
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ScanSearch, AlertCircle } from 'lucide-react'
import { useAnalyze } from '../hooks/useAnalyze'
import InputBox from '../components/analyzer/InputBox'
import ResultCard from '../components/analyzer/Resultcard'
import ExplanationPanel from '../components/analyzer/ExplanationPanel'
import Card, { CardHeader, CardBody } from '../components/common/Card'
import { PageLoader } from '../components/common/Loader'

export default function Analyzer() {
  const location = useLocation()
  const {
    inputType, setInputType,
    content, setContent,
    isLoading, result, error,
    handleSubmit, handleClear,
  } = useAnalyze()

  useEffect(() => {
    if (location.state?.content) {
      setContent(location.state.content)
      if (location.state.type) setInputType(location.state.type)
    }
  }, [location.state])

  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 animate-fade-in">

      {/* Page header */}
      <div className="flex items-center gap-3 mb-1 sm:mb-2">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
          <ScanSearch size={16} className="text-primary" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-text-base text-base sm:text-lg">
            Content Analyser
          </h2>
          <p className="text-[11px] sm:text-xs text-text-muted">
            Paste text or a URL to detect misinformation
          </p>
        </div>
      </div>

      {/* Responsive grid — stacked on mobile, side by side on lg */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">

        {/* Input column — full width on mobile */}
        <div className="lg:col-span-3 space-y-3 sm:space-y-4">
          <Card>
            <CardHeader>
              <h3 className="text-sm font-semibold text-text-base">Submit Content</h3>
            </CardHeader>
            <CardBody>
              <InputBox
                inputType={inputType}
                setInputType={setInputType}
                content={content}
                setContent={setContent}
                onSubmit={handleSubmit}
                onClear={handleClear}
                isLoading={isLoading}
              />
            </CardBody>
          </Card>

          {/* Tips — hidden on mobile when result showing */}
          {!result && !isLoading && (
            <div className="bg-primary/5 border border-primary/15 rounded-2xl p-3 sm:p-4 text-xs text-text-muted leading-relaxed space-y-1 sm:space-y-1.5">
              <p className="font-semibold text-primary text-[10px] sm:text-xs uppercase tracking-wider mb-1.5 sm:mb-2">
                Tips for best results
              </p>
              <p>• Include full headline + first paragraph for higher accuracy.</p>
              <p className="hidden sm:block">• For URLs, backend scrapes the page content automatically.</p>
              <p>• Short snippets may yield "Uncertain" — more context helps.</p>
            </div>
          )}
        </div>

        {/* Results column */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {isLoading && (
            <Card>
              <CardBody className="py-10 sm:py-12">
                <PageLoader />
              </CardBody>
            </Card>
          )}

          {error && !isLoading && (
            <div className="bg-danger/5 border border-danger/20 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
              <AlertCircle size={16} className="text-danger flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-danger mb-0.5 sm:mb-1">Analysis Failed</p>
                <p className="text-xs text-text-muted">{error}</p>
              </div>
            </div>
          )}

          {result && !isLoading && (
            <>
              <ResultCard result={result} />
              <ExplanationPanel result={result} />
            </>
          )}

          {!result && !isLoading && !error && (
            <Card className="border-dashed hidden lg:block">
              <CardBody className="py-14 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-surface-2 border border-border flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <ScanSearch size={18} className="text-text-muted" />
                </div>
                <p className="text-sm font-medium text-text-base mb-1">No result yet</p>
                <p className="text-xs text-text-muted">Submit content to see analysis here</p>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}