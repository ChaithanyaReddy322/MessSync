import mongoose, { Schema, Document } from 'mongoose'

export interface IAttendance extends Document {
  student: mongoose.Types.ObjectId
  meal: 'breakfast' | 'lunch' | 'dinner'
  date: string // "YYYY-MM-DD"
  status: 'served' | 'missed'
  scannedAt: Date
}

const AttendanceSchema: Schema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    meal: { type: String, enum: ['breakfast', 'lunch', 'dinner'], required: true },
    date: { type: String, required: true }, // Format "YYYY-MM-DD"
    status: { type: String, enum: ['served', 'missed'], required: true },
    scannedAt: { type: Date, default: Date.now, required: true }
  },
  { timestamps: true }
)

// Index to prevent duplicate check-ins
AttendanceSchema.index({ student: 1, date: 1, meal: 1 }, { unique: true })

export const Attendance = mongoose.model<IAttendance>('Attendance', AttendanceSchema)
export default Attendance
