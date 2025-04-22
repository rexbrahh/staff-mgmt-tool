import { Request, Response } from 'express';
import { User } from '../models/User';
import { StaffProfile } from '../models/StaffProfile';
import mongoose from 'mongoose';

// Define a type for our user structure
interface UserInfo {
  _id: string;
  role: string;
}

// Get all staff profiles (for admins and managers)
export const getAllStaffProfiles = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInfo;
    // Only admin and managers can access all profiles
    if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    const staffProfiles = await StaffProfile.find()
      .populate('user', '-password') // Exclude password from the user data
      .sort({ 'user.firstName': 1, 'user.lastName': 1 });
    
    res.status(200).json(staffProfiles);
  } catch (error) {
    console.error('Error fetching staff profiles:', error);
    res.status(500).json({ message: 'Error fetching staff profiles' });
  }
};

// Get a specific staff profile
export const getStaffProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user as UserInfo;
    
    // Ensure valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid staff ID format' });
    }

    // Check permissions - users can see their own profile, managers and admins can see all
    if (
      !user || 
      (user._id !== id && user.role !== 'admin' && user.role !== 'manager')
    ) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    const profile = await StaffProfile.findOne({ user: id }).populate('user', '-password');
    
    if (!profile) {
      return res.status(404).json({ message: 'Staff profile not found' });
    }
    
    res.status(200).json(profile);
  } catch (error) {
    console.error('Error fetching staff profile:', error);
    res.status(500).json({ message: 'Error fetching staff profile' });
  }
};

// Create a new staff profile
export const createStaffProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInfo;
    // Only admins and managers can create profiles
    if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    const { userId, ...profileData } = req.body;

    // Ensure valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if profile already exists
    const existingProfile = await StaffProfile.findOne({ user: userId });
    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists for this user' });
    }
    
    // Create new profile
    const newProfile = new StaffProfile({
      user: userId,
      ...profileData
    });
    
    await newProfile.save();
    
    const populatedProfile = await StaffProfile.findById(newProfile._id)
      .populate('user', '-password');
    
    res.status(201).json(populatedProfile);
  } catch (error) {
    console.error('Error creating staff profile:', error);
    res.status(500).json({ message: 'Error creating staff profile' });
  }
};

// Update a staff profile
export const updateStaffProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const user = req.user as UserInfo;
    
    // Ensure valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid staff ID format' });
    }
    
    // Get profile to check permissions and verify it exists
    const profile = await StaffProfile.findOne({ user: id });
    if (!profile) {
      return res.status(404).json({ message: 'Staff profile not found' });
    }
    
    // Check permissions - users can update their own profile, managers and admins can update all
    const isOwnProfile = user && user._id === id;
    const isAdminOrManager = user && (user.role === 'admin' || user.role === 'manager');
    
    if (!isOwnProfile && !isAdminOrManager) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    
    // Prevent basic users from updating certain fields
    if (isOwnProfile && !isAdminOrManager) {
      // Regular employees can only update specific fields
      const allowedUpdates = ['phoneNumber', 'address', 'emergencyContact'];
      
      // Filter out disallowed fields
      Object.keys(updates).forEach(key => {
        if (!allowedUpdates.includes(key)) {
          delete updates[key];
        }
      });
    }
    
    // Update profile
    const updatedProfile = await StaffProfile.findOneAndUpdate(
      { user: id },
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('user', '-password');
    
    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error('Error updating staff profile:', error);
    res.status(500).json({ message: 'Error updating staff profile' });
  }
};

// Delete a staff profile
export const deleteStaffProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInfo;
    // Only admins can delete profiles
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    
    const { id } = req.params;
    
    // Ensure valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid staff ID format' });
    }
    
    const result = await StaffProfile.findOneAndDelete({ user: id });
    
    if (!result) {
      return res.status(404).json({ message: 'Staff profile not found' });
    }
    
    res.status(200).json({ message: 'Staff profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff profile:', error);
    res.status(500).json({ message: 'Error deleting staff profile' });
  }
}; 