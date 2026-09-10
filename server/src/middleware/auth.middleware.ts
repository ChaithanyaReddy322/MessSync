import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt'
import User, { IUser } from '../models/user.model'

export interface AuthenticatedRequest extends Request {
  user?: IUser
}

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, access token missing' })
    return
  }

  try {
    const decoded = verifyAccessToken(token)
    const user = await User.findById(decoded.id).select('-password')
    
    if (!user) {
      res.status(401).json({ message: 'User not found' })
      return
    }

    req.user = user
    next()
  } catch (error: any) {
    res.status(401).json({ message: 'Not authorized, invalid token' })
  }
}

export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: `Role (${req.user?.role}) is not authorized to access this resource` })
      return
    }
    next()
  }
}
