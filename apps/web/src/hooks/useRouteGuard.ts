import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

interface RouteGuardOptions {
  requiresAuth?: boolean
  redirectTo?: string
}

export const useRouteGuard = (options: RouteGuardOptions = {}) => {
  const navigate = useNavigate()
  const location = useLocation()

  const { requiresAuth = false, redirectTo = '/' } = options

  useEffect(() => {
    // Future: Check authentication status when auth is implemented
    if (requiresAuth) {
      const isAuthenticated = false // TODO: Implement auth check

      if (!isAuthenticated) {
        navigate(redirectTo, {
          replace: true,
          state: { from: location.pathname },
        })
      }
    }
  }, [requiresAuth, redirectTo, navigate, location.pathname])

  const canAccess = !requiresAuth || true // TODO: Replace with actual auth check

  return {
    canAccess,
    isAuthenticated: false, // TODO: Replace with actual auth status
  }
}
