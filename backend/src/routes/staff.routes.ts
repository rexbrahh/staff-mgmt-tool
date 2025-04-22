import express from 'express';
import * as staffController from '../controllers/staff.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// Get all staff profiles (admin and manager only)
router.get(
  '/',
  authenticate,
  authorize('admin', 'manager'),
  staffController.getAllStaffProfiles as any
);

// Get specific staff profile
router.get(
  '/:id',
  authenticate,
  staffController.getStaffProfile as any
);

// Create new staff profile (admin and manager only)
router.post(
  '/',
  authenticate,
  authorize('admin', 'manager'),
  staffController.createStaffProfile as any
);

// Update staff profile
router.put(
  '/:id',
  authenticate,
  staffController.updateStaffProfile as any
);

// Delete staff profile (admin only)
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  staffController.deleteStaffProfile as any
);

export default router; 