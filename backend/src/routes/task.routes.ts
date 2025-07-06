import { Router } from 'express';
import passport from 'passport';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByUser,
  getTasksByProject,
  getOverdueTasks,
  getTaskStats,
} from '../controllers/task.controller';

const router = Router();

// Middleware to require authentication for all task routes
const requireAuth = passport.authenticate('jwt', { session: false });

// Apply authentication middleware to all routes
router.use(requireAuth);

// Task CRUD routes
router.get('/', getTasks);                    // GET /api/tasks - Get all tasks with filters
router.post('/', createTask);                 // POST /api/tasks - Create new task
router.get('/stats', getTaskStats);           // GET /api/tasks/stats - Get task statistics
router.get('/overdue', getOverdueTasks);      // GET /api/tasks/overdue - Get overdue tasks
router.get('/user/:userId', getTasksByUser);  // GET /api/tasks/user/:userId - Get tasks by user
router.get('/project/:projectId', getTasksByProject); // GET /api/tasks/project/:projectId - Get tasks by project
router.get('/:id', getTaskById);              // GET /api/tasks/:id - Get specific task
router.put('/:id', updateTask);               // PUT /api/tasks/:id - Update task
router.delete('/:id', deleteTask);            // DELETE /api/tasks/:id - Delete task

export default router;