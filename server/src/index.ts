import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import connectDB from './config/db'
import authRoutes from './routes/auth.routes'
import studentRoutes from './routes/student.routes'
import staffRoutes from './routes/staff.routes'
import wardenRoutes from './routes/warden.routes'
import { seedMockUsers } from './controllers/auth.controller'

// Load environment variables
dotenv.config()

const app = express()
const PORT = Number(process.env.PORT) || 5000

// Connect to MongoDB
connectDB().then(() => {
  // Seed mock users and initial data
  seedMockUsers(true).catch((err) => console.error('Auto-seed error on connect:', err))
})

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'https://hostel-frontend-5fx4.onrender.com'
]

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, postman, server-to-server)
      if (!origin) return callback(null, true)
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.onrender.com') ||
        (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL)
      ) {
        return callback(null, true)
      }
      // Allow any requesting origin
      return callback(null, true)
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/student', studentRoutes)
app.use('/api/staff', staffRoutes)
app.use('/api/warden', wardenRoutes)

// Default root response
app.get('/', (req, res) => {
  res.json({ message: 'MessSync Server API is running' })
})

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Internal server error', error: err.message })
})

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})

