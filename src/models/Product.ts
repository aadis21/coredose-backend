import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  user?: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  ingredients: string[];
  price: number;
  stock: number;
  countInStock?: number;
  image?: string;
  images: string[];
  brand?: string;
  flavors?: string[];
  badges?: string[];
  category: mongoose.Types.ObjectId;
  isFeatured: boolean;
  ratings: number;
  numReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    ingredients: [{ type: String }],
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, default: 0 },
    image: { type: String },
    images: [{ type: String }],
    brand: { type: String },
    flavors: [{ type: String }],
    badges: [{ type: String }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    isFeatured: { type: Boolean, default: false },
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>('Product', ProductSchema);
