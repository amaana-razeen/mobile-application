import mongoose, { Schema, Document } from "mongoose";

export interface IService extends Document {
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  createdAt?: Date;
}

const serviceSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  category: {
    type: String,
    enum: ['haircut', 'haircolor', 'facial', 'makeup', 'nailart', 'dressing'],
    required: true,
  },
});

export default mongoose.model<IService>("Service", serviceSchema);