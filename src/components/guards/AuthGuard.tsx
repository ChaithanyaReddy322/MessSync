import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'
import { UserRole } from '../../store/slices/authSlice'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, currentRole, isLoading } = useAppSelector((state) => state.auth)
  const location = useLocation()

  // Wait if recovering session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-brand" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm font-semibold text-gray-500">Checking credentials...</span>
        </div>
      </div>
    )
  }

  // Not authenticated -> send to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Authenticated but wrong role -> send to their correct dashboard
  if (requiredRole && currentRole !== requiredRole) {
    console.warn(`Redirecting unauthorized access to role page for role: ${currentRole}`)
    switch (currentRole) {
      case 'student':
        return <Navigate to="/student/dashboard" replace />
      case 'staff':
        return <Navigate to="/staff/dashboard" replace />
      case 'warden':
        return <Navigate to="/warden/dashboard" replace />
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />
      default:
        return <Navigate to="/login" replace />
    }
  }

  return <>{children}</>
}
export default AuthGuard
