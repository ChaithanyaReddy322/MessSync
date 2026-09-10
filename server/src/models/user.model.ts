import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  name: string
  email: string
  password?: string
  role: 'student' | 'staff' | 'warden' | 'admin'
  roleName: string
  avatar: string
  hostel?: string
  room?: string
  rollNo?: string
  phone?: string
  parentName?: string
  parentPhone?: string
  parentNotified?: boolean
  streak?: number
  refreshToken?: string
  stats?: {
    mealsTaken?: number
    mealsMissed?: number
    attendancePercent?: number
    foodSavedKg?: number
  }
  matchPassword(enteredPassword: string): Promise<boolean>
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['student', 'staff', 'warden', 'admin'],
      required: true
    },
    roleName: { type: String, required: true },
    avatar: { type: String, required: true },
    hostel: { type: String },
    room: { type: String },
    rollNo: { type: String, index: true },
    phone: { type: String },
    parentName: { type: String },
    parentPhone: { type: String },
    parentNotified: { type: Boolean, default: false },
    streak: { type: Number, default: 0 },
    refreshToken: { type: String },
    stats: {
      mealsTaken: { type: Number, default: 0 },
      missedMeals: { type: Number, default: 0 }, // mappings
      attendancePercent: { type: Number, default: 100 },
      foodSavedKg: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true
  }
)

// Encrypt password before saving
UserSchema.pre('save', async function (this: IUser, next) {
  if (!this.isModified('password')) {
    return next()
  }
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password || '', salt)
    next()
  } catch (err: any) {
    next(err)
  }
})

// Compare password
UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password || '')
}

export const User = mongoose.model<IUser>('User', UserSchema)
export default User
