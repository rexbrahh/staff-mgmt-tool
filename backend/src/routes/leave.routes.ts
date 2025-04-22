import express from 'express';
import * as leaveController from '../controllers/leave.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// Submit leave request (for all staff)
router.post(
  '/',
  authenticate,
  leaveController.requestLeave as any
);

// Get leave requests for a specific user
router.get(
  '/user/:id',
  authenticate,
  leaveController.getUserLeaves as any
);

// Get all leave requests (admin and manager only)
router.get(
  '/',
  authenticate,
  authorize('admin', 'manager'),
  leaveController.getAllLeaves as any
);

// Approve leave request (admin and manager only)
router.put(
  '/:id/approve',
  authenticate,
  authorize('admin', 'manager'),
  leaveController.approveLeave as any
);

// Reject leave request (admin and manager only)
router.put(
  '/:id/reject',
  authenticate,
  authorize('admin', 'manager'),
  leaveController.rejectLeave as any
);

// Cancel leave request
router.put(
  '/:id/cancel',
  authenticate,
  leaveController.cancelLeave as any
);

export default router; 