import { Router } from 'express';
import { register, login, getProfile } from '../controllers/auth.controller';
import passport from 'passport';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', passport.authenticate('jwt', { session: false }), getProfile);

export default router; 