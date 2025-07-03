import { prisma } from '../config/database';
import bcrypt from 'bcryptjs';
import { User, Role } from '@prisma/client';

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: Role;
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
  isActive?: boolean;
}

export class UserService {
  static async createUser(userData: CreateUserData): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    return await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        staffProfile: true,
      },
    });
  }

  static async findUserById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        staffProfile: true,
      },
    });
  }

  static async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: userData,
    });
  }

  static async deleteUser(id: string): Promise<User> {
    return await prisma.user.delete({
      where: { id },
    });
  }

  static async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async getAllUsers(): Promise<User[]> {
    return await prisma.user.findMany({
      include: {
        staffProfile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  static async getUsersByRole(role: Role): Promise<User[]> {
    return await prisma.user.findMany({
      where: { role },
      include: {
        staffProfile: true,
      },
    });
  }
} 