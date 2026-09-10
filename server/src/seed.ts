import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { seedMockUsers } from './controllers/auth.controller'

dotenv.config()

const runSeed = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/messsync'
  const sanitizedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')
  console.log(`Connecting to MongoDB at: ${sanitizedUri}`)

  try {
    await mongoose.connect(uri)
    console.log('MongoDB connection established.')
    
    console.log('Seeding mock data (users, menus, inventory)...')
    const result = await seedMockUsers(true)
    
    console.log('Database seeded successfully!')
    console.log('Available Mock Login Accounts:')
    console.table(result.defaultCredentials)

    await mongoose.disconnect()
    console.log('MongoDB connection closed.')
    process.exit(0)
  } catch (error) {
    console.error('Seeding process failed:', error)
    process.exit(1)
  }
}

runSeed()
