import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SystemNotification {
  id: string
  title: string
  message: string
  time: string
  unread: boolean
  category: 'info' | 'success' | 'warning' | 'error'
}

interface NotificationState {
  notifications: SystemNotification[]
}

const initialState: NotificationState = {
  notifications: [
    {
      id: '1',
      title: 'Meal reminder',
      message: "Don't forget to vote for today's Dinner before the 5:00 PM cutoff.",
      time: '2 hours ago',
      unread: true,
      category: 'info'
    },
    {
      id: '2',
      title: 'Leave request approved',
      message: 'Your leave request for Jul 30 - Aug 02 has been approved by the Warden.',
      time: '1 day ago',
      unread: false,
      category: 'success'
    },
    {
      id: '3',
      title: 'Voting closed',
      message: 'Voting for Lunch is now closed. Recommended prepared count: 417 portions.',
      time: '3 hours ago',
      unread: false,
      category: 'warning'
    }
  ]
}

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<SystemNotification, 'id'>>) => {
      const newNotif: SystemNotification = {
        ...action.payload,
        id: Math.random().toString(36).substring(2, 9)
      }
      state.notifications.unshift(newNotif)
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notif = state.notifications.find(n => n.id === action.payload)
      if (notif) {
        notif.unread = false
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => {
        n.unread = false
      })
    },
    clearNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    }
  }
})

export const { addNotification, markAsRead, markAllAsRead, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer
