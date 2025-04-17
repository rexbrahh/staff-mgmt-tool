import { Schema, model, Document, Types } from 'mongoose';
import { IUser } from './User';

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface IProject extends Document {
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: Date;
  endDate: Date;
  teamLead: Types.ObjectId | IUser;
  developers: Types.ObjectId[] | IUser[];
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(ProjectStatus),
      default: ProjectStatus.PLANNING,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    teamLead: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    developers: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
projectSchema.index({ teamLead: 1 });
projectSchema.index({ developers: 1 });
projectSchema.index({ status: 1 });

export const Project = model<IProject>('Project', projectSchema); 