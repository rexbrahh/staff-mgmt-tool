import mongoose from 'mongoose';

export const dbConfig = {
  url: process.env.MONGODB_URI || 'mongodb://localhost:27017/staff-mgmt-tool',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(dbConfig.url, dbConfig.options);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}; 