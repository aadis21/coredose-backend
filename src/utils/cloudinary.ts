import { v2 as cloudinary } from 'cloudinary';

// This acts as a wrapper. It requires process.env.CLOUDINARY_URL or explicit config
// in a real production environment.

export const configCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

export { cloudinary };
