import express from 'express';
import { getUserNotifications, markAsRead } from '../controllers/notificationController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(protect, getUserNotifications);
router.route('/:id/read').put(protect, markAsRead);

export default router;
