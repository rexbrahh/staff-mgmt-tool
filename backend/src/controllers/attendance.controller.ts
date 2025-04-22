import { Request, Response } from 'express';
import { Attendance } from '../models/Attendance';
import mongoose from 'mongoose';

// Define a type for our user structure
interface UserInfo {
  _id: string;
  role: string;
}

// Record check-in
export const checkIn = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInfo;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = user._id;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Check if already checked in today
    const existingAttendance = await Attendance.findOne({
      user: userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    
    if (existingAttendance) {
      return res.status(400).json({ message: 'Already checked in today' });
    }
    
    // Determine if late (for example, if check-in after 9:30 AM)
    const startTime = new Date(today);
    startTime.setHours(9, 30, 0); // 9:30 AM
    
    const status = now > startTime ? 'late' : 'present';
    
    // Create new attendance record
    const attendance = new Attendance({
      user: userId,
      date: today,
      checkIn: now,
      status
    });
    
    await attendance.save();
    
    res.status(201).json({
      message: 'Check-in successful',
      attendance
    });
  } catch (error) {
    console.error('Error during check-in:', error);
    res.status(500).json({ message: 'Error during check-in' });
  }
};

// Record check-out
export const checkOut = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInfo;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = user._id;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Find today's attendance record
    const attendance = await Attendance.findOne({
      user: userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    
    if (!attendance) {
      return res.status(404).json({ message: 'No check-in record found for today' });
    }
    
    if (attendance.checkOut) {
      return res.status(400).json({ message: 'Already checked out today' });
    }
    
    // Update with checkout time
    attendance.checkOut = now;
    
    // Calculate work hours (will be done in pre-save hook)
    await attendance.save();
    
    res.status(200).json({
      message: 'Check-out successful',
      attendance
    });
  } catch (error) {
    console.error('Error during check-out:', error);
    res.status(500).json({ message: 'Error during check-out' });
  }
};

// Get today's attendance status
export const getTodayStatus = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInfo;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const attendance = await Attendance.findOne({
      user: userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    
    if (!attendance) {
      return res.status(200).json({ 
        status: 'not-checked-in',
        message: 'Not checked in today'
      });
    }
    
    res.status(200).json({
      status: attendance.checkOut ? 'checked-out' : 'checked-in',
      attendance
    });
  } catch (error) {
    console.error('Error getting today attendance status:', error);
    res.status(500).json({ message: 'Error getting attendance status' });
  }
};

// Get attendance history for a user
export const getUserAttendance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user as UserInfo;
    
    // Ensure valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    // Check permissions
    if (
      !user || 
      (user._id !== id && user.role !== 'admin' && user.role !== 'manager')
    ) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    
    const { startDate, endDate } = req.query;
    
    // Build query
    const query: any = { user: id };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }
    
    const attendanceRecords = await Attendance.find(query)
      .sort({ date: -1 });
    
    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error('Error getting user attendance:', error);
    res.status(500).json({ message: 'Error getting user attendance' });
  }
};

// Get all staff attendance (for admins and managers)
export const getAllAttendance = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInfo;
    // Only admin and managers can access all attendance
    if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    
    const { date } = req.query;
    
    // Build query for specific date if provided
    const query: any = {};
    
    if (date) {
      const queryDate = new Date(date as string);
      query.date = {
        $gte: queryDate,
        $lt: new Date(queryDate.getTime() + 24 * 60 * 60 * 1000)
      };
    }
    
    const attendanceRecords = await Attendance.find(query)
      .populate('user', 'firstName lastName email')
      .sort({ date: -1 });
    
    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error('Error getting attendance records:', error);
    res.status(500).json({ message: 'Error getting attendance records' });
  }
};

// Mark user as absent (for admins and managers)
export const markAbsent = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInfo;
    // Only admin and managers can mark absences
    if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    
    const { userId, date, notes } = req.body;
    
    // Ensure valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    // Parse date or use today
    const absenceDate = date ? new Date(date) : new Date();
    absenceDate.setHours(0, 0, 0, 0);
    
    // Check if attendance record already exists for this date
    const existingAttendance = await Attendance.findOne({
      user: userId,
      date: {
        $gte: absenceDate,
        $lt: new Date(absenceDate.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    
    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance record already exists for this date' });
    }
    
    // Create absent record
    const attendance = new Attendance({
      user: userId,
      date: absenceDate,
      checkIn: absenceDate, // Set to beginning of day
      status: 'absent',
      notes
    });
    
    await attendance.save();
    
    res.status(201).json({
      message: 'User marked as absent',
      attendance
    });
  } catch (error) {
    console.error('Error marking absence:', error);
    res.status(500).json({ message: 'Error marking absence' });
  }
}; 