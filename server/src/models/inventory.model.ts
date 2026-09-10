import mongoose, { Schema, Document } from 'mongoose'

export interface IInventoryItem extends Document {
  name: string
  quantity: number
  unit: 'kg' | 'L' | 'bags'
  category: 'grains' | 'dairy' | 'vegetables' | 'poultry'
}

const InventoryItemSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    quantity: { type: Number, required: true, default: 0 },
    unit: { type: String, enum: ['kg', 'L', 'bags'], required: true },
    category: { type: String, enum: ['grains', 'dairy', 'vegetables', 'poultry'], required: true }
  },
  { timestamps: true }
)

export const InventoryItem = mongoose.model<IInventoryItem>('InventoryItem', InventoryItemSchema)
export default InventoryItem
