import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'
import Sidebar from './Sidebar'
import Header from './Header'

export const Layout: React.FC = () => {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Navigation Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
export default Layout
