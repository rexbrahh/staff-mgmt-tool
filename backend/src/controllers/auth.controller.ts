import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { UserService } from '../models/User';
import { authConfig } from '../config/auth.config';
import { Role } from '@prisma/client';

// Define a type for our user structure
interface UserInfo {
  id: string;
  role: string;
}

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    // Check if user already exists
    const existingUser = await UserService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await UserService.createUser({
      email,
      password,
      firstName,
      lastName,
      role: role ? role.toUpperCase() as Role : Role.EMPLOYEE,
    });

    // Generate JWT token
    const payload = { id: user.id, role: user.role };
    const options: SignOptions = { expiresIn: '24h' };
    const token = jwt.sign(payload, authConfig.jwtSecret, options);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await UserService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await UserService.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const payload = { id: user.id, role: user.role };
    const options: SignOptions = { expiresIn: '24h' };
    const token = jwt.sign(payload, authConfig.jwtSecret, options);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Use type assertion to ensure TypeScript recognizes the user structure
    const userInfo = req.user as UserInfo;
    
    const user = await UserService.findUserById(userInfo.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
}; 