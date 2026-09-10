import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'

import Layout from './components/layout/Layout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'

// Student pages
import StudentDashboard from './pages/student/Dashboard'
import StudentMealHistory from './pages/student/MealHistory'
import StudentLeaveRequest from './pages/student/LeaveRequest'
import StudentNotifications from './pages/student/Notifications'
import StudentProfile from './pages/student/Profile'

// Mess Staff pages
import MessDashboard from './pages/mess/Dashboard'
import MessQRScanner from './pages/mess/QRScanner'
import MessMenuManagement from './pages/mess/MenuManagement'
import MessAttendance from './pages/mess/Attendance'
import MessAnalytics from './pages/mess/Analytics'

// Warden pages
import WardenDashboard from './pages/warden/Dashboard'
import WardenAlerts from './pages/warden/Alerts'
import WardenAnnouncements from './pages/warden/Announcements'
import WardenReports from './pages/warden/Reports'
import WardenStudentSearch from './pages/warden/StudentSearch'

// Admin pages
import AdminDashboard from './pages/admin/Dashboard'

import { AuthGuard } from './components/guards/AuthGuard'
import { GuestGuard } from './components/guards/GuestGuard'
import { useGetCurrentUserQuery } from './store/api/authApi'

const AppRoutes: React.FC = () => {
  const token = localStorage.getItem('accessToken')
  // Fetch user details automatically if access token is saved
  useGetCurrentUserQuery(undefined, {
    skip: !token
  })

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<GuestGuard><LoginPage /></GuestGuard>} />

      {/* Authenticated Dashboard Routes */}
      <Route element={<Layout />}>
        {/* Student Module */}
        <Route path="/student/dashboard" element={<AuthGuard requiredRole="student"><StudentDashboard /></AuthGuard>} />
        <Route path="/student/meals" element={<AuthGuard requiredRole="student"><StudentDashboard /></AuthGuard>} />
        <Route path="/student/history" element={<AuthGuard requiredRole="student"><StudentMealHistory /></AuthGuard>} />
        <Route path="/student/leave" element={<AuthGuard requiredRole="student"><StudentLeaveRequest /></AuthGuard>} />
        <Route path="/student/notifications" element={<AuthGuard requiredRole="student"><StudentNotifications /></AuthGuard>} />
        <Route path="/student/profile" element={<AuthGuard requiredRole="student"><StudentProfile /></AuthGuard>} />

        {/* Mess Kitchen Module */}
        <Route path="/staff/dashboard" element={<AuthGuard requiredRole="staff"><MessDashboard /></AuthGuard>} />
        <Route path="/staff/scanner" element={<AuthGuard requiredRole="staff"><MessQRScanner /></AuthGuard>} />
        <Route path="/staff/menu" element={<AuthGuard requiredRole="staff"><MessMenuManagement /></AuthGuard>} />
        <Route path="/staff/attendance" element={<AuthGuard requiredRole="staff"><MessAttendance /></AuthGuard>} />
        <Route path="/staff/analytics" element={<AuthGuard requiredRole="staff"><MessAnalytics /></AuthGuard>} />

        {/* Warden Module */}
        <Route path="/warden/dashboard" element={<AuthGuard requiredRole="warden"><WardenDashboard /></AuthGuard>} />
        <Route path="/warden/alerts" element={<AuthGuard requiredRole="warden"><WardenAlerts /></AuthGuard>} />
        <Route path="/warden/announcements" element={<AuthGuard requiredRole="warden"><WardenAnnouncements /></AuthGuard>} />
        <Route path="/warden/reports" element={<AuthGuard requiredRole="warden"><WardenReports /></AuthGuard>} />
        <Route path="/warden/search" element={<AuthGuard requiredRole="warden"><WardenStudentSearch /></AuthGuard>} />

        {/* Admin Module */}
        <Route path="/admin/dashboard" element={<AuthGuard requiredRole="admin"><AdminDashboard /></AuthGuard>} />
        <Route path="/admin/hostels" element={<AuthGuard requiredRole="admin"><AdminDashboard /></AuthGuard>} />
        <Route path="/admin/users" element={<AuthGuard requiredRole="admin"><AdminDashboard /></AuthGuard>} />
        <Route path="/admin/configs" element={<AuthGuard requiredRole="admin"><AdminDashboard /></AuthGuard>} />
        <Route path="/admin/reports" element={<AuthGuard requiredRole="admin"><AdminDashboard /></AuthGuard>} />
      </Route>

      {/* Catch-all Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  )
}
export default App
