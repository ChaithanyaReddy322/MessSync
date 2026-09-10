import React from 'react'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { markAsRead, clearNotification, markAllAsRead } from '../../store/slices/notificationSlice'
import Card from '../../components/ui/Card'
import { Bell, Info, CheckCircle2, AlertTriangle, AlertOctagon, Trash2, CheckSquare } from 'lucide-react'
import { cn } from '../../utils/cn'

export const StudentNotifications: React.FC = () => {
  const dispatch = useAppDispatch()
  const notifications = useAppSelector(state => state.notifications.notifications)
  const unreadCount = notifications.filter(n => n.unread).length

  const getNotifColor = (category: string) => {
    switch (category) {
      case 'success':
        return 'bg-emerald-50 text-brand border-emerald-100'
      case 'warning':
        return 'bg-amber-50 text-amber-600 border-amber-100'
      case 'error':
        return 'bg-red-50 text-red-650 border-red-150'
      default:
        return 'bg-blue-50 text-blue-600 border-blue-100'
    }
  }

  const getNotifIcon = (category: string) => {
    switch (category) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />
      case 'error':
        return <AlertOctagon className="h-5 w-5" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-card flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight font-heading">Notifications</h1>
          <p className="text-gray-450 text-xs font-semibold mt-1">Inbox containing alerts, timings updates, and streak updates.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => dispatch(markAllAsRead())}
            className="text-xs text-brand hover:text-brand-dark font-bold flex items-center gap-1 cursor-pointer select-none"
          >
            <CheckSquare className="h-4 w-4" /> Mark all read
          </button>
        )}
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {notifications.length === 0 ? (
            <div className="p-16 text-center text-gray-400 select-none">
              <Bell className="h-10 w-10 text-gray-250 mx-auto mb-3" />
              <p className="text-sm font-semibold">No notifications</p>
              <p className="text-xs mt-1">You are all caught up!</p>
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => dispatch(markAsRead(notif.id))}
                className={cn(
                  'p-6 flex items-start gap-4 transition-colors cursor-pointer hover:bg-gray-50/50',
                  notif.unread ? 'bg-brand-light/5 font-semibold' : ''
                )}
              >
                <div className={cn('h-10 w-10 rounded-xl border flex items-center justify-center shrink-0', getNotifColor(notif.category))}>
                  {getNotifIcon(notif.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <h4 className={cn('text-sm text-gray-900', notif.unread ? 'font-bold' : 'font-semibold')}>{notif.title}</h4>
                    <span className="text-[10px] text-gray-400 font-semibold shrink-0">{notif.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed mt-1">{notif.message}</p>
                </div>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    dispatch(clearNotification(notif.id))
                  }}
                  className="h-8 w-8 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}
export default StudentNotifications
