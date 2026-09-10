import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { switchRole, logout, logoutUserAsync } from '../../store/slices/authSlice'
import {
  LayoutDashboard,
  UtensilsCrossed,
  History,
  CalendarDays,
  Bell,
  User,
  QrCode,
  MenuSquare,
  ClipboardList,
  BarChart3,
  AlertTriangle,
  Megaphone,
  Search,
  Building,
  Users,
  Sliders,
  LogOut,
  ChevronDown
} from 'lucide-react'
import { cn } from '../../utils/cn'

interface SidebarItem {
  name: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

export const Sidebar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  
  const currentRole = useAppSelector(state => state.auth.currentRole)
  const currentUser = useAppSelector(state => state.auth.currentUser)
  const notifications = useAppSelector(state => state.notifications.notifications)
  const leaves = useAppSelector(state => state.leaves.leaves)
  
  // Count unread notifications
  const unreadNotifCount = notifications.filter(n => n.unread).length
  // Count pending leaves for student or alerts for warden
  const pendingLeavesCount = leaves.filter(l => l.status === 'pending').length

  const getSidebarItems = (): SidebarItem[] => {
    switch (currentRole) {
      case 'student':
        return [
          { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
          { name: "Today's Meals", path: '/student/meals', icon: UtensilsCrossed, badge: 3 },
          { name: 'Meal History', path: '/student/history', icon: History },
          { name: 'Leave Request', path: '/student/leave', icon: CalendarDays },
          { name: 'Notifications', path: '/student/notifications', icon: Bell, badge: unreadNotifCount },
          { name: 'Profile', path: '/student/profile', icon: User }
        ]
      case 'staff':
        return [
          { name: 'Dashboard', path: '/staff/dashboard', icon: LayoutDashboard },
          { name: 'QR Scanner', path: '/staff/scanner', icon: QrCode },
          { name: 'Menu', path: '/staff/menu', icon: MenuSquare },
          { name: 'Attendance', path: '/staff/attendance', icon: ClipboardList },
          { name: 'Analytics', path: '/staff/analytics', icon: BarChart3 }
        ]
      case 'warden':
        return [
          { name: 'Overview', path: '/warden/dashboard', icon: LayoutDashboard },
          { name: 'Alerts', path: '/warden/alerts', icon: AlertTriangle, badge: 5 },
          { name: 'Announcements', path: '/warden/announcements', icon: Megaphone },
          { name: 'Reports', path: '/warden/reports', icon: BarChart3 },
          { name: 'Student search', path: '/warden/search', icon: Search }
        ]
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'Hostels', path: '/admin/hostels', icon: Building },
          { name: 'User Management', path: '/admin/users', icon: Users },
          { name: 'Configurations', path: '/admin/configs', icon: Sliders },
          { name: 'Reports', path: '/admin/reports', icon: BarChart3 }
        ]
      default:
        return []
    }
  }

  const items = getSidebarItems()

  const handleLogout = () => {
    dispatch(logoutUserAsync())
    navigate('/login')
  }

  const [showRoleSwitcher, setShowRoleSwitcher] = React.useState(false)

  if (!currentUser || !currentRole) return null

  return (
    <aside className="w-64 border-r border-gray-150 h-screen bg-white flex flex-col justify-between shrink-0 sticky top-0">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div className="p-6 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center text-white font-bold text-lg shadow-sm">
            M
          </div>
          <div>
            <span className="font-bold text-gray-900 text-lg tracking-tight font-heading">MessSync</span>
            <div className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold leading-none">
              {currentRole === 'staff' ? 'Mess Staff' : currentRole}
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-4 py-2 space-y-1">
          {items.map(item => {
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group cursor-pointer',
                  isActive
                    ? 'bg-brand-light text-brand font-semibold'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={cn(
                      'h-5 w-5',
                      isActive ? 'text-brand animate-float' : 'text-gray-400 group-hover:text-gray-600'
                    )}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={cn(
                      'text-xs font-semibold px-2 py-0.5 rounded-full',
                      isActive ? 'bg-brand text-white' : 'bg-gray-100 text-gray-600'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* User Area & Role Swifter */}
      <div className="p-4 border-t border-gray-100 relative">
        {showRoleSwitcher && (
          <div className="absolute bottom-16 left-4 right-4 bg-white border border-gray-200 rounded-xl shadow-lg p-2 z-50 animate-fadeIn">
            <div className="text-xs text-gray-400 font-bold px-2 py-1 uppercase tracking-wider">Demo Role Switcher</div>
            {(['student', 'staff', 'warden', 'admin'] as const).map(role => (
              <button
                key={role}
                onClick={() => {
                  dispatch(switchRole(role))
                  setShowRoleSwitcher(false)
                  navigate(`/${role === 'staff' ? 'staff' : role === 'warden' ? 'warden' : role === 'admin' ? 'admin' : 'student'}/dashboard`)
                }}
                className={cn(
                  'w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-50 flex items-center justify-between cursor-pointer',
                  currentRole === role ? 'text-brand font-semibold bg-brand-light/35' : 'text-gray-600'
                )}
              >
                <span className="capitalize">{role === 'staff' ? 'mess staff' : role}</span>
                {currentRole === role && <span className="h-1.5 w-1.5 rounded-full bg-brand" />}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors">
          <div 
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
          >
            <div className="h-9 w-9 rounded-full bg-brand-light flex items-center justify-center text-brand font-bold text-sm select-none border border-brand/20 shrink-0">
              {currentUser.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-gray-900 truncate leading-tight flex items-center gap-1">
                <span>{currentUser.name}</span>
                <ChevronDown className="h-3 w-3 text-gray-400" />
              </div>
              <div className="text-[10px] text-gray-400 truncate mt-0.5 leading-none">
                {currentRole === 'student' ? currentUser.room : currentUser.roleName}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Log Out"
            className="h-8 w-8 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
export default Sidebar
