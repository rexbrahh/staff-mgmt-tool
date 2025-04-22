import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { StaffProfile } from '../models/StaffProfile';

// Load environment variables
dotenv.config();

// Placeholder users data
const users = [
  {
    email: 'admin@example.com',
    password: 'password123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
  },
  {
    email: 'manager@example.com',
    password: 'password123',
    firstName: 'Manager',
    lastName: 'User',
    role: 'manager',
  },
  {
    email: 'employee1@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    role: 'employee',
  },
  {
    email: 'employee2@example.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'employee',
  },
  {
    email: 'employee3@example.com',
    password: 'password123',
    firstName: 'Robert',
    lastName: 'Johnson',
    role: 'employee',
  },
];

// Placeholder staff profile data (will be matched with users by email)
const staffProfiles = [
  {
    department: 'Management',
    position: 'Admin',
    hireDate: new Date('2020-01-01'),
    address: '123 Admin St, Admin City',
    phoneNumber: '123-456-7890',
    emergencyContact: {
      name: 'Emergency Contact',
      relationship: 'Spouse',
      phoneNumber: '098-765-4321',
    },
    dateOfBirth: new Date('1980-05-15'),
  },
  {
    department: 'Engineering',
    position: 'Engineering Manager',
    hireDate: new Date('2020-02-01'),
    address: '456 Manager Ave, Manager Town',
    phoneNumber: '234-567-8901',
    emergencyContact: {
      name: 'Emergency Person',
      relationship: 'Sibling',
      phoneNumber: '987-654-3210',
    },
    dateOfBirth: new Date('1985-07-22'),
  },
  {
    department: 'Engineering',
    position: 'Software Developer',
    hireDate: new Date('2021-03-15'),
    address: '789 Dev St, Code City',
    phoneNumber: '345-678-9012',
    emergencyContact: {
      name: 'Emergency Friend',
      relationship: 'Friend',
      phoneNumber: '876-543-2109',
    },
    dateOfBirth: new Date('1990-11-05'),
  },
  {
    department: 'Marketing',
    position: 'Marketing Specialist',
    hireDate: new Date('2021-05-10'),
    address: '101 Marketing Blvd, Social City',
    phoneNumber: '456-789-0123',
    emergencyContact: {
      name: 'Emergency Family',
      relationship: 'Parent',
      phoneNumber: '765-432-1098',
    },
    dateOfBirth: new Date('1992-04-18'),
  },
  {
    department: 'Customer Support',
    position: 'Support Representative',
    hireDate: new Date('2022-01-20'),
    address: '202 Support Ave, Help Town',
    phoneNumber: '567-890-1234',
    emergencyContact: {
      name: 'Emergency Relative',
      relationship: 'Cousin',
      phoneNumber: '654-321-0987',
    },
    dateOfBirth: new Date('1988-09-30'),
  },
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/staff-mgmt')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Clear existing data
      await User.deleteMany({});
      await StaffProfile.deleteMany({});
      
      console.log('Existing data cleared');
      
      // Create users
      const createdUsers = [];
      
      for (const userData of users) {
        const newUser = new User(userData);
        await newUser.save();
        createdUsers.push(newUser);
        console.log(`Created user: ${newUser.email}`);
      }
      
      // Create staff profiles
      for (let i = 0; i < createdUsers.length; i++) {
        const user = createdUsers[i];
        const profileData = staffProfiles[i];
        
        const newProfile = new StaffProfile({
          user: user._id,
          ...profileData,
        });
        
        await newProfile.save();
        console.log(`Created profile for: ${user.email}`);
      }
      
      console.log('Seed completed successfully');
    } catch (error) {
      console.error('Error during seeding:', error);
    } finally {
      // Disconnect from MongoDB
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }); 