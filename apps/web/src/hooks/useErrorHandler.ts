import { useState, useCallback } from 'react'

export interface ErrorState {
  message: string
  code?: string
  isRetryable?: boolean
  timestamp: Date
}

export interface UseErrorHandlerReturn {
  error: ErrorState | null
  setError: (error: string | ErrorState | null) => void
  clearError: () => void
  handleError: (error: unknown, fallbackMessage?: string) => void
  isRetrying: boolean
  retry: () => Promise<void>
}

export const useErrorHandler = (onRetry?: () => Promise<void>): UseErrorHandlerReturn => {
  const [error, setErrorState] = useState<ErrorState | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)

  const setError = useCallback((error: string | ErrorState | null) => {
    if (!error) {
      setErrorState(null)
      return
    }

    if (typeof error === 'string') {
      setErrorState({
        message: error,
        timestamp: new Date(),
        isRetryable: false,
      })
    } else {
      setErrorState({
        ...error,
        timestamp: error.timestamp || new Date(),
      })
    }
  }, [])

  const clearError = useCallback(() => {
    setErrorState(null)
  }, [])

  const handleError = useCallback(
    (error: unknown, fallbackMessage = 'Beklenmeyen bir hata oluştu') => {
      console.error('Error occurred:', error)

      if (error instanceof Error) {
        setError({
          message: error.message || fallbackMessage,
          code: (error as any).code,
          isRetryable: isRetryableError(error),
          timestamp: new Date(),
        })
      } else if (typeof error === 'string') {
        setError(error)
      } else {
        setError(fallbackMessage)
      }
    },
    [setError]
  )

  const retry = useCallback(async () => {
    if (!onRetry || !error?.isRetryable) return

    setIsRetrying(true)
    try {
      await onRetry()
      clearError()
    } catch (retryError) {
      handleError(retryError, 'Tekrar deneme başarısız oldu')
    } finally {
      setIsRetrying(false)
    }
  }, [onRetry, error?.isRetryable, clearError, handleError])

  return {
    error,
    setError,
    clearError,
    handleError,
    isRetrying,
    retry,
  }
}

function isRetryableError(error: Error): boolean {
  const retryableCodes = ['NETWORK_ERROR', 'TIMEOUT', 'TEMPORARY_ERROR']
  const errorCode = (error as any).code

  if (errorCode && retryableCodes.includes(errorCode)) {
    return true
  }

  // Network errors or server errors (5xx) are usually retryable
  const message = error.message.toLowerCase()
  return (
    message.includes('network') || message.includes('timeout') || message.includes('server error')
  )
}
