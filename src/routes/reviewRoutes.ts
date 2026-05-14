import express from 'express';
import { createProductReview } from '../controllers/reviewController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').post(protect, createProductReview);

export default router;
