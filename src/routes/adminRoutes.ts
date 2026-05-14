import express from 'express';
import { getAllUsers, deleteUser, updateUserRole, getDashboardStats } from '../controllers/adminController';
import { protect, superadmin, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/stats').get(protect, admin, getDashboardStats);
router.route('/users').get(protect, superadmin, getAllUsers);
router.route('/users/:id').delete(protect, superadmin, deleteUser);
router.route('/users/:id/role').put(protect, superadmin, updateUserRole);

export default router;
