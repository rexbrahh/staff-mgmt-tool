import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

export enum LeaveStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}

export enum LeaveType {
  SICK = 'sick',
  VACATION = 'vacation',
  PERSONAL = 'personal',
  BEREAVEMENT = 'bereavement',
  MATERNITY = 'maternity',
  PATERNITY = 'paternity',
  OTHER = 'other'
}

export interface ILeave extends Document {
  user: mongoose.Types.ObjectId | IUser;
  startDate: Date;
  endDate: Date;
  leaveType: LeaveType;
  reason: string;
  status: LeaveStatus;
  approvedBy?: mongoose.Types.ObjectId | IUser;
  approvedAt?: Date;
  rejectionReason?: string;
  numberOfDays: number;
}

const leaveSchema = new Schema<ILeave>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    leaveType: {
      type: String,
      enum: Object.values(LeaveType),
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(LeaveStatus),
      default: LeaveStatus.PENDING,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    numberOfDays: {
      type: Number,
      required: true,
      min: 0.5, // Allow half day leave
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
leaveSchema.index({ user: 1, status: 1 });
leaveSchema.index({ startDate: 1, endDate: 1 });

// Pre-save hook to calculate number of days
leaveSchema.pre('save', function(next) {
  if (this.isModified('startDate') || this.isModified('endDate')) {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    
    // Calculate the difference in days
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Add 1 to include both start and end days
    this.numberOfDays = diffDays + 1;
  }
  next();
});

export const Leave = mongoose.model<ILeave>('Leave', leaveSchema); 