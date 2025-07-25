import React from 'react'
import { renderHook } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { useRouteGuard } from '../../hooks/useRouteGuard'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
    {children}
  </BrowserRouter>
)

describe('useRouteGuard Hook', () => {
  it('returns default values when no options provided', () => {
    const { result } = renderHook(() => useRouteGuard(), { wrapper })

    expect(result.current.canAccess).toBe(true)
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('allows access when authentication is not required', () => {
    const { result } = renderHook(() => useRouteGuard({ requiresAuth: false }), { wrapper })

    expect(result.current.canAccess).toBe(true)
  })

  it('handles authentication requirement (mocked)', () => {
    const { result } = renderHook(() => useRouteGuard({ requiresAuth: true }), { wrapper })

    // Currently mocked to allow access - will be updated when auth is implemented
    expect(result.current.canAccess).toBe(true)
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('accepts custom redirect path', () => {
    const { result } = renderHook(
      () => useRouteGuard({ requiresAuth: true, redirectTo: '/custom-login' }),
      { wrapper }
    )

    // Hook should initialize without errors
    expect(result.current).toBeDefined()
  })
})
