import { Request, Response } from 'express';
import { UserService } from '../models/User';
import { prisma } from '../config/database';
import { Prisma } from '@prisma/client';

// Get all team members with pagination and filtering
export const getTeamMembers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Filter parameters
    const { role, department, search } = req.query;

    // Build where clause
    const where: Prisma.UserWhereInput = {
      isActive: true,
    };

    if (role) {
      where.role = role as any;
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    // Add department filter via staffProfile
    if (department) {
      where.staffProfile = {
        department: { contains: department as string, mode: 'insensitive' }
      };
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          staffProfile: true,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.user.count({ where }),
    ]);

    const pages = Math.ceil(total / limit);

    res.status(200).json({
      message: 'Team members retrieved successfully',
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
};

// Get team member by ID
export const getTeamMemberById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        staffProfile: true,
        assignedTasks: {
          include: {
            project: true,
          },
        },
        createdTasks: {
          include: {
            assignedTo: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    res.status(200).json({
      message: 'Team member retrieved successfully',
      data: user,
    });
  } catch (error) {
    console.error('Error fetching team member:', error);
    res.status(500).json({ error: 'Failed to fetch team member' });
  }
};

// Create new team member
export const createTeamMember = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, role, staffProfile } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        error: 'Email, password, first name, and last name are required' 
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create user with staff profile
    const user = await UserService.createUser({
      email,
      password,
      firstName,
      lastName,
      role: role || 'EMPLOYEE',
    });

    // Create staff profile if provided
    if (staffProfile) {
      await prisma.staffProfile.create({
        data: {
          userId: user.id,
          department: staffProfile.department,
          position: staffProfile.position,
          phoneNumber: staffProfile.phoneNumber,
          address: staffProfile.address,
          hireDate: staffProfile.hireDate ? new Date(staffProfile.hireDate) : null,
          salary: staffProfile.salary,
          skills: staffProfile.skills || [],
        },
      });
    }

    // Fetch the created user with profile
    const createdUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        staffProfile: true,
      },
    });

    res.status(201).json({
      message: 'Team member created successfully',
      data: createdUser,
    });
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(500).json({ error: 'Failed to create team member' });
  }
};

// Update team member
export const updateTeamMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, role, isActive, staffProfile } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: { staffProfile: true },
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    // Update user
    const updateData: any = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (role !== undefined) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    // Update staff profile if provided
    if (staffProfile) {
      const profileUpdateData: any = {};
      if (staffProfile.department !== undefined) profileUpdateData.department = staffProfile.department;
      if (staffProfile.position !== undefined) profileUpdateData.position = staffProfile.position;
      if (staffProfile.phoneNumber !== undefined) profileUpdateData.phoneNumber = staffProfile.phoneNumber;
      if (staffProfile.address !== undefined) profileUpdateData.address = staffProfile.address;
      if (staffProfile.hireDate !== undefined) profileUpdateData.hireDate = staffProfile.hireDate ? new Date(staffProfile.hireDate) : null;
      if (staffProfile.salary !== undefined) profileUpdateData.salary = staffProfile.salary;
      if (staffProfile.skills !== undefined) profileUpdateData.skills = staffProfile.skills;

      if (existingUser.staffProfile) {
        // Update existing profile
        await prisma.staffProfile.update({
          where: { userId: id },
          data: profileUpdateData,
        });
      } else {
        // Create new profile
        await prisma.staffProfile.create({
          data: {
            userId: id,
            ...profileUpdateData,
          },
        });
      }
    }

    // Fetch updated user with profile
    const updatedUser = await prisma.user.findUnique({
      where: { id },
      include: {
        staffProfile: true,
      },
    });

    res.status(200).json({
      message: 'Team member updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({ error: 'Failed to update team member' });
  }
};

// Delete team member (soft delete)
export const deleteTeamMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    // Soft delete by setting isActive to false
    await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    res.status(200).json({
      message: 'Team member deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ error: 'Failed to delete team member' });
  }
};

// Get team statistics
export const getTeamStats = async (req: Request, res: Response) => {
  try {
    const [totalMembers, activeMembers, departmentStats, roleStats] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.staffProfile.groupBy({
        by: ['department'],
        _count: { department: true },
        where: { department: { not: null } },
      }),
      prisma.user.groupBy({
        by: ['role'],
        _count: { role: true },
        where: { isActive: true },
      }),
    ]);

    res.status(200).json({
      message: 'Team statistics retrieved successfully',
      data: {
        totalMembers,
        activeMembers,
        inactiveMembers: totalMembers - activeMembers,
        departmentBreakdown: departmentStats.map(dept => ({
          department: dept.department,
          count: dept._count.department,
        })),
        roleBreakdown: roleStats.map(role => ({
          role: role.role,
          count: role._count.role,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching team statistics:', error);
    res.status(500).json({ error: 'Failed to fetch team statistics' });
  }
};

// Get team members by department
export const getTeamMembersByDepartment = async (req: Request, res: Response) => {
  try {
    const { department } = req.params;

    const users = await prisma.user.findMany({
      where: {
        isActive: true,
        staffProfile: {
          department: { contains: department, mode: 'insensitive' },
        },
      },
      include: {
        staffProfile: true,
      },
      orderBy: {
        firstName: 'asc',
      },
    });

    res.status(200).json({
      message: 'Team members by department retrieved successfully',
      data: users,
    });
  } catch (error) {
    console.error('Error fetching team members by department:', error);
    res.status(500).json({ error: 'Failed to fetch team members by department' });
  }
};