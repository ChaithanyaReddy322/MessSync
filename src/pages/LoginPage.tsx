import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../store/hooks'
import { UserRole } from '../store/slices/authSlice'
import { useLoginMutation } from '../store/api/authApi'
import { GraduationCap, Utensils, Shield, SlidersHorizontal, ArrowRight } from 'lucide-react'
import { cn } from '../utils/cn'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [login, { isLoading: isLoginLoading }] = useLoginMutation()

  const [activeRole, setActiveRole] = useState<UserRole>('student')
  const [userId, setUserId] = useState('MS2024001')
  const [password, setPassword] = useState('password123')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role)
    setErrorMsg(null)
    setSuccessMsg(null)
    // Update default credentials based on roles
    switch (role) {
      case 'student':
        setUserId('MS2024001')
        break
      case 'staff':
        setUserId('STAFF089')
        break
      case 'warden':
        setUserId('WARDEN007')
        break
      case 'admin':
        setUserId('ADMIN001')
        break
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      await login({ rollNo: userId, password, role: activeRole }).unwrap()
      setSuccessMsg('Successfully signed in!')
      
      // Redirect based on active role
      setTimeout(() => {
        switch (activeRole) {
          case 'student':
            navigate('/student/dashboard')
            break
          case 'staff':
            navigate('/staff/dashboard')
            break
          case 'warden':
            navigate('/warden/dashboard')
            break
          case 'admin':
            navigate('/admin/dashboard')
            break
        }
      }, 600)
    } catch (error: any) {
      console.error('Login failed:', error)
      setErrorMsg(error?.data?.message || 'Authentication failed. Please check credentials.')
    }
  }

  const getRoleButtonLabel = () => {
    switch (activeRole) {
      case 'student':
        return 'Sign In to Student'
      case 'staff':
        return 'Sign In to Mess Staff'
      case 'warden':
        return 'Sign In to Warden'
      case 'admin':
        return 'Sign In to Admin'
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row relative">
      {/* Brand Logo - Top Left */}
      <div 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 cursor-pointer z-50 select-none"
      >
        <div className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center text-white font-bold text-lg shadow-sm">
          M
        </div>
        <span className="font-bold text-gray-900 text-lg tracking-tight font-heading">MessSync</span>
      </div>

      {/* Left Column (Brand and Metrics) */}
      <div className="flex-1 bg-gradient-to-tr from-brand-light/35 via-white to-white flex flex-col justify-between p-12 pt-28 text-left select-none border-r border-gray-50 md:min-h-screen">
        <div className="max-w-md my-auto space-y-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight font-heading">
            Serve smarter. <br />
            <span className="text-brand">Waste less.</span>
          </h1>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
            The calm, modern operating system for hostel messes. Loved by students, wardens, and kitchens across 40+ universities.
          </p>

          <div className="flex items-center gap-3 pt-4">
            <div className="bg-white border border-gray-100/50 rounded-2xl p-4 shadow-xs text-center shrink-0 w-24">
              <span className="block text-2xl font-bold text-gray-900 font-heading">42%</span>
              <span className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">less waste</span>
            </div>
            <div className="bg-white border border-gray-100/50 rounded-2xl p-4 shadow-xs text-center shrink-0 w-24">
              <span className="block text-2xl font-bold text-gray-900 font-heading">18k+</span>
              <span className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">meals/wk</span>
            </div>
            <div className="bg-white border border-gray-100/50 rounded-2xl p-4 shadow-xs text-center shrink-0 w-24">
              <span className="block text-2xl font-bold text-gray-900 font-heading">4.8/5</span>
              <span className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">parent NPS</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-400 font-medium">
          🌱 Cutting food waste, one meal at a time.
        </div>
      </div>

      {/* Right Column (Login Form) */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white md:min-h-screen">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight font-heading">Welcome back</h2>
            <p className="text-gray-400 text-xs font-semibold">Sign in to your MessSync account.</p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-600 border border-red-100/50 rounded-xl p-3 text-xs font-semibold select-none leading-relaxed">
              ⚠️ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="bg-green-50 text-green-600 border border-green-100/50 rounded-xl p-3 text-xs font-semibold select-none leading-relaxed">
              ✨ {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            {/* Tabs List */}
            <div className="bg-gray-100/70 p-1 rounded-xl grid grid-cols-4 gap-0.5 select-none">
              <button
                type="button"
                onClick={() => handleRoleChange('student')}
                className={cn(
                  'py-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all duration-150 cursor-pointer',
                  activeRole === 'student'
                    ? 'bg-white text-gray-900 shadow-xs font-bold'
                    : 'text-gray-400 hover:text-gray-600'
                )}
              >
                <GraduationCap className="h-4.5 w-4.5" />
                <span className="text-[10px]">Student</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('staff')}
                className={cn(
                  'py-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all duration-150 cursor-pointer',
                  activeRole === 'staff'
                    ? 'bg-white text-gray-900 shadow-xs font-bold'
                    : 'text-gray-400 hover:text-gray-600'
                )}
              >
                <Utensils className="h-4.5 w-4.5" />
                <span className="text-[10px] whitespace-nowrap">Mess Staff</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('warden')}
                className={cn(
                  'py-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all duration-150 cursor-pointer',
                  activeRole === 'warden'
                    ? 'bg-white text-gray-900 shadow-xs font-bold'
                    : 'text-gray-400 hover:text-gray-600'
                )}
              >
                <Shield className="h-4.5 w-4.5" />
                <span className="text-[10px]">Warden</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={cn(
                  'py-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all duration-150 cursor-pointer',
                  activeRole === 'admin'
                    ? 'bg-white text-gray-900 shadow-xs font-bold'
                    : 'text-gray-400 hover:text-gray-600'
                )}
              >
                <SlidersHorizontal className="h-4.5 w-4.5" />
                <span className="text-[10px]">Admin</span>
              </button>
            </div>

            {/* Input fields */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  {activeRole === 'student' ? 'Roll number' : activeRole === 'staff' ? 'Staff ID' : activeRole === 'warden' ? 'Warden ID' : 'Admin ID'} or hostel ID
                </label>
                <input
                  type="text"
                  required
                  value={userId}
                  onChange={e => setUserId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-250 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/35 focus:border-brand transition-all"
                  placeholder={activeRole === 'student' ? 'e.g. MS2024001' : 'e.g. STAFF001'}
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Password</label>
                  <button type="button" className="text-[11px] font-semibold text-brand hover:text-brand-dark cursor-pointer">
                    Forgot?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-250 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/35 focus:border-brand transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoginLoading}
              className="w-full bg-brand hover:bg-brand-hover text-white py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed active:scale-[0.99] select-none"
            >
              {isLoginLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>{getRoleButtonLabel()}</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </>
              )}
            </button>
          </form>

          {/* Demo tip */}
          <p className="text-[11px] text-gray-400 font-semibold leading-relaxed bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-center select-none">
            Demo mode - pick any role above to explore the full dashboard.
          </p>

          {/* Create Account Helper */}
          <div className="text-center text-xs text-gray-400 select-none">
            Don't have an account?{' '}
            <button className="font-semibold text-brand hover:text-brand-dark transition-colors cursor-pointer">
              Contact your admin
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default LoginPage
