import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'coredose-products',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  } as any,
});

const upload = multer({ storage });

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), (req: any, res) => {
  if (req.file) {
    res.send({
      url: req.file.path,
      public_id: req.file.filename,
    });
  } else {
    res.status(400).send('No file uploaded');
  }
});

export default router;
