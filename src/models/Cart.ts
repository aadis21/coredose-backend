import mongoose, { Schema, Document } from 'mongoose';

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  cartItems: {
    product: mongoose.Types.ObjectId;
    name: string;
    qty: number;
    price: number;
    image?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const CartSchema: Schema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User', unique: true },
    cartItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
        name: { type: String, required: true },
        qty: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true },
        image: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<ICart>('Cart', CartSchema);
