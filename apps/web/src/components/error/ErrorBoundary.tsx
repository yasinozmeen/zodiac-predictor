import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-100">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">Bir Hata Oluştu</h1>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyerek tekrar deneyin.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-pink hover:bg-deep-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-pink transition-colors duration-200"
            >
              Sayfayı Yenile
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left bg-gray-100 p-4 rounded-md">
                <summary className="cursor-pointer font-medium text-red-600">
                  Hata Detayları (Geliştirme Modu)
                </summary>
                <pre className="mt-2 text-sm text-red-800 overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
