import { Router } from 'express'
import { getTodayMeals, submitMealVote, getMyLeaves, submitLeaveRequest, getMyMealHistory } from '../controllers/student.controller'
import { protect, authorize } from '../middleware/auth.middleware'

const router = Router()

// All student routes are protected and restricted to student role
router.use(protect)
router.use(authorize('student'))

router.get('/meals', getTodayMeals)
router.post('/vote', submitMealVote)
router.get('/leaves', getMyLeaves)
router.post('/leaves', submitLeaveRequest)
router.get('/history', getMyMealHistory)

export default router
