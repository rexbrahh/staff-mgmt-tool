import request from 'supertest';
import express from 'express';
import passport from 'passport';
import { prisma } from '../config/database';
import '../config/passport';
import taskRoutes from '../routes/task.routes';
import authRoutes from '../routes/auth.routes';
import { Role, TaskStatus, Priority } from '@prisma/client';

// Create test app
const app = express();
app.use(express.json());
app.use(passport.initialize());
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

describe('Task API', () => {
  let adminToken: string;
  let managerToken: string;
  let employeeToken: string;
  let adminUser: any;
  let managerUser: any;
  let employeeUser: any;
  let testProject: any;
  let testTask: any;

  beforeAll(async () => {
    // Clean up existing test data
    await prisma.task.deleteMany({
      where: {
        OR: [
          { title: { contains: 'Test Task' } },
          { title: { contains: 'Updated Task' } },
        ],
      },
    });
    
    await prisma.project.deleteMany({
      where: { name: { contains: 'Test Project' } },
    });
    
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['taskadmin@test.com', 'taskmanager@test.com', 'taskemployee@test.com'],
        },
      },
    });

    // Create test users
    const adminRegister = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'taskadmin@test.com',
        password: 'password123',
        firstName: 'Task',
        lastName: 'Admin',
        role: 'ADMIN',
      });

    const managerRegister = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'taskmanager@test.com',
        password: 'password123',
        firstName: 'Task',
        lastName: 'Manager',
        role: 'MANAGER',
      });

    const employeeRegister = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'taskemployee@test.com',
        password: 'password123',
        firstName: 'Task',
        lastName: 'Employee',
        role: 'EMPLOYEE',
      });

    adminToken = adminRegister.body.token;
    managerToken = managerRegister.body.token;
    employeeToken = employeeRegister.body.token;
    adminUser = adminRegister.body.user;
    managerUser = managerRegister.body.user;
    employeeUser = employeeRegister.body.user;

    // Create a test project
    testProject = await prisma.project.create({
      data: {
        name: 'Test Project for Tasks',
        description: 'A test project for task testing',
        startDate: new Date(),
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
      },
    });
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.task.deleteMany({
      where: {
        OR: [
          { title: { contains: 'Test Task' } },
          { title: { contains: 'Updated Task' } },
        ],
      },
    });
    
    await prisma.project.deleteMany({
      where: { name: { contains: 'Test Project' } },
    });
    
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['taskadmin@test.com', 'taskmanager@test.com', 'taskemployee@test.com'],
        },
      },
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a task as admin', async () => {
      const taskData = {
        title: 'Test Task Admin',
        description: 'A test task created by admin',
        status: TaskStatus.TODO,
        priority: Priority.HIGH,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        projectId: testProject.id,
        assignedToId: employeeUser.id,
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(taskData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Task created successfully');
      expect(response.body.data.title).toBe(taskData.title);
      expect(response.body.data.createdBy.id).toBe(adminUser.id);
      expect(response.body.data.assignedTo.id).toBe(employeeUser.id);

      testTask = response.body.data;
    });

    it('should create a task as manager', async () => {
      const taskData = {
        title: 'Test Task Manager',
        description: 'A test task created by manager',
        assignedToId: employeeUser.id,
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${managerToken}`)
        .send(taskData);

      expect(response.status).toBe(201);
      expect(response.body.data.createdBy.id).toBe(managerUser.id);
    });

    it('should not allow employee to create tasks', async () => {
      const taskData = {
        title: 'Test Task Employee',
        description: 'A test task created by employee',
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send(taskData);

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('Insufficient permissions');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Unauthorized Task' });

      expect(response.status).toBe(401);
    });

    it('should require title field', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ description: 'Task without title' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Title is required');
    });
  });

  describe('GET /api/tasks', () => {
    it('should get all tasks as admin', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Tasks retrieved successfully');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.pagination).toBeDefined();
    });

    it('should filter tasks by status', async () => {
      const response = await request(app)
        .get('/api/tasks?status=TODO')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      response.body.data.forEach((task: any) => {
        expect(task.status).toBe(TaskStatus.TODO);
      });
    });

    it('should paginate results', async () => {
      const response = await request(app)
        .get('/api/tasks?page=1&limit=1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeLessThanOrEqual(1);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(1);
    });

    it('should only show employee their own tasks', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(response.status).toBe(200);
      response.body.data.forEach((task: any) => {
        expect(
          task.assignedTo?.id === employeeUser.id || task.createdBy.id === employeeUser.id
        ).toBe(true);
      });
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should get a specific task as admin', async () => {
      const response = await request(app)
        .get(`/api/tasks/${testTask.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(testTask.id);
    });

    it('should allow employee to view their assigned task', async () => {
      const response = await request(app)
        .get(`/api/tasks/${testTask.id}`)
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(testTask.id);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .get('/api/tasks/non-existent-id')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update task as admin', async () => {
      const updates = {
        title: 'Updated Task Title',
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.URGENT,
      };

      const response = await request(app)
        .put(`/api/tasks/${testTask.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe(updates.title);
      expect(response.body.data.status).toBe(updates.status);
      expect(response.body.data.priority).toBe(updates.priority);
    });

    it('should allow employee to update their task status', async () => {
      const updates = {
        status: TaskStatus.REVIEW,
        description: 'Updated by employee',
      };

      const response = await request(app)
        .put(`/api/tasks/${testTask.id}`)
        .set('Authorization', `Bearer ${employeeToken}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe(updates.status);
    });

    it('should not allow employee to update restricted fields', async () => {
      const updates = {
        assignedToId: managerUser.id,
        priority: Priority.LOW,
      };

      const response = await request(app)
        .put(`/api/tasks/${testTask.id}`)
        .set('Authorization', `Bearer ${employeeToken}`)
        .send(updates);

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('Employees can only update');
    });

    it('should auto-set completedAt when marking task as DONE', async () => {
      const updates = { status: TaskStatus.DONE };

      const response = await request(app)
        .put(`/api/tasks/${testTask.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe(TaskStatus.DONE);
      expect(response.body.data.completedAt).toBeDefined();
    });
  });

  describe('GET /api/tasks/stats', () => {
    it('should get task statistics as admin', async () => {
      const response = await request(app)
        .get('/api/tasks/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('todo');
      expect(response.body.data).toHaveProperty('inProgress');
      expect(response.body.data).toHaveProperty('review');
      expect(response.body.data).toHaveProperty('done');
      expect(response.body.data).toHaveProperty('overdue');
    });

    it('should get user-specific stats as employee', async () => {
      const response = await request(app)
        .get('/api/tasks/stats')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(response.status).toBe(200);
      expect(typeof response.body.data.total).toBe('number');
    });
  });

  describe('GET /api/tasks/overdue', () => {
    it('should get overdue tasks', async () => {
      // Create an overdue task
      const overdueTask = await prisma.task.create({
        data: {
          title: 'Overdue Task',
          description: 'This task is overdue',
          status: TaskStatus.TODO,
          priority: Priority.HIGH,
          dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          createdById: adminUser.id,
          assignedToId: employeeUser.id,
        },
      });

      const response = await request(app)
        .get('/api/tasks/overdue')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      const overdueTaskInResponse = response.body.data.find(
        (task: any) => task.id === overdueTask.id
      );
      expect(overdueTaskInResponse).toBeDefined();

      // Clean up
      await prisma.task.delete({ where: { id: overdueTask.id } });
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete task as admin', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${testTask.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task deleted successfully');

      // Verify task is deleted
      const getResponse = await request(app)
        .get(`/api/tasks/${testTask.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(getResponse.status).toBe(404);
    });

    it('should not allow employee to delete tasks', async () => {
      // Create a task to attempt deletion
      const taskToDelete = await prisma.task.create({
        data: {
          title: 'Task to Delete',
          createdById: adminUser.id,
          assignedToId: employeeUser.id,
        },
      });

      const response = await request(app)
        .delete(`/api/tasks/${taskToDelete.id}`)
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(response.status).toBe(403);

      // Clean up
      await prisma.task.delete({ where: { id: taskToDelete.id } });
    });
  });
});