import { Router } from 'express';
import passport from 'passport';
import {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getTeamStats,
  getTeamMembersByDepartment,
} from '../controllers/team.controller';

const router = Router();

// Middleware to require authentication for all team routes
const requireAuth = passport.authenticate('jwt', { session: false });

// Apply authentication middleware to all routes
router.use(requireAuth);

// Team CRUD routes
router.get('/', getTeamMembers);                           // GET /api/team - Get all team members with filters
router.post('/', createTeamMember);                        // POST /api/team - Create new team member
router.get('/stats', getTeamStats);                        // GET /api/team/stats - Get team statistics
router.get('/department/:department', getTeamMembersByDepartment); // GET /api/team/department/:department - Get team members by department
router.get('/:id', getTeamMemberById);                     // GET /api/team/:id - Get specific team member
router.put('/:id', updateTeamMember);                      // PUT /api/team/:id - Update team member
router.delete('/:id', deleteTeamMember);                   // DELETE /api/team/:id - Delete team member (soft delete)

export default router;