import { prisma } from '../config/database';
import { UserService } from '../models/User';
import { Role } from '@prisma/client';

describe('Database Connection Tests', () => {
  beforeAll(async () => {
    // Connect to database before running tests
    await prisma.$connect();
  });

  afterAll(async () => {
    // Clean up test data and disconnect
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: 'test@'
        }
      }
    });
    await prisma.$disconnect();
  });

  describe('Database Connection', () => {
    it('should connect to the database successfully', async () => {
      const result = await prisma.$queryRaw`SELECT 1 as test`;
      expect(result).toBeDefined();
    });

    it('should be able to query database info', async () => {
      const result = await prisma.$queryRaw`SELECT version()`;
      expect(result).toBeDefined();
    });
  });

  describe('User Model CRUD Operations', () => {
    let testUserId: string;

    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'testpassword123',
        firstName: 'Test',
        lastName: 'User',
        role: Role.EMPLOYEE
      };

      const user = await UserService.createUser(userData);
      testUserId = user.id;

      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.firstName).toBe(userData.firstName);
      expect(user.role).toBe(Role.EMPLOYEE);
      expect(user.password).not.toBe(userData.password); // Should be hashed
    });

    it('should find user by email', async () => {
      const user = await UserService.findUserByEmail('test@example.com');
      
      expect(user).toBeDefined();
      expect(user?.email).toBe('test@example.com');
      expect(user?.id).toBe(testUserId);
    });

    it('should find user by ID', async () => {
      const user = await UserService.findUserById(testUserId);
      
      expect(user).toBeDefined();
      expect(user?.email).toBe('test@example.com');
      expect(user?.id).toBe(testUserId);
    });

    it('should update user information', async () => {
      const updatedUser = await UserService.updateUser(testUserId, {
        firstName: 'Updated',
        lastName: 'Name'
      });

      expect(updatedUser.firstName).toBe('Updated');
      expect(updatedUser.lastName).toBe('Name');
      expect(updatedUser.email).toBe('test@example.com'); // Should remain unchanged
    });

    it('should verify password comparison', async () => {
      const user = await UserService.findUserById(testUserId);
      if (user) {
        const isValidPassword = await UserService.comparePassword('testpassword123', user.password);
        const isInvalidPassword = await UserService.comparePassword('wrongpassword', user.password);
        
        expect(isValidPassword).toBe(true);
        expect(isInvalidPassword).toBe(false);
      }
    });

    it('should get all users', async () => {
      const users = await UserService.getAllUsers();
      
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
      expect(users.some(user => user.id === testUserId)).toBe(true);
    });

    it('should get users by role', async () => {
      const employees = await UserService.getUsersByRole(Role.EMPLOYEE);
      
      expect(Array.isArray(employees)).toBe(true);
      expect(employees.some(user => user.id === testUserId)).toBe(true);
      expect(employees.every(user => user.role === Role.EMPLOYEE)).toBe(true);
    });

    it('should delete user', async () => {
      await UserService.deleteUser(testUserId);
      
      const deletedUser = await UserService.findUserById(testUserId);
      expect(deletedUser).toBeNull();
    });
  });

  describe('Database Schema Validation', () => {
    it('should enforce unique email constraint', async () => {
      const userData = {
        email: 'unique@test.com',
        password: 'password123',
        firstName: 'First',
        lastName: 'User'
      };

      // Create first user
      const firstUser = await UserService.createUser(userData);
      expect(firstUser).toBeDefined();

      // Try to create second user with same email
      await expect(UserService.createUser(userData))
        .rejects.toThrow();

      // Clean up
      await UserService.deleteUser(firstUser.id);
    });

    it('should set default values correctly', async () => {
      const userData = {
        email: 'defaults@test.com',
        password: 'password123',
        firstName: 'Default',
        lastName: 'User'
      };

      const user = await UserService.createUser(userData);

      expect(user.role).toBe(Role.EMPLOYEE); // Default role
      expect(user.isActive).toBe(true); // Default active status
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();

      // Clean up
      await UserService.deleteUser(user.id);
    });
  });
});