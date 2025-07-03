import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

// Define a type for our user structure
interface UserInfo {
  id: string;
  role: string;
}

// Middleware to check if user is authenticated
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = user;
    next();
  })(req, res, next);
};

// Middleware to check user role
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Use type assertion to ensure TypeScript recognizes the user structure
    const userInfo = req.user as UserInfo;
    
    if (!roles.includes(userInfo.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}; 