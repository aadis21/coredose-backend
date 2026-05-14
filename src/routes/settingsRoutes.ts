import express from 'express';
import { getSettings, getAdminSettings, updateSettings } from '../controllers/settingsController';
import { protect, superadmin, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(getSettings)
  .put(protect, superadmin, updateSettings);

router.route('/admin').get(protect, admin, getAdminSettings);

export default router;
