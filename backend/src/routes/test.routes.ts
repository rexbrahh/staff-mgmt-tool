import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Define a simple interface for role middleware
interface UserInfo {
  _id: string;
  role: string;
}

// Middleware to check user role
const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: Function) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const userInfo = req.user as UserInfo;
    
    if (!roles.includes(userInfo.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

// Public route - accessible to all
router.get('/public', (req: Request, res: Response) => {
  res.json({ message: 'This is a public route' });
});

// Protected route - accessible to authenticated users
router.get('/protected', authenticate, (req: Request, res: Response) => {
  res.json({ message: 'This is a protected route' });
});

// Admin only route - accessible only to admins
router.get('/admin-only', authenticate, checkRole(['admin']), (req: Request, res: Response) => {
  res.json({ message: 'This is an admin only route' });
});

// Manager only route - accessible only to managers and admins
router.get('/manager-only', authenticate, checkRole(['admin', 'manager']), (req: Request, res: Response) => {
  res.json({ message: 'This is a manager only route' });
});

export default router; 