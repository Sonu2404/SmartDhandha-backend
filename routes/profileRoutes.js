import express from 'express';
const router = express.Router();
import { getProfile, updateProfile, triggerBackup } from '../controllers/profileController.js';
import upload from '../config/cloudinary.js';

// --- 1. Import 'protect' ONLY ---
import { protect } from '../middleware/authMiddleware.js';

// --- Profile Routes ---
router
  .route('/')

  .get(protect, getProfile) 
  .put(protect, upload.single('avatar'), updateProfile);
  //   .put(
  //   protect,                // ✅ MUST be first
  //   upload.single('avatar'),
  //   updateProfile
  // );

// --- Backup Route ---
router.post('/backup', protect, triggerBackup);

export default router;