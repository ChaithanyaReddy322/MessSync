import { Response } from 'express'
import { AuthenticatedRequest } from '../middleware/auth.middleware'
import User from '../models/user.model'
import LeaveRequest from '../models/leaveRequest.model'
import Notification from '../models/notification.model'

export const getStudentsDirectory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Retrieve students database listing
    const studentsList = await User.find({ role: 'student' }).select('-password')
    res.status(200).json({ students: studentsList })
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching student directory', error: error.message })
  }
}

export const notifyParentSMS = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { rollNo } = req.params

  try {
    const student = await User.findOne({ rollNo, role: 'student' })
    if (!student) {
      res.status(404).json({ message: 'Student resident not found' })
      return
    }

    // Simulate sending parent alert SMS
    student.parentNotified = true
    await student.save()

    res.status(200).json({ 
      message: `SMS warning alert successfully dispatched to parent ${student.parentName} (${student.parentPhone}) regarding missed meals.`
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Error triggering Twilio SMS dispatch', error: error.message })
  }
}

export const getPendingLeaves = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Populate student information
    const pending = await LeaveRequest.find()
      .populate('student', 'name rollNo room')
      .sort({ createdAt: -1 })
    res.status(200).json({ leaves: pending })
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving pending leaves list', error: error.message })
  }
}

export const reviewLeaveRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params
  const { status } = req.body // 'approved' or 'rejected'

  if (!status || !['approved', 'rejected'].includes(status)) {
    res.status(400).json({ message: 'Invalid leave decision status' })
    return
  }

  try {
    const leave = await LeaveRequest.findById(id)
    if (!leave) {
      res.status(404).json({ message: 'Leave request not found' })
      return
    }

    leave.status = status
    await leave.save()

    res.status(200).json({ message: `Leave request has been successfully ${status}`, leave })
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating leave request review', error: error.message })
  }
}

export const createAnnouncement = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { title, message, category, targetRole } = req.body
  const wardenId = req.user?._id

  if (!title || !message) {
    res.status(400).json({ message: 'Title and announcement content are required' })
    return
  }

  try {
    const announcement = await Notification.create({
      title,
      message,
      sender: wardenId,
      category: category || 'info',
      targetRole: targetRole || 'all'
    })

    res.status(201).json({ message: 'Announcement notice published successfully', announcement })
  } catch (error: any) {
    res.status(500).json({ message: 'Error publishing announcement notice', error: error.message })
  }
}
