import express from 'express';
import { getWishlist, addToWishlist, removeFromWishlist, checkWishlist, clearWishlist } from '../controllers/wishlistController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(protect, getWishlist).delete(protect, clearWishlist);
router.route('/add').post(protect, addToWishlist);
router.route('/item/:productId').delete(protect, removeFromWishlist);
router.route('/check/:productId').get(protect, checkWishlist);

export default router;
