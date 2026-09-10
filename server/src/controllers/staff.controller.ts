import { Request, Response } from 'express'
import { AuthenticatedRequest } from '../middleware/auth.middleware'
import InventoryItem from '../models/inventory.model'
import Feedback from '../models/feedback.model'
import Attendance from '../models/attendance.model'
import User from '../models/user.model'
import MealVote from '../models/mealVote.model'
import Menu from '../models/menu.model'

// Helper to get today's date in local YYYY-MM-DD format
const getTodayString = (): string => {
  const d = new Date()
  const offset = d.getTimezoneOffset()
  const localDate = new Date(d.getTime() - offset * 60 * 1000)
  return localDate.toISOString().split('T')[0]
}

export const getInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await InventoryItem.find()
    res.status(200).json({ inventory: items })
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving inventory', error: error.message })
  }
}

export const updateStockItem = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  const { quantity } = req.body

  if (quantity === undefined || quantity < 0) {
    res.status(400).json({ message: 'Please specify a valid quantity amount' })
    return
  }

  try {
    const item = await InventoryItem.findByIdAndUpdate(id, { quantity }, { new: true })
    if (!item) {
      res.status(404).json({ message: 'Inventory item not found' })
      return
    }
    res.status(200).json({ message: 'Inventory stock level updated successfully', item })
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating stock level', error: error.message })
  }
}

export const getFeedbackLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const logs = await Feedback.find()
      .populate('student', 'name rollNo')
      .sort({ createdAt: -1 })
    res.status(200).json({ feedback: logs })
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching feedback logs', error: error.message })
  }
}

export const processQRScan = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { rollNo, mealName } = req.body

  if (!rollNo || !mealName) {
    res.status(400).json({ message: 'Please specify Roll number ID and meal session' })
    return
  }

  const todayStr = getTodayString()
  const mealId = mealName.toLowerCase() as 'breakfast' | 'lunch' | 'dinner'

  try {
    // 1. Locate student
    const student = await User.findOne({ rollNo, role: 'student' })
    if (!student) {
      res.status(200).json({
        status: 'error',
        message: 'Invalid QR Code - Student credentials not registered in database.',
        rollNo,
        studentName: 'Unknown Resident',
        room: 'N/A',
        meal: mealName
      })
      return
    }

    // 2. Check if student has already collected their meal today
    const existingAttendance = await Attendance.findOne({
      student: student._id,
      date: todayStr,
      meal: mealId
    })

    if (existingAttendance) {
      res.status(200).json({
        status: 'warning',
        message: `Warning: Meal already served to student ${student.name}.`,
        rollNo,
        studentName: student.name,
        room: student.room || 'N/A',
        meal: mealName
      })
      return
    }

    // 3. Verify if student voted/registered yes for this meal
    const voteRecord = await MealVote.findOne({
      student: student._id,
      date: todayStr,
      mealId: mealId
    })

    let warningMsg = ''
    if (!voteRecord || voteRecord.vote !== 'yes') {
      warningMsg = ' (Warning: Resident did not register/vote for this meal today)'
    }

    // 4. Log successful attendance serves
    await Attendance.create({
      student: student._id,
      meal: mealId,
      date: todayStr,
      status: 'served'
    })

    res.status(200).json({
      status: 'success',
      message: `Checked-in successfully for ${mealName}.${warningMsg}`,
      rollNo,
      studentName: student.name,
      room: student.room || 'N/A',
      meal: mealName
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Error processing QR Scan check-in', error: error.message })
  }
}

export const updateMealMenu = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params // mealId: e.g. 'breakfast'
  const { menuText, time, cutoffTime, limit } = req.body

  try {
    const updateData: any = {}
    if (menuText !== undefined) updateData.menuText = menuText
    if (time !== undefined) updateData.time = time
    if (cutoffTime !== undefined) updateData.cutoffTime = cutoffTime
    if (limit !== undefined) updateData.limit = limit

    const menu = await Menu.findOneAndUpdate(
      { mealId: id },
      updateData,
      { new: true }
    )

    if (!menu) {
      res.status(404).json({ message: 'Menu configuration not found' })
      return
    }

    res.status(200).json({ message: 'Menu configuration updated successfully', menu })
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating meal menu configurations', error: error.message })
  }
}
