import { Request, Response } from 'express';
import { TaskService, CreateTaskData, UpdateTaskData, TaskFilters } from '../models/Task';
import { Role, TaskStatus, Priority } from '@prisma/client';

// Define a type for our authenticated user
interface AuthenticatedUser {
  id: string;
  role: Role;
}

// Get all tasks with filtering, pagination, and sorting
export const getTasks = async (req: Request, res: Response) => {
  try {
    const user = req.user as AuthenticatedUser;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Extract query parameters
    const {
      page = '1',
      limit = '10',
      status,
      priority,
      assignedToId,
      createdById,
      projectId,
      dueDateBefore,
      dueDateAfter,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filters
    const filters: TaskFilters = {};
    if (status) filters.status = status as TaskStatus;
    if (priority) filters.priority = priority as Priority;
    if (assignedToId) filters.assignedToId = assignedToId as string;
    if (createdById) filters.createdById = createdById as string;
    if (projectId) filters.projectId = projectId as string;
    if (dueDateBefore) filters.dueDateBefore = new Date(dueDateBefore as string);
    if (dueDateAfter) filters.dueDateAfter = new Date(dueDateAfter as string);

    // Role-based access control
    if (user.role === Role.EMPLOYEE) {
      // Employees can only see tasks assigned to them or created by them
      if (!filters.assignedToId && !filters.createdById) {
        filters.assignedToId = user.id;
      } else if (filters.assignedToId && filters.assignedToId !== user.id) {
        return res.status(403).json({ message: 'Forbidden: Can only view your own tasks' });
      }
    }

    const result = await TaskService.findTasks(
      filters,
      parseInt(page as string),
      parseInt(limit as string),
      sortBy as string,
      sortOrder as 'asc' | 'desc'
    );

    res.status(200).json({
      message: 'Tasks retrieved successfully',
      data: result.tasks,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: result.total,
        pages: result.pages,
      },
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
};

// Get a specific task by ID
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const user = req.user as AuthenticatedUser;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    const task = await TaskService.findTaskById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Role-based access control
    if (user.role === Role.EMPLOYEE) {
      if (task.assignedToId !== user.id && task.createdById !== user.id) {
        return res.status(403).json({ message: 'Forbidden: Can only view your own tasks' });
      }
    }

    res.status(200).json({
      message: 'Task retrieved successfully',
      data: task,
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Error fetching task', error });
  }
};

// Create a new task
export const createTask = async (req: Request, res: Response) => {
  try {
    const user = req.user as AuthenticatedUser;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Only ADMIN and MANAGER can create tasks
    if (user.role === Role.EMPLOYEE) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions to create tasks' });
    }

    const taskData: CreateTaskData = {
      ...req.body,
      createdById: user.id,
    };

    // Validate required fields
    if (!taskData.title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = await TaskService.createTask(taskData);

    res.status(201).json({
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Error creating task', error });
  }
};

// Update a task
export const updateTask = async (req: Request, res: Response) => {
  try {
    const user = req.user as AuthenticatedUser;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    const updates: UpdateTaskData = req.body;

    // Check if task exists and get current task
    const existingTask = await TaskService.findTaskById(id);
    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Role-based access control
    if (user.role === Role.EMPLOYEE) {
      // Employees can only update tasks assigned to them and only specific fields
      if (existingTask.assignedToId !== user.id) {
        return res.status(403).json({ message: 'Forbidden: Can only update your assigned tasks' });
      }
      
      // Limit what employees can update
      const allowedUpdates: (keyof UpdateTaskData)[] = ['status', 'description'];
      const updateKeys = Object.keys(updates) as (keyof UpdateTaskData)[];
      const invalidUpdates = updateKeys.filter(key => !allowedUpdates.includes(key));
      
      if (invalidUpdates.length > 0) {
        return res.status(403).json({ 
          message: `Forbidden: Employees can only update: ${allowedUpdates.join(', ')}` 
        });
      }
    } else if (user.role === Role.MANAGER) {
      // Managers can update all fields except assignment to other managers/admins
      if (updates.assignedToId) {
        // Additional validation for assignment can be added here
      }
    }
    // ADMIN can update everything

    const updatedTask = await TaskService.updateTask(id, updates);

    res.status(200).json({
      message: 'Task updated successfully',
      data: updatedTask,
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Error updating task', error });
  }
};

// Delete a task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const user = req.user as AuthenticatedUser;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Only ADMIN and MANAGER can delete tasks
    if (user.role === Role.EMPLOYEE) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions to delete tasks' });
    }

    const { id } = req.params;

    // Check if task exists
    const existingTask = await TaskService.findTaskById(id);
    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await TaskService.deleteTask(id);

    res.status(200).json({
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Error deleting task', error });
  }
};

// Get tasks by user (assigned to or created by)
export const getTasksByUser = async (req: Request, res: Response) => {
  try {
    const user = req.user as AuthenticatedUser;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { userId } = req.params;

    // Role-based access control
    if (user.role === Role.EMPLOYEE && userId !== user.id) {
      return res.status(403).json({ message: 'Forbidden: Can only view your own tasks' });
    }

    const tasks = await TaskService.getTasksByUser(userId);

    res.status(200).json({
      message: 'User tasks retrieved successfully',
      data: tasks,
    });
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    res.status(500).json({ message: 'Error fetching user tasks', error });
  }
};

// Get tasks by project
export const getTasksByProject = async (req: Request, res: Response) => {
  try {
    const user = req.user as AuthenticatedUser;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { projectId } = req.params;
    const tasks = await TaskService.getTasksByProject(projectId);

    // Filter tasks based on user role
    let filteredTasks = tasks;
    if (user.role === Role.EMPLOYEE) {
      filteredTasks = tasks.filter(
        task => task.assignedToId === user.id || task.createdById === user.id
      );
    }

    res.status(200).json({
      message: 'Project tasks retrieved successfully',
      data: filteredTasks,
    });
  } catch (error) {
    console.error('Error fetching project tasks:', error);
    res.status(500).json({ message: 'Error fetching project tasks', error });
  }
};

// Get overdue tasks
export const getOverdueTasks = async (req: Request, res: Response) => {
  try {
    const user = req.user as AuthenticatedUser;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const tasks = await TaskService.getOverdueTasks();

    // Filter tasks based on user role
    let filteredTasks = tasks;
    if (user.role === Role.EMPLOYEE) {
      filteredTasks = tasks.filter(
        task => task.assignedToId === user.id || task.createdById === user.id
      );
    }

    res.status(200).json({
      message: 'Overdue tasks retrieved successfully',
      data: filteredTasks,
    });
  } catch (error) {
    console.error('Error fetching overdue tasks:', error);
    res.status(500).json({ message: 'Error fetching overdue tasks', error });
  }
};

// Get task statistics
export const getTaskStats = async (req: Request, res: Response) => {
  try {
    const user = req.user as AuthenticatedUser;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { userId } = req.query;

    // Role-based access control
    let targetUserId: string | undefined;
    if (user.role === Role.EMPLOYEE) {
      // Employees can only see their own stats
      targetUserId = user.id;
    } else if (userId) {
      // Managers and admins can see specific user stats
      targetUserId = userId as string;
    }
    // If no userId specified and user is manager/admin, get global stats

    const stats = await TaskService.getTaskStats(targetUserId);

    res.status(200).json({
      message: 'Task statistics retrieved successfully',
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching task stats:', error);
    res.status(500).json({ message: 'Error fetching task stats', error });
  }
};