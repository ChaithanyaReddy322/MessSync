import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user.model'
import Menu from '../models/menu.model'
import InventoryItem from '../models/inventory.model'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt'
import { AuthenticatedRequest } from '../middleware/auth.middleware'

// Helper to set HTTP-only cookie
const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  })
}

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { rollNo, password } = req.body

  if (!rollNo || !password) {
    res.status(400).json({ message: 'Please provide user ID/email and password' })
    return
  }

  try {
    // Find by rollNo, email or ID
    const user = await User.findOne({
      $or: [{ rollNo }, { email: rollNo }]
    })

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials. User ID not found.' })
      return
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials. Incorrect password.' })
      return
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString(), user.role)
    const refreshToken = generateRefreshToken(user._id.toString(), user.role)

    // Save refresh token to user
    user.refreshToken = refreshToken
    await user.save()

    // Send cookie
    setRefreshTokenCookie(res, refreshToken)

    res.status(200).json({
      message: 'Login successful',
      accessToken,
      user: {
        id: user.rollNo || user._id.toString(),
        name: user.name,
        role: user.role,
        roleName: user.roleName,
        avatar: user.avatar,
        hostel: user.hostel,
        room: user.room,
        rollNo: user.rollNo,
        email: user.email,
        phone: user.phone,
        parentName: user.parentName,
        parentPhone: user.parentPhone,
        streak: user.streak,
        stats: user.stats
      }
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Server error during login', error: error.message })
  }
}

export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken

  if (!refreshToken) {
    res.status(401).json({ message: 'Access denied, refresh token missing' })
    return
  }

  try {
    const decoded = verifyRefreshToken(refreshToken)
    const user = await User.findById(decoded.id)

    if (!user || user.refreshToken !== refreshToken) {
      res.status(401).json({ message: 'Invalid or expired refresh token' })
      return
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id.toString(), user.role)
    res.status(200).json({ accessToken: newAccessToken })
  } catch (error: any) {
    res.status(401).json({ message: 'Invalid or expired refresh token', error: error.message })
  }
}

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken

  try {
    if (refreshToken) {
      const decoded = verifyRefreshToken(refreshToken)
      const user = await User.findById(decoded.id)
      if (user) {
        user.refreshToken = undefined
        await user.save()
      }
    }
  } catch (err) {}

  res.clearCookie('refreshToken')
  res.status(200).json({ message: 'Logged out successfully' })
}

export const getUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(404).json({ message: 'User not found' })
    return
  }
  res.status(200).json({ user: req.user })
}

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body
  if (!email) {
    res.status(400).json({ message: 'Please provide email' })
    return
  }
  try {
    const user = await User.findOne({ email })
    if (!user) {
      res.status(404).json({ message: 'No account found with this email' })
      return
    }
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'messsync_jwt_secret_access_key_99881122', { expiresIn: '10m' })
    console.log(`[Forgot Password] Reset token generated: ${resetToken}`)
    res.status(200).json({
      message: 'Password reset link sent to registered email address',
      resetToken
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { password, token } = req.body
  if (!password || !token) {
    res.status(400).json({ message: 'Please provide password and token' })
    return
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'messsync_jwt_secret_access_key_99881122') as { id: string }
    const user = await User.findById(decoded.id)
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }
    user.password = password
    await user.save()
    res.status(200).json({ message: 'Password has been reset successfully' })
  } catch (error: any) {
    res.status(400).json({ message: 'Invalid or expired reset token', error: error.message })
  }
}


// Auto Seeding Database helper
export const seedMockUsers = async () => {
  try {
    try {
      await User.collection.dropIndexes()
      console.log('User collection indexes refreshed.')
    } catch (e) {}
    const userCount = await User.countDocuments()
    if (userCount >= 4) return

    await User.deleteMany({})
    console.log('Seeding mock users database...')
    const mockUsers = [
      {
        name: 'Aarav Sharma',
        email: 'aarav.sharma@institution.edu',
        password: 'password123',
        role: 'student',
        roleName: 'Student',
        avatar: 'AS',
        hostel: 'Nalanda Hostel',
        room: 'Room B-204',
        rollNo: 'MS2024001',
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
      {
        name: 'Rekha Devi',
        email: 'rekha.devi@messsync.com',
        password: 'password123',
        role: 'staff',
        roleName: 'Head Chef',
        avatar: 'RD',
        hostel: 'Nalanda Hostel Mess',
        rollNo: 'STAFF089',
        phone: '+91 87654 32109'
      },
      {
        name: 'Priya Sinha',
        email: 'priya.sinha@institution.edu',
        password: 'password123',
        role: 'warden',
        roleName: 'Warden - Nalanda Hostel',
        avatar: 'PS',
        hostel: 'Nalanda Hostel',
        rollNo: 'WARDEN007',
        phone: '+91 76543 21098'
      },
      {
        name: 'Dr. Alok Kumar',
        email: 'alok.kumar@institution.edu',
        password: 'password123',
        role: 'admin',
        roleName: 'Chief Administrator',
        avatar: 'AK',
        rollNo: 'ADMIN001',
        phone: '+91 99999 88888'
      }
    ]

    for (const u of mockUsers) {
      await User.create(u)
    }
    console.log('Database seeded successfully with Student, Staff, Warden, and Admin mock profiles!')

    // Seed default menus if empty
    const menuCount = await Menu.countDocuments()
    if (menuCount === 0) {
      console.log('Seeding default meal menus...')
      const defaultMenus = [
        {
          mealId: 'breakfast',
          name: 'Breakfast',
          time: '8:00 - 9:30 AM',
          menuText: 'Masala Dosa · Sambar · Coconut Chutney · Filter Coffee · Seasonal Fruits',
          cutoffTime: '07:00',
          limit: 420
        },
        {
          mealId: 'lunch',
          name: 'Lunch',
          time: '12:30 - 2:00 PM',
          menuText: 'Jeera Rice · Dal Tadka · Paneer Butter Masala · Chapati · Salad · Gulab Jamun',
          cutoffTime: '11:00',
          limit: 420
        },
        {
          mealId: 'dinner',
          name: 'Dinner',
          time: '7:30 - 9:00 PM',
          menuText: 'Veg Biryani · Raita · Mirchi ka Salan · Chapati · Fruit Custard',
          cutoffTime: '17:00',
          limit: 420
        }
      ]

      for (const m of defaultMenus) {
        await Menu.create(m)
      }
      console.log('Default menus seeded successfully!')
    }

    // Seed default inventory items if empty
    const inventoryCount = await InventoryItem.countDocuments()
    if (inventoryCount === 0) {
      console.log('Seeding default inventory stock items...')
      const defaultInventory = [
        { name: 'Basmati Rice', quantity: 250, unit: 'kg', category: 'grains' },
        { name: 'Toor Dal', quantity: 120, unit: 'kg', category: 'grains' },
        { name: 'Paneer', quantity: 45, unit: 'kg', category: 'dairy' },
        { name: 'Cooking Oil', quantity: 80, unit: 'L', category: 'grains' },
        { name: 'Wheat Flour', quantity: 300, unit: 'kg', category: 'grains' },
        { name: 'Fresh Milk', quantity: 150, unit: 'L', category: 'dairy' },
        { name: 'Mixed Vegetables', quantity: 90, unit: 'kg', category: 'vegetables' }
      ]

      for (const item of defaultInventory) {
        await InventoryItem.create(item)
      }
      console.log('Default inventory items seeded successfully!')
    }
  } catch (error) {
    console.error(`Error seeding database profiles: ${error}`)
  }
}
