import { Router } from 'express'
import { getInventory, updateStockItem, getFeedbackLogs, processQRScan, updateMealMenu } from '../controllers/staff.controller'
import { protect, authorize } from '../middleware/auth.middleware'

const router = Router()

// All staff routes are protected and restricted to staff role
router.use(protect)
router.use(authorize('staff'))

router.get('/inventory', getInventory)
router.put('/inventory/:id', updateStockItem)
router.get('/feedback', getFeedbackLogs)
router.post('/scan', processQRScan)
router.put('/menu/:id', updateMealMenu)

export default router
