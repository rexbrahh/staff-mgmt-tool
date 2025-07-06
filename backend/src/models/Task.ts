import { prisma } from '../config/database';
import { Task, TaskStatus, Priority, Prisma } from '@prisma/client';

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  dueDate?: Date;
  projectId?: string;
  assignedToId?: string;
  createdById: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  dueDate?: Date;
  projectId?: string;
  assignedToId?: string;
  completedAt?: Date;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: Priority;
  assignedToId?: string;
  createdById?: string;
  projectId?: string;
  dueDateBefore?: Date;
  dueDateAfter?: Date;
}

export interface TaskWithRelations extends Task {
  assignedTo?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  project?: {
    id: string;
    name: string;
    status: string;
  } | null;
}

export class TaskService {
  static async createTask(taskData: CreateTaskData): Promise<any> {
    return await prisma.task.create({
      data: {
        ...taskData,
        status: taskData.status || TaskStatus.TODO,
        priority: taskData.priority || Priority.MEDIUM,
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
    });
  }

  static async findTaskById(id: string): Promise<any> {
    return await prisma.task.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
    });
  }

  static async findTasks(
    filters: TaskFilters = {},
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<{ tasks: any[]; total: number; pages: number }> {
    const where: Prisma.TaskWhereInput = {};

    // Apply filters
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.priority) {
      where.priority = filters.priority;
    }
    if (filters.assignedToId) {
      where.assignedToId = filters.assignedToId;
    }
    if (filters.createdById) {
      where.createdById = filters.createdById;
    }
    if (filters.projectId) {
      where.projectId = filters.projectId;
    }
    if (filters.dueDateBefore || filters.dueDateAfter) {
      where.dueDate = {};
      if (filters.dueDateBefore) {
        where.dueDate.lte = filters.dueDateBefore;
      }
      if (filters.dueDateAfter) {
        where.dueDate.gte = filters.dueDateAfter;
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count
    const total = await prisma.task.count({ where });

    // Get tasks with pagination
    const tasks = await prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
    });

    return {
      tasks,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  static async updateTask(id: string, taskData: UpdateTaskData): Promise<any> {
    // If task is being marked as DONE, set completedAt
    if (taskData.status === TaskStatus.DONE && !taskData.completedAt) {
      taskData.completedAt = new Date();
    }

    return await prisma.task.update({
      where: { id },
      data: taskData,
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
    });
  }

  static async deleteTask(id: string): Promise<Task> {
    return await prisma.task.delete({
      where: { id },
    });
  }

  static async getTasksByUser(userId: string): Promise<any[]> {
    return await prisma.task.findMany({
      where: {
        OR: [
          { assignedToId: userId },
          { createdById: userId },
        ],
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  static async getTasksByProject(projectId: string): Promise<any[]> {
    return await prisma.task.findMany({
      where: { projectId },
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  static async getOverdueTasks(): Promise<any[]> {
    return await prisma.task.findMany({
      where: {
        dueDate: {
          lt: new Date(),
        },
        status: {
          not: TaskStatus.DONE,
        },
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  static async getTaskStats(userId?: string): Promise<{
    total: number;
    todo: number;
    inProgress: number;
    review: number;
    done: number;
    overdue: number;
  }> {
    const whereClause = userId ? { assignedToId: userId } : {};
    
    const [total, todo, inProgress, review, done, overdue] = await Promise.all([
      prisma.task.count({ where: whereClause }),
      prisma.task.count({ where: { ...whereClause, status: TaskStatus.TODO } }),
      prisma.task.count({ where: { ...whereClause, status: TaskStatus.IN_PROGRESS } }),
      prisma.task.count({ where: { ...whereClause, status: TaskStatus.REVIEW } }),
      prisma.task.count({ where: { ...whereClause, status: TaskStatus.DONE } }),
      prisma.task.count({
        where: {
          ...whereClause,
          dueDate: { lt: new Date() },
          status: { not: TaskStatus.DONE },
        },
      }),
    ]);

    return {
      total,
      todo,
      inProgress,
      review,
      done,
      overdue,
    };
  }
} 