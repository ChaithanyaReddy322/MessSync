import mongoose, { Schema, Document } from 'mongoose'

export interface IFeedback extends Document {
  student: mongoose.Types.ObjectId
  mealId: 'breakfast' | 'lunch' | 'dinner'
  rating: number // 1 to 5
  comment?: string
  date: string // "YYYY-MM-DD"
}

const FeedbackSchema: Schema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mealId: { type: String, enum: ['breakfast', 'lunch', 'dinner'], required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    date: { type: String, required: true }
  },
  { timestamps: true }
)

export const Feedback = mongoose.model<IFeedback>('Feedback', FeedbackSchema)
export default Feedback
