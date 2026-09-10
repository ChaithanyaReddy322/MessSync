import React, { useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { markAsRead, markAllAsRead } from '../../store/slices/notificationSlice'
import { Search, Bell, Check, Info, CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react'
import { cn } from '../../utils/cn'

export const Header: React.FC = () => {
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector(state => state.auth.currentUser)
  const notifications = useAppSelector(state => state.notifications.notifications)
  
  const [showNotifications, setShowNotifications] = useState(false)
  
  const unreadCount = notifications.filter(n => n.unread).length

  const getNotifIcon = (category: string) => {
    switch (category) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case 'error':
        return <AlertOctagon className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <header className="h-16 border-b border-gray-100 bg-white flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Search Bar */}
      <div className="relative w-80 max-w-lg">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </span>
        <input
          type="text"
          placeholder="Search students, meals, reports..."
          className="w-full pl-9 pr-12 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all duration-150"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-white border border-gray-250 rounded shadow-2xs leading-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors relative cursor-pointer"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand ring-2 ring-white" />
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-45" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2.5 w-80 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 overflow-hidden animate-fadeIn">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <span className="font-semibold text-gray-900 text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => dispatch(markAllAsRead())}
                      className="text-xs text-brand hover:text-brand-dark font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="h-3 w-3" /> Mark all read
                    </button>
                  )}
                </div>
                
                <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-xs text-gray-400">No notifications</div>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          dispatch(markAsRead(notif.id))
                        }}
                        className={cn(
                          'p-4 flex gap-3 transition-colors cursor-pointer hover:bg-gray-50',
                          notif.unread ? 'bg-brand-light/10 font-medium' : ''
                        )}
                      >
                        <span className="mt-0.5 shrink-0">{getNotifIcon(notif.category)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-900 leading-normal">{notif.message}</div>
                          <div className="text-[10px] text-gray-400 mt-1">{notif.time}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User initials badge */}
        {currentUser && (
          <div className="h-8 w-8 rounded-full bg-brand text-white font-bold text-xs flex items-center justify-center border border-brand/20 shadow-2xs select-none">
            {currentUser.avatar}
          </div>
        )}
      </div>
    </header>
  )
}
export default Header
