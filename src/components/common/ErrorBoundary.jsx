import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center mx-auto">
              <AlertTriangle size={28} className="text-danger" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-text-base mb-2">
                Something went wrong
              </h1>
              <p className="text-text-muted text-sm leading-relaxed">
                An unexpected error occurred in the application. This has been logged and we'll look into it.
              </p>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <div className="bg-surface border border-border rounded-xl p-4 text-left">
                <p className="text-xs font-mono text-danger break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                <RefreshCw size={14} />
                Try again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2.5 bg-surface border border-border text-text-muted rounded-xl text-sm font-medium hover:text-text-base transition-colors"
              >
                Go to home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}