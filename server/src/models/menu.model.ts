import mongoose, { Schema, Document } from 'mongoose'

export interface IMenu extends Document {
  mealId: 'breakfast' | 'lunch' | 'dinner'
  name: string
  time: string
  menuText: string
  cutoffTime: string // "HH:MM" format (24 hour), e.g. "07:00", "11:00", "17:00"
  limit: number
}

const MenuSchema: Schema = new Schema(
  {
    mealId: { type: String, required: true, unique: true, enum: ['breakfast', 'lunch', 'dinner'] },
    name: { type: String, required: true },
    time: { type: String, required: true },
    menuText: { type: String, required: true },
    cutoffTime: { type: String, required: true },
    limit: { type: Number, required: true, default: 420 }
  },
  { timestamps: true }
)

export const Menu = mongoose.model<IMenu>('Menu', MenuSchema)
export default Menu
