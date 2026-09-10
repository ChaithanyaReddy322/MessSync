import { Router } from 'express'
import { getStudentsDirectory, notifyParentSMS, getPendingLeaves, reviewLeaveRequest, createAnnouncement } from '../controllers/warden.controller'
import { protect, authorize } from '../middleware/auth.middleware'

const router = Router()

// All warden routes are protected and restricted to warden role
router.use(protect)
router.use(authorize('warden'))

router.get('/students', getStudentsDirectory)
router.post('/students/:rollNo/notify', notifyParentSMS)
router.get('/leaves', getPendingLeaves)
router.put('/leaves/:id', reviewLeaveRequest)
router.post('/announcements', createAnnouncement)

export default router
