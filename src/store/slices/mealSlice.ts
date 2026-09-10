import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { getTodayMealsAPI, voteMealAPI, updateMenuAPI } from '../../services/api'

export interface MealDetails {
  id: string
  name: string
  time: string
  menu: string
  registrations: number
  limit: number
  cutoff: string
  timeLeft: string
  userVote: 'yes' | 'no' | null
  isClosed?: boolean
}

interface MealState {
  todayMeals: MealDetails[]
  weeklyAttendance: {
    day: string
    registered: number
    served: number
    wasted: number
  }[]
  sessionStats: {
    breakfast: { cook: number; served: number; savedKg: number }
    lunch: { cook: number; served: number; savedKg: number }
    dinner: { cook: number; served: number; savedKg: number }
  }
  isLoading: boolean
  error: string | null
}

const initialMockMeals: MealDetails[] = [
  {
    id: 'breakfast',
    name: 'Breakfast',
    time: '8:00 - 9:30 AM',
    menu: 'Masala Dosa · Sambar · Coconut Chutney · Filter Coffee · Seasonal Fruits',
    registrations: 312,
    limit: 420,
    cutoff: '07:00 AM',
    timeLeft: '02:14:33 left',
    userVote: 'yes',
    isClosed: false
  },
  {
    id: 'lunch',
    name: 'Lunch',
    time: '12:30 - 2:00 PM',
    menu: 'Jeera Rice · Dal Tadka · Paneer Butter Masala · Chapati · Salad · Gulab Jamun',
    registrations: 386,
    limit: 420,
    cutoff: '11:00 AM',
    timeLeft: '02:14:33 left',
    userVote: null,
    isClosed: false
  },
  {
    id: 'dinner',
    name: 'Dinner',
    time: '7:30 - 9:00 PM',
    menu: 'Veg Biryani · Raita · Mirchi ka Salan · Chapati · Fruit Custard',
    registrations: 274,
    limit: 420,
    cutoff: '05:00 PM',
    timeLeft: '02:14:33 left',
    userVote: null,
    isClosed: false
  }
]

const initialState: MealState = {
  todayMeals: initialMockMeals,
  weeklyAttendance: [
    { day: 'Mon', registered: 350, served: 330, wasted: 20 },
    { day: 'Tue', registered: 390, served: 370, wasted: 20 },
    { day: 'Wed', registered: 400, served: 386, wasted: 14 },
    { day: 'Thu', registered: 380, served: 355, wasted: 25 },
    { day: 'Fri', registered: 420, served: 410, wasted: 10 },
    { day: 'Sat', registered: 320, served: 300, wasted: 20 },
    { day: 'Sun', registered: 280, served: 260, wasted: 20 }
  ],
  sessionStats: {
    breakfast: { cook: 337, served: 218, savedKg: 4.2 },
    lunch: { cook: 417, served: 270, savedKg: 4.2 },
    dinner: { cook: 296, served: 192, savedKg: 4.2 }
  },
  isLoading: false,
  error: null
}

// Async Thunks
export const fetchTodayMealsAsync = createAsyncThunk(
  'meals/fetchTodayMeals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getTodayMealsAPI()
      return response.meals as MealDetails[]
    } catch (error: any) {
      console.warn('Backend offline: using initial mock today meals.')
      return initialMockMeals
    }
  }
)

export const voteMealAsync = createAsyncThunk(
  'meals/voteMeal',
  async (payload: { id: string; vote: 'yes' | 'no' }, { rejectWithValue }) => {
    try {
      await voteMealAPI(payload.id, payload.vote)
      return { id: payload.id, vote: payload.vote }
    } catch (error: any) {
      console.warn('Backend voting failed. Voting locally on mock state.')
      // Reject so extra reducers can throw, or resolve with payload to fall back
      return { id: payload.id, vote: payload.vote, fallback: true, error: error.message }
    }
  }
)

export const updateMealMenuAsync = createAsyncThunk(
  'meals/updateMealMenu',
  async (payload: { id: string; menu: string }, { rejectWithValue }) => {
    try {
      const response = await updateMenuAPI(payload.id, { menuText: payload.menu })
      return { id: payload.id, menu: response.menu.menuText }
    } catch (error: any) {
      console.warn('Backend menu override failed: running locally.')
      return { id: payload.id, menu: payload.menu }
    }
  }
)

