import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cartController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(protect, getCart).delete(protect, clearCart);
router.route('/add').post(protect, addToCart);
router.route('/item/:productId').put(protect, updateCartItem).delete(protect, removeFromCart);

export default router;
