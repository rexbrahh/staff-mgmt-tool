import dotenv from 'dotenv';

dotenv.config();

export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiration: process.env.JWT_EXPIRATION || '24h',
  saltRounds: 10,
}; 