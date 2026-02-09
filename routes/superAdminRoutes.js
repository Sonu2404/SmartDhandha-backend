import express from 'express';
const router = express.Router();
import { protect, superadmin } from '../middleware/authMiddleware.js';

import {
    getSystemStats,
    getAllUsers,
    deleteUser,
    approveUser,
    updateMySettings, 
} from '../controllers/superAdminController.js'; 

router.route('/stats').get(protect, superadmin, getSystemStats);
router.route('/users').get(protect, superadmin, getAllUsers);
router.route('/users/:id').delete(protect, superadmin, deleteUser);

router.route('/users/:id/approve').patch(protect, superadmin, approveUser);

router.route('/settings').patch(protect, superadmin, updateMySettings);

export default router;
