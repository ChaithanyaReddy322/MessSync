import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { getMyLeavesAPI, submitLeaveAPI, getPendingLeavesAPI, reviewLeaveAPI } from '../../services/api'

export interface LeaveRequest {
  id: string
  startDate: string
  endDate: string
  reason: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  totalDays: number
  submittedAt: string
  studentName?: string
  studentRollNo?: string
  studentRoom?: string
}

interface LeaveState {
  leaves: LeaveRequest[]
  isLoading: boolean
  error: string | null
}

const initialMockLeaves: LeaveRequest[] = [
  {
    id: 'L-7629',
    startDate: '2026-07-30',
    endDate: '2026-08-02',
    reason: 'Visiting home for weekend',
    status: 'approved',
    totalDays: 4,
    submittedAt: '2026-07-28',
    studentName: 'Aarav Sharma',
    studentRollNo: 'MS2024001',
    studentRoom: 'B-204'
  },
  {
    id: 'L-1290',
    startDate: '2026-06-12',
    endDate: '2026-06-15',
    reason: 'Medical checkup',
    status: 'completed',
    totalDays: 3,
    submittedAt: '2026-06-10',
    studentName: 'Aditya Menon',
    studentRollNo: 'MS2024079',
    studentRoom: 'C-115'
  }
]

const initialState: LeaveState = {
  leaves: initialMockLeaves,
  isLoading: false,
  error: null
}

// Async Thunks
export const fetchLeavesAsync = createAsyncThunk(
  'leaves/fetchLeaves',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMyLeavesAPI()
      return response.leaves.map((l: any) => ({
        id: l.id || l._id,
        startDate: l.startDate,
        endDate: l.endDate,
        reason: l.reason,
        status: l.status,
        totalDays: l.totalDays,
        submittedAt: l.createdAt ? l.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]
      })) as LeaveRequest[]
    } catch (error: any) {
      console.warn('Backend offline: using mock initial leaves.')
      return initialMockLeaves
    }
  }
)

export const fetchPendingLeavesAsync = createAsyncThunk(
  'leaves/fetchPendingLeaves',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPendingLeavesAPI()
      return response.leaves as any[]
    } catch (error: any) {
      console.warn('Backend offline: fallback to mock pending leaves.')
      return []
    }
  }
)

export const submitLeaveAsync = createAsyncThunk(
  'leaves/submitLeave',
  async (payload: { startDate: string; endDate: string; reason: string }, { rejectWithValue }) => {
    try {
      const response = await submitLeaveAPI(payload.startDate, payload.endDate, payload.reason)
      const l = response.leave
      return {
        id: l._id || l.id,
        startDate: l.startDate,
        endDate: l.endDate,
        reason: l.reason,
        status: l.status,
        totalDays: l.totalDays,
        submittedAt: l.createdAt ? l.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]
      } as LeaveRequest
    } catch (error: any) {
      console.warn('Backend offline: logging leave request locally.')
      const start = new Date(payload.startDate)
      const end = new Date(payload.endDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      
      return {
        id: `L-${Math.floor(1000 + Math.random() * 9000)}`,
        startDate: payload.startDate,
        endDate: payload.endDate,
        reason: payload.reason,
        status: 'pending',
        totalDays: diffDays,
        submittedAt: new Date().toISOString().split('T')[0]
      } as LeaveRequest
    }
  }
)

export const reviewLeaveRequestAsync = createAsyncThunk(
  'leaves/reviewLeaveRequest',
  async (payload: { id: string; status: 'approved' | 'rejected' }, { rejectWithValue }) => {
    try {
      await reviewLeaveAPI(payload.id, payload.status)
      return { id: payload.id, status: payload.status }
    } catch (error: any) {
      console.warn('Backend review action failed: executing locally.')
      return { id: payload.id, status: payload.status }
    }
  }
)

const leaveSlice = createSlice({
  name: 'leaves',
  initialState,
  reducers: {
    updateLeaveStatus: (state, action: PayloadAction<{ id: string; status: 'approved' | 'rejected' }>) => {
      const leave = state.leaves.find(l => l.id === action.payload.id)
      if (leave) {
        leave.status = action.payload.status
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Leaves
      .addCase(fetchLeavesAsync.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchLeavesAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.leaves = action.payload
      })
      .addCase(fetchLeavesAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch leaves'
      })
      
      // Fetch Pending Leaves (Warden view)
      .addCase(fetchPendingLeavesAsync.fulfilled, (state, action) => {
        if (action.payload && action.payload.length > 0) {
          state.leaves = action.payload.map((l: any) => ({
            id: l._id || l.id,
            startDate: l.startDate,
            endDate: l.endDate,
            reason: l.reason,
            status: l.status,
            totalDays: l.totalDays,
            submittedAt: l.createdAt ? l.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
            studentName: l.student?.name || 'Unknown Resident',
            studentRollNo: l.student?.rollNo || 'N/A',
            studentRoom: l.student?.room || 'N/A'
          }))
        }
      })

      // Submit Leave
      .addCase(submitLeaveAsync.fulfilled, (state, action) => {
        state.leaves.unshift(action.payload)
      })

      // Review Leave
      .addCase(reviewLeaveRequestAsync.fulfilled, (state, action) => {
        const leave = state.leaves.find(l => l.id === action.payload.id)
        if (leave) {
          leave.status = action.payload.status as any
        }
      })
  }
})

export const { updateLeaveStatus } = leaveSlice.actions
export default leaveSlice.reducer
