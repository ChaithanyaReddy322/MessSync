import mongoose, { Schema, Document } from 'mongoose'

export interface INotification extends Document {
  title: string
  message: string
  sender: mongoose.Types.ObjectId
  targetRole: 'all' | 'student' | 'staff'
  category: 'alert' | 'maintenance' | 'info'
}

const NotificationSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetRole: { type: String, enum: ['all', 'student', 'staff'], default: 'all', required: true },
    category: { type: String, enum: ['alert', 'maintenance', 'info'], default: 'info', required: true }
  },
  { timestamps: true }
)

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema)
export default Notification
