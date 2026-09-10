import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'messsync_jwt_secret_access_key_99881122'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'messsync_jwt_secret_refresh_key_33445566'

export interface TokenPayload {
  id: string
  role: string
}

export const generateAccessToken = (id: string, role: string): string => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '15m' })
}

export const generateRefreshToken = (id: string, role: string): string => {
  return jwt.sign({ id, role }, JWT_REFRESH_SECRET, { expiresIn: '7d' })
}

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload
}

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload
}
