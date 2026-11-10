import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Spinner } from '@/components/ui/Spinner'
import type { RoleName } from '@/types/database'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireRole?: RoleName | RoleName[]
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true,
  requireRole 
}: ProtectedRouteProps) {
  const { user, isLoading, isInitialized, hasRole, isStaff, isAdmin } = useAuthStore()
  const location = useLocation()

  if (!isInitialized || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireRole) {
    const roles = Array.isArray(requireRole) ? requireRole : [requireRole]
    const hasRequiredRole = roles.some(role => {
      if (role === 'admin' || role === 'superadmin') return isAdmin()
      if (role === 'moderator') return isStaff()
      return hasRole(role)
    })

    if (!hasRequiredRole) {
      return <Navigate to="/" replace />
    }
  }

  return <>{children}</>
}
