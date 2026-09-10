import mongoose, { Schema, Document } from 'mongoose'

export interface IMealVote extends Document {
  student: mongoose.Types.ObjectId
  mealId: 'breakfast' | 'lunch' | 'dinner'
  date: string // "YYYY-MM-DD"
  vote: 'yes' | 'no'
}

const MealVoteSchema: Schema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mealId: { type: String, enum: ['breakfast', 'lunch', 'dinner'], required: true },
    date: { type: String, required: true }, // Format "YYYY-MM-DD"
    vote: { type: String, enum: ['yes', 'no'], required: true }
  },
  { timestamps: true }
)

// Compound unique index to prevent duplicate voting
MealVoteSchema.index({ student: 1, date: 1, mealId: 1 }, { unique: true })

export const MealVote = mongoose.model<IMealVote>('MealVote', MealVoteSchema)
export default MealVote
