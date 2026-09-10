import { Response } from 'express'
import { AuthenticatedRequest } from '../middleware/auth.middleware'
import Menu from '../models/menu.model'
import MealVote from '../models/mealVote.model'
import LeaveRequest from '../models/leaveRequest.model'

// Helper to get today's date in local YYYY-MM-DD format
const getTodayString = (): string => {
  const d = new Date()
  const offset = d.getTimezoneOffset()
  const localDate = new Date(d.getTime() - offset * 60 * 1000)
  return localDate.toISOString().split('T')[0]
}

// Helper to check if server time is past cutoff deadline
const isPastCutoff = (cutoffStr: string): { closed: boolean; timeLeftStr: string } => {
  const now = new Date()
  const [hours, minutes] = cutoffStr.split(':').map(Number)
  
  const deadline = new Date()
  deadline.setHours(hours, minutes, 0, 0)

  if (now > deadline) {
    return { closed: true, timeLeftStr: 'Closed' }
  }

  const diffMs = deadline.getTime() - now.getTime()
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000)

  const pad = (num: number) => String(num).padStart(2, '0')
  return { 
    closed: false, 
    timeLeftStr: `${pad(diffHrs)}:${pad(diffMins)}:${pad(diffSecs)} left` 
  }
}

export const getTodayMeals = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const studentId = req.user?._id
  const todayStr = getTodayString()

  try {
    const menus = await Menu.find()
    const compiledMeals = []

    for (const menu of menus) {
      // 1. Count total YES registrations for this meal today
      const registrations = await MealVote.countDocuments({
        date: todayStr,
        mealId: menu.mealId,
        vote: 'yes'
      })

      // 2. Find current student's vote if any
      let studentVote: 'yes' | 'no' | null = null
      if (studentId) {
        const voteRecord = await MealVote.findOne({
          student: studentId,
          date: todayStr,
          mealId: menu.mealId
        })
        if (voteRecord) {
          studentVote = voteRecord.vote
        }
      }

      // 3. Compute cutoff timings
      const { closed, timeLeftStr } = isPastCutoff(menu.cutoffTime)

      compiledMeals.push({
        id: menu.mealId,
        name: menu.name,
        time: menu.time,
        menu: menu.menuText,
        registrations,
        limit: menu.limit,
        cutoff: `${menu.cutoffTime} ${Number(menu.cutoffTime.split(':')[0]) >= 12 ? 'PM' : 'AM'}`,
        timeLeft: timeLeftStr,
        userVote: studentVote,
        isClosed: closed
      })
    }

    res.status(200).json({ meals: compiledMeals })
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving today\'s meals', error: error.message })
  }
}

export const submitMealVote = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const studentId = req.user?._id
  const { mealId, vote } = req.body

  if (!mealId || !vote || !['yes', 'no'].includes(vote)) {
    res.status(400).json({ message: 'Invalid request parameters' })
    return
  }

  try {
    const menu = await Menu.findOne({ mealId })
    if (!menu) {
      res.status(404).json({ message: 'Meal configuration not found' })
      return
    }

    // Enforce cutoff timings checks
    const { closed } = isPastCutoff(menu.cutoffTime)
    if (closed) {
      res.status(400).json({ message: `Cutoff time (${menu.cutoffTime}) has passed. Voting for ${menu.name} is closed.` })
      return
    }

    const todayStr = getTodayString()

    // Upsert vote
    const voteRecord = await MealVote.findOneAndUpdate(
      { student: studentId, date: todayStr, mealId },
      { vote },
      { upsert: true, new: true }
    )

    res.status(200).json({ 
      message: 'Vote submitted successfully', 
      vote: voteRecord.vote 
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Error submitting meal vote', error: error.message })
  }
}

export const getMyLeaves = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const studentId = req.user?._id

  try {
    const leaves = await LeaveRequest.find({ student: studentId }).sort({ createdAt: -1 })
    res.status(200).json({ leaves })
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching leave requests', error: error.message })
  }
}

export const submitLeaveRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const studentId = req.user?._id
  const { startDate, endDate, reason } = req.body

  if (!startDate || !endDate || !reason) {
    res.status(400).json({ message: 'Please specify leave range and reason' })
    return
  }

  try {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

    const leave = await LeaveRequest.create({
      student: studentId,
      startDate,
      endDate,
      reason,
      status: 'pending',
      totalDays
    })

    res.status(201).json({ message: 'Leave request submitted successfully', leave })
  } catch (error: any) {
    res.status(500).json({ message: 'Error submitting leave request', error: error.message })
  }
}

export const getMyMealHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  // Returns mock meal logs for dashboard histories
  const history = [
    { date: 'Jul 28, 2026', meal: 'Dinner', vote: 'yes', status: 'collected', menu: 'Veg Biryani, Raita, Mirchi ka Salan, Chapati' },
    { date: 'Jul 28, 2026', meal: 'Lunch', vote: 'yes', status: 'collected', menu: 'Jeera Rice, Dal Tadka, Paneer Butter Masala, Chapati' },
    { date: 'Jul 28, 2026', meal: 'Breakfast', vote: 'no', status: 'excused', menu: 'Masala Dosa, Sambar, Coconut Chutney' },
    { date: 'Jul 27, 2026', meal: 'Dinner', vote: 'yes', status: 'missed', menu: 'Dal Makhani, Butter Roti, Kheer' }
  ]
  res.status(200).json({ history })
}
