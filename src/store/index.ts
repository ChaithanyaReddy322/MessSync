import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import mealReducer from './slices/mealSlice'
import notificationReducer from './slices/notificationSlice'
import leaveReducer from './slices/leaveSlice'
import attendanceReducer from './slices/attendanceSlice'
import { authApi } from './api/authApi'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    meals: mealReducer,
    notifications: notificationReducer,
    leaves: leaveReducer,
    attendance: attendanceReducer,
    [authApi.reducerPath]: authApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
