import { renderHook, act } from '@testing-library/react'
import { useErrorHandler } from '../../hooks/useErrorHandler'

describe('useErrorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock console.error to avoid noise in tests
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('initialization', () => {
    it('should initialize with no error', () => {
      const { result } = renderHook(() => useErrorHandler())

      expect(result.current.error).toBeNull()
      expect(result.current.isRetrying).toBe(false)
    })
  })

  describe('setError', () => {
    it('should set error from string', () => {
      const { result } = renderHook(() => useErrorHandler())

      act(() => {
        result.current.setError('Test error message')
      })

      expect(result.current.error).toEqual({
        message: 'Test error message',
        timestamp: expect.any(Date),
        isRetryable: false,
      })
    })

    it('should set error from ErrorState object', () => {
      const { result } = renderHook(() => useErrorHandler())
      const errorState = {
        message: 'Custom error',
        code: 'CUSTOM_ERROR',
        isRetryable: true,
        timestamp: new Date('2025-01-01'),
      }

      act(() => {
        result.current.setError(errorState)
      })

      expect(result.current.error).toEqual(errorState)
    })

    it('should clear error when passed null', () => {
      const { result } = renderHook(() => useErrorHandler())

      act(() => {
        result.current.setError('Test error')
      })

      expect(result.current.error).not.toBeNull()

      act(() => {
        result.current.setError(null)
      })

      expect(result.current.error).toBeNull()
    })

    it('should set timestamp if not provided in ErrorState', () => {
      const { result } = renderHook(() => useErrorHandler())
      const errorState = {
        message: 'Error without timestamp',
        code: 'NO_TIMESTAMP',
        isRetryable: false,
      }

      act(() => {
        result.current.setError(errorState)
      })

      expect(result.current.error?.timestamp).toBeInstanceOf(Date)
    })
  })

  describe('clearError', () => {
    it('should clear existing error', () => {
      const { result } = renderHook(() => useErrorHandler())

      act(() => {
        result.current.setError('Test error')
      })

      expect(result.current.error).not.toBeNull()

      act(() => {
        result.current.clearError()
      })

      expect(result.current.error).toBeNull()
    })
  })

  describe('handleError', () => {
    it('should handle Error objects', () => {
      const { result } = renderHook(() => useErrorHandler())
      const error = new Error('Test error message')

      act(() => {
        result.current.handleError(error)
      })

      expect(result.current.error).toEqual({
        message: 'Test error message',
        code: undefined,
        isRetryable: false,
        timestamp: expect.any(Date),
      })
      expect(console.error).toHaveBeenCalledWith('Error occurred:', error)
    })

    it('should handle Error objects with code', () => {
      const { result } = renderHook(() => useErrorHandler())
      const error = new Error('Network error')
      ;(error as any).code = 'NETWORK_ERROR'

      act(() => {
        result.current.handleError(error)
      })

      expect(result.current.error).toEqual({
        message: 'Network error',
        code: 'NETWORK_ERROR',
        isRetryable: true,
        timestamp: expect.any(Date),
      })
    })

    it('should handle string errors', () => {
      const { result } = renderHook(() => useErrorHandler())

      act(() => {
        result.current.handleError('String error message')
      })

      expect(result.current.error).toEqual({
        message: 'String error message',
        timestamp: expect.any(Date),
        isRetryable: false,
      })
    })

    it('should handle unknown error types with fallback message', () => {
      const { result } = renderHook(() => useErrorHandler())

      act(() => {
        result.current.handleError({ unknown: 'object' })
      })

      expect(result.current.error).toEqual({
        message: 'Beklenmeyen bir hata oluştu',
        timestamp: expect.any(Date),
        isRetryable: false,
      })
    })

    it('should use custom fallback message', () => {
      const { result } = renderHook(() => useErrorHandler())

      act(() => {
        result.current.handleError({ unknown: 'object' }, 'Custom fallback')
      })

      expect(result.current.error?.message).toBe('Custom fallback')
    })

    it('should detect retryable network errors', () => {
      const { result } = renderHook(() => useErrorHandler())
      const networkError = new Error('Network timeout occurred')

      act(() => {
        result.current.handleError(networkError)
      })

      expect(result.current.error?.isRetryable).toBe(true)
    })

    it('should detect retryable server errors', () => {
      const { result } = renderHook(() => useErrorHandler())
      const serverError = new Error('Server error occurred')

      act(() => {
        result.current.handleError(serverError)
      })

      expect(result.current.error?.isRetryable).toBe(true)
    })
  })

  describe('retry functionality', () => {
    it('should not retry if onRetry is not provided', async () => {
      const { result } = renderHook(() => useErrorHandler())

      act(() => {
        result.current.setError({
          message: 'Retryable error',
          isRetryable: true,
          timestamp: new Date(),
        })
      })

      await act(async () => {
        await result.current.retry()
      })

      expect(result.current.error).not.toBeNull()
      expect(result.current.isRetrying).toBe(false)
    })

    it('should not retry if error is not retryable', async () => {
      const mockRetry = jest.fn().mockResolvedValue(undefined)
      const { result } = renderHook(() => useErrorHandler(mockRetry))

      act(() => {
        result.current.setError({
          message: 'Non-retryable error',
          isRetryable: false,
          timestamp: new Date(),
        })
      })

      await act(async () => {
        await result.current.retry()
      })

      expect(mockRetry).not.toHaveBeenCalled()
      expect(result.current.error).not.toBeNull()
    })

    it('should successfully retry and clear error', async () => {
      const mockRetry = jest.fn().mockResolvedValue(undefined)
      const { result } = renderHook(() => useErrorHandler(mockRetry))

      act(() => {
        result.current.setError({
          message: 'Retryable error',
          isRetryable: true,
          timestamp: new Date(),
        })
      })

      await act(async () => {
        await result.current.retry()
      })

      expect(mockRetry).toHaveBeenCalledTimes(1)
      expect(result.current.error).toBeNull()
      expect(result.current.isRetrying).toBe(false)
    })

    it('should handle retry failure', async () => {
      const retryError = new Error('Retry failed')
      const mockRetry = jest.fn().mockRejectedValue(retryError)
      const { result } = renderHook(() => useErrorHandler(mockRetry))

      act(() => {
        result.current.setError({
          message: 'Original error',
          isRetryable: true,
          timestamp: new Date(),
        })
      })

      await act(async () => {
        await result.current.retry()
      })

      expect(mockRetry).toHaveBeenCalledTimes(1)
      expect(result.current.error?.message).toBe('Tekrar deneme başarısız oldu')
      expect(result.current.isRetrying).toBe(false)
    })

    it('should set isRetrying during retry operation', async () => {
      let resolveRetry: () => void
      const retryPromise = new Promise<void>(resolve => {
        resolveRetry = resolve
      })
      const mockRetry = jest.fn().mockReturnValue(retryPromise)
      const { result } = renderHook(() => useErrorHandler(mockRetry))

      act(() => {
        result.current.setError({
          message: 'Retryable error',
          isRetryable: true,
          timestamp: new Date(),
        })
      })

      const retryCall = act(async () => {
        result.current.retry()
      })

      expect(result.current.isRetrying).toBe(true)

      resolveRetry!()
      await retryCall

      expect(result.current.isRetrying).toBe(false)
    })
  })

  describe('isRetryableError utility', () => {
    it('should identify retryable error codes', () => {
      const { result } = renderHook(() => useErrorHandler())

      const timeoutError = new Error('Request timeout')
      ;(timeoutError as any).code = 'TIMEOUT'

      act(() => {
        result.current.handleError(timeoutError)
      })

      expect(result.current.error?.isRetryable).toBe(true)
    })

    it('should identify network errors by message content', () => {
      const { result } = renderHook(() => useErrorHandler())

      const networkError = new Error('Network connection failed')

      act(() => {
        result.current.handleError(networkError)
      })

      expect(result.current.error?.isRetryable).toBe(true)
    })

    it('should not identify non-retryable errors', () => {
      const { result } = renderHook(() => useErrorHandler())

      const validationError = new Error('Invalid input data')

      act(() => {
        result.current.handleError(validationError)
      })

      expect(result.current.error?.isRetryable).toBe(false)
    })
  })
})
