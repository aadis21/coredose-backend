import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  storeName: string;
  contactEmail: string;
  currency: string;
  heroHeadline: string;
  heroSubHeadline: string;
  heroImage: string;
  razorpayKeyId: string;
  cloudinaryApiSecret: string;
}

const SettingsSchema: Schema = new Schema(
  {
    storeName: { type: String, default: 'CoreDose' },
    contactEmail: { type: String, default: 'support@coredose.com' },
    currency: { type: String, default: 'INR' },
    heroHeadline: { type: String, default: 'FUEL THE MACHINE' },
    heroSubHeadline: { type: String, default: "Science-backed formulas. Investor-level purity. We don't just build supplements; we engineer human performance." },
    heroImage: { type: String, default: '' },
    razorpayKeyId: { type: String, default: '' },
    cloudinaryApiSecret: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<ISettings>('Settings', SettingsSchema);
