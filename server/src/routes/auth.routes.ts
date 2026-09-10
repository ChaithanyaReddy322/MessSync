import { Router } from 'express'
import { loginUser, refreshAccessToken, logoutUser, getUserProfile, forgotPassword, resetPassword } from '../controllers/auth.controller'
import { protect } from '../middleware/auth.middleware'

const router = Router()

router.post('/login', loginUser)
router.post('/refresh', refreshAccessToken)
router.post('/logout', logoutUser)
router.get('/me', protect, getUserProfile)
router.get('/profile', protect, getUserProfile)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

export default router
