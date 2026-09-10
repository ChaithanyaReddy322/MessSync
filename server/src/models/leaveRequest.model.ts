import mongoose, { Schema, Document } from 'mongoose'

export interface ILeaveRequest extends Document {
  student: mongoose.Types.ObjectId
  startDate: string // "YYYY-MM-DD"
  endDate: string // "YYYY-MM-DD"
  reason: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  totalDays: number
}

const LeaveRequestSchema: Schema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending',
      required: true
    },
    totalDays: { type: Number, required: true }
  },
  { timestamps: true }
)

export const LeaveRequest = mongoose.model<ILeaveRequest>('LeaveRequest', LeaveRequestSchema)
export default LeaveRequest
