import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiRequest, setAccessToken } from '../../services/api'
import { authApi } from '../api/authApi'

export type UserRole = 'student' | 'staff' | 'warden' | 'admin'

export interface UserProfile {
  id: string
  name: string
  role: UserRole
  roleName: string
  avatar: string
  hostel?: string
  room?: string
  rollNo?: string
  email: string
  phone?: string
  parentName?: string
  parentPhone?: string
  streak?: number
  stats?: {
    mealsTaken?: number
    mealsMissed?: number
    attendancePercent?: number
    foodSavedKg?: number
  }
}

interface AuthState {
  currentUser: UserProfile | null
  isAuthenticated: boolean
  currentRole: UserRole | null
  isLoading: boolean
  error: string | null
  allMockUsers: Record<UserRole, UserProfile>
}

const mockUsers: Record<UserRole, UserProfile> = {
  student: {
    id: 'MS2024001',
    name: 'Aarav Sharma',
    role: 'student',
    roleName: 'Student',
    avatar: 'AS',
    hostel: 'Nalanda Hostel',
    room: 'Room B-204',
    rollNo: 'MS2024001',
    email: 'aarav.sharma@institution.edu',
    phone: '+91 98765 43210',
    parentName: 'Ramesh Sharma',
    parentPhone: '+91 98765 43211',
    streak: 12,
    stats: {
      mealsTaken: 41,
      mealsMissed: 3,
      attendancePercent: 94,
      foodSavedKg: 6.4
    }
  },
  staff: {
    id: 'STAFF089',
    name: 'Rekha Devi',
    role: 'staff',
    roleName: 'Head Chef',
    avatar: 'RD',
    hostel: 'Nalanda Hostel Mess',
    email: 'rekha.devi@messsync.com',
    phone: '+91 87654 32109',
    stats: {
      mealsTaken: 972,
      mealsMissed: 586,
      attendancePercent: 14.2,
      foodSavedKg: 1050
    }
  },
  warden: {
    id: 'WARDEN007',
    name: 'Priya Sinha',
    role: 'warden',
    roleName: 'Warden - Nalanda Hostel',
    avatar: 'PS',
    hostel: 'Nalanda Hostel',
    email: 'priya.sinha@institution.edu',
    phone: '+91 76543 21098'
  },
  admin: {
    id: 'ADMIN001',
    name: 'Dr. Alok Kumar',
    role: 'admin',
    roleName: 'Chief Administrator',
    avatar: 'AK',
    email: 'alok.kumar@institution.edu',
    phone: '+91 99999 88888'
  }
}

// Async Thunks
export const loginUserAsync = createAsyncThunk(
  'auth/loginUser',
  async (payload: { rollNo: string; role: UserRole }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ rollNo: payload.rollNo, password: 'password123' }) // default password for mock verification
      })
      setAccessToken(response.accessToken)
      return response.user as UserProfile
    } catch (error: any) {
      console.warn('Backend API login failed. Falling back to local mock authentication details.')
      // Fallback local login
      return mockUsers[payload.role]
    }
  }
)

export const logoutUserAsync = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' })
    } catch (err) {}
    setAccessToken(null)
    return null
  }
)

export const checkAuthAsync = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest('/auth/profile')
      return response.user as UserProfile
    } catch (error: any) {
      return null
    }
  }
)

const hasToken = typeof window !== 'undefined' ? !!localStorage.getItem('accessToken') : false

const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
  currentRole: null,
  isLoading: hasToken,
  error: null,
  allMockUsers: mockUsers
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    switchRole: (state, action: PayloadAction<UserRole>) => {
      state.currentRole = action.payload
      state.currentUser = state.allMockUsers[action.payload]
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.currentUser = null
      state.currentRole = null
      state.isAuthenticated = false
      setAccessToken(null)
      localStorage.removeItem('accessToken')
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload }
        if (state.currentRole) {
          state.allMockUsers[state.currentRole] = state.currentUser
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Legacy thunks support for demo compatibility
      .addCase(loginUserAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentUser = action.payload
        state.currentRole = action.payload.role
        state.isAuthenticated = true
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(logoutUserAsync.fulfilled, (state) => {
        state.currentUser = null
        state.currentRole = null
        state.isAuthenticated = false
      })
      .addCase(checkAuthAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.currentUser = action.payload
          state.currentRole = action.payload.role
          state.isAuthenticated = true
        }
        state.isLoading = false
      })
      .addCase(checkAuthAsync.rejected, (state) => {
        state.isLoading = false
      })
      // RTK Query Matcher bindings
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.isLoading = false
        state.currentUser = action.payload.user
        state.currentRole = action.payload.user.role
        state.isAuthenticated = true
        setAccessToken(action.payload.accessToken)
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as any)?.data?.message || 'Login failed'
      })
      .addMatcher(authApi.endpoints.getCurrentUser.matchPending, (state) => {
        state.isLoading = true
      })
      .addMatcher(authApi.endpoints.getCurrentUser.matchFulfilled, (state, action) => {
        state.isLoading = false
        state.currentUser = action.payload.user
        state.currentRole = action.payload.user.role
        state.isAuthenticated = true
      })
      .addMatcher(authApi.endpoints.getCurrentUser.matchRejected, (state) => {
        state.isLoading = false
        state.currentUser = null
        state.currentRole = null
        state.isAuthenticated = false
        setAccessToken(null)
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.currentUser = null
        state.currentRole = null
        state.isAuthenticated = false
        setAccessToken(null)
      })
  }
})

export const { switchRole, logout, updateProfile } = authSlice.actions
export default authSlice.reducer
