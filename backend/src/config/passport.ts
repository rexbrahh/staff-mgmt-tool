import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UserService } from '../models/User';
import { authConfig } from './auth.config';
import { Request, Response, NextFunction } from 'express';

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: authConfig.jwtSecret,
    },
    async (payload, done) => {
      try {
        const user = await UserService.findUserById(payload.id);
        if (!user) {
          return done(null, false);
        }
        return done(null, { id: user.id, role: user.role });
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Define a type for our user structure in passport
interface UserInfo {
  id: string;
  role: string;
}

// Middleware to check user role
export const checkRole = (roles: string[]) => {
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

export default passport; 