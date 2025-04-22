import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

export interface IStaffProfile extends Document {
  user: mongoose.Types.ObjectId | IUser;
  department: string;
  position: string;
  hireDate: Date;
  address: string;
  phoneNumber: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  dateOfBirth?: Date;
  profileImage?: string;
}

const staffProfileSchema = new Schema<IStaffProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    hireDate: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    emergencyContact: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      relationship: {
        type: String,
        required: true,
        trim: true,
      },
      phoneNumber: {
        type: String,
        required: true,
        trim: true,
      },
    },
    dateOfBirth: {
      type: Date,
    },
    profileImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
staffProfileSchema.index({ user: 1 });
staffProfileSchema.index({ department: 1 });

export const StaffProfile = mongoose.model<IStaffProfile>('StaffProfile', staffProfileSchema); 