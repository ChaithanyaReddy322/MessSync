import mongoose from 'mongoose'

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/messsync'
  try {
    const conn = await mongoose.connect(uri)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`MongoDB Connection Warning: ${error}. Make sure MongoDB is running locally.`)
  }
}
export default connectDB
