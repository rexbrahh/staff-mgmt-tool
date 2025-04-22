import { Request, Response } from 'express';
import { Leave, LeaveStatus } from '../models/Leave';
import mongoose from 'mongoose';

// Define a type for our user structure
interface UserInfo {
  _id: string;
  role: string;
}

// Submit a leave request
export const requestLeave = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInfo;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = user._id;
    const { startDate, endDate, leaveType, reason } = req.body;
    
    // Basic validation
    if (!startDate || !endDate || !leaveType || !reason) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      return res.status(400).json({ message: 'Start date must be before end date' });
    }
    
    if (start < new Date()) {
      return res.status(400).json({ message: 'Cannot request leave for past dates' });
    }
    
    // Check for overlapping leave requests
    const overlappingLeaves = await Leave.findOne({
      user: userId,
      status: { $ne: LeaveStatus.REJECTED }, // Exclude rejected requests
      $or: [
        { 
          // New leave starts during existing leave
          startDate: { $lte: end },
          endDate: { $gte: start }
        },
        {
          // New leave ends during existing leave
          startDate: { $lte: end },
          endDate: { $gte: start }
        }
      ]
    });
    
    if (overlappingLeaves) {
      return res.status(400).json({ message: 'You already have a leave request during this period' });
    }
    
    // Create leave request
    const leaveRequest = new Leave({
      user: userId,
      startDate: start,
      endDate: end,
      leaveType,
      reason,
      status: LeaveStatus.PENDING
    });
    
    await leaveRequest.save();
    
    res.status(201).json({
      message: 'Leave request submitted successfully',
      leaveRequest
    });
  } catch (error) {
    console.error('Error submitting leave request:', error);
    res.status(500).json({ message: 'Error submitting leave request' });
  }
};

// Get leave requests for a user
export const getUserLeaves = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.query;
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
    
    // Build query
    const query: any = { user: id };
    
    if (status) {
      query.status = status;
    }
    
    const leaveRequests = await Leave.find(query)
      .sort({ createdAt: -1 });
    
    res.status(200).json(leaveRequests);
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    res.status(500).json({ message: 'Error fetching leave requests' });
  }
};

// Get all leave requests (for admin/manager)
export const getAllLeaves = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInfo;
    // Only admin and managers can access all leave requests
    if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    
    const { status } = req.query;
    
    // Build query
    const query: any = {};
    
    if (status) {
      query.status = status;
    }
    
    const leaveRequests = await Leave.find(query)
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 });
    
    res.status(200).json(leaveRequests);
  } catch (error) {
    console.error('Error fetching all leave requests:', error);
    res.status(500).json({ message: 'Error fetching all leave requests' });
  }
};

// Approve a leave request
export const approveLeave = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInfo;
    // Only admin and managers can approve leave
    if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    
    const { id } = req.params;
    
    // Ensure valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid leave request ID' });
    }
    
    // Find leave request
    const leaveRequest = await Leave.findById(id);
    
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    if (leaveRequest.status !== LeaveStatus.PENDING) {
      return res.status(400).json({ message: `Leave is already ${leaveRequest.status}` });
    }
    
    // Update leave status
    leaveRequest.status = LeaveStatus.APPROVED;
    leaveRequest.approvedBy = new mongoose.Types.ObjectId(user._id);
    leaveRequest.approvedAt = new Date();
    
    await leaveRequest.save();
    
    res.status(200).json({
      message: 'Leave request approved successfully',
      leaveRequest
    });
  } catch (error) {
    console.error('Error approving leave request:', error);
    res.status(500).json({ message: 'Error approving leave request' });
  }
};

// Reject a leave request
export const rejectLeave = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInfo;
    // Only admin and managers can reject leave
    if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    
    const { id } = req.params;
    const { rejectionReason } = req.body;
    
    // Ensure valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid leave request ID' });
    }
    
    // Find leave request
    const leaveRequest = await Leave.findById(id);
    
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    if (leaveRequest.status !== LeaveStatus.PENDING) {
      return res.status(400).json({ message: `Leave is already ${leaveRequest.status}` });
    }
    
    // Update leave status
    leaveRequest.status = LeaveStatus.REJECTED;
    leaveRequest.approvedBy = new mongoose.Types.ObjectId(user._id);
    leaveRequest.approvedAt = new Date();
    leaveRequest.rejectionReason = rejectionReason;
    
    await leaveRequest.save();
    
    res.status(200).json({
      message: 'Leave request rejected',
      leaveRequest
    });
  } catch (error) {
    console.error('Error rejecting leave request:', error);
    res.status(500).json({ message: 'Error rejecting leave request' });
  }
};

// Cancel a leave request
export const cancelLeave = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInfo;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { id } = req.params;
    
    // Ensure valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid leave request ID' });
    }
    
    // Find leave request
    const leaveRequest = await Leave.findById(id);
    
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    // Check if user owns this leave request or is admin/manager
    const isOwner = leaveRequest.user.toString() === user._id;
    const isAdminOrManager = user.role === 'admin' || user.role === 'manager';
    
    if (!isOwner && !isAdminOrManager) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    
    // Regular users can only cancel their pending requests
    if (isOwner && !isAdminOrManager && leaveRequest.status !== LeaveStatus.PENDING) {
      return res.status(400).json({ message: 'Cannot cancel a processed leave request' });
    }
    
    // Update leave status
    leaveRequest.status = LeaveStatus.CANCELLED;
    
    await leaveRequest.save();
    
    res.status(200).json({
      message: 'Leave request cancelled successfully',
      leaveRequest
    });
  } catch (error) {
    console.error('Error cancelling leave request:', error);
    res.status(500).json({ message: 'Error cancelling leave request' });
  }
}; 