import express from 'express';
import * as attendanceController from '../controllers/attendance.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// Check-in (for all staff)
router.post(
  '/check-in',
  authenticate,
  attendanceController.checkIn as any
);

// Check-out (for all staff)
router.post(
  '/check-out',
  authenticate,
  attendanceController.checkOut as any
);

// Get today's attendance status (for current user)
router.get(
  '/today',
  authenticate,
  attendanceController.getTodayStatus as any
);

// Get attendance for a specific user
router.get(
  '/user/:id',
  authenticate,
  attendanceController.getUserAttendance as any
);

// Get all attendance records (admin and manager only)
router.get(
  '/',
  authenticate,
  authorize('admin', 'manager'),
  attendanceController.getAllAttendance as any
);

// Mark user as absent (admin and manager only)
router.post(
  '/absent',
  authenticate,
  authorize('admin', 'manager'),
  attendanceController.markAbsent as any
);

export default router; 