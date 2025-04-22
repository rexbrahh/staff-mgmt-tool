import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

export interface IAttendance extends Document {
  user: mongoose.Types.ObjectId | IUser;
  date: Date;
  checkIn: Date;
  checkOut?: Date;
  status: 'present' | 'absent' | 'late' | 'halfDay';
  notes?: string;
  workHours?: number;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'halfDay'],
      default: 'present',
    },
    notes: {
      type: String,
      trim: true,
    },
    workHours: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound index for user and date to ensure one record per day per user
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

// Method to calculate work hours when checking out
attendanceSchema.pre('save', function(next) {
  if (this.checkIn && this.checkOut) {
    // Calculate work hours in decimal format (e.g. 8.5 for 8 hours and 30 minutes)
    const checkInTime = new Date(this.checkIn).getTime();
    const checkOutTime = new Date(this.checkOut).getTime();
    const diffInMs = checkOutTime - checkInTime;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    this.workHours = parseFloat(diffInHours.toFixed(2));
  }
  next();
});

export const Attendance = mongoose.model<IAttendance>('Attendance', attendanceSchema); 