export const updateMealSettingsAsync = createAsyncThunk(
  'meals/updateMealSettings',
  async (payload: { id: string; time: string; cutoff: string; limit: number }, { rejectWithValue }) => {
    try {
      let formattedCutoff = payload.cutoff
      if (payload.cutoff.toLowerCase().includes('am') || payload.cutoff.toLowerCase().includes('pm')) {
        const parts = payload.cutoff.split(' ')
        const timeParts = parts[0].split(':')
        let hr = Number(timeParts[0])
        const min = timeParts[1] || '00'
        if (payload.cutoff.toLowerCase().includes('pm') && hr < 12) hr += 12
        if (payload.cutoff.toLowerCase().includes('am') && hr === 12) hr = 0
        const pad = (n: number) => String(n).padStart(2, '0')
        formattedCutoff = `${pad(hr)}:${min}`
      }
      
      const response = await updateMenuAPI(payload.id, {
        time: payload.time,
        cutoffTime: formattedCutoff,
        limit: payload.limit
      })
      
      return {
        id: payload.id,
        time: response.menu.time,
        cutoff: `${response.menu.cutoffTime} ${Number(response.menu.cutoffTime.split(':')[0]) >= 12 ? 'PM' : 'AM'}`,
        limit: response.menu.limit
      }
    } catch (error: any) {
      console.warn('Backend timing save failed: updating locally.')
      return { id: payload.id, time: payload.time, cutoff: payload.cutoff, limit: payload.limit }
    }
  }
)

const mealSlice = createSlice({
  name: 'meals',
  initialState,
  reducers: {
    // Synchronous backups if needed
    voteMeal: (state, action: PayloadAction<{ id: string; vote: 'yes' | 'no' }>) => {
      const meal = state.todayMeals.find(m => m.id === action.payload.id)
      if (meal) {
        if (meal.userVote === 'yes' && action.payload.vote === 'no') {
          meal.registrations = Math.max(0, meal.registrations - 1)
        } else if ((meal.userVote === null || meal.userVote === 'no') && action.payload.vote === 'yes') {
          meal.registrations = Math.min(meal.limit, meal.registrations + 1)
        }
        meal.userVote = action.payload.vote
      }
    },
    updateMenu: (state, action: PayloadAction<{ id: string; menu: string }>) => {
      const meal = state.todayMeals.find(m => m.id === action.payload.id)
      if (meal) {
        meal.menu = action.payload.menu
      }
    },
    updateMealSettings: (state, action: PayloadAction<{ id: string; time: string; cutoff: string; limit: number }>) => {
      const meal = state.todayMeals.find(m => m.id === action.payload.id)
      if (meal) {
        meal.time = action.payload.time
        meal.cutoff = action.payload.cutoff
        meal.limit = action.payload.limit
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Today Meals
      .addCase(fetchTodayMealsAsync.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchTodayMealsAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.todayMeals = action.payload
      })
      .addCase(fetchTodayMealsAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch meals'
      })
      
      // Vote Meal Async
      .addCase(voteMealAsync.fulfilled, (state, action) => {
        const meal = state.todayMeals.find(m => m.id === action.payload.id)
        if (meal) {
          // Adjust count
          if (meal.userVote === 'yes' && action.payload.vote === 'no') {
            meal.registrations = Math.max(0, meal.registrations - 1)
          } else if ((meal.userVote === null || meal.userVote === 'no') && action.payload.vote === 'yes') {
            meal.registrations = Math.min(meal.limit, meal.registrations + 1)
          }
          meal.userVote = action.payload.vote
        }
      })
      // Update Meal Menu Async
      .addCase(updateMealMenuAsync.fulfilled, (state, action) => {
        const meal = state.todayMeals.find(m => m.id === action.payload.id)
        if (meal) {
          meal.menu = action.payload.menu
        }
      })
      // Update Meal Settings Async
      .addCase(updateMealSettingsAsync.fulfilled, (state, action) => {
        const meal = state.todayMeals.find(m => m.id === action.payload.id)
        if (meal) {
          meal.time = action.payload.time
          meal.cutoff = action.payload.cutoff
          meal.limit = action.payload.limit
        }
      })
  }
})

export const { voteMeal, updateMenu, updateMealSettings } = mealSlice.actions
export default mealSlice.reducer
