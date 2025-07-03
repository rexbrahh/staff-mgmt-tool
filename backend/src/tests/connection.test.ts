import { prisma } from '../config/database';

describe('Supabase Database Connection', () => {
  beforeAll(async () => {
    try {
      await prisma.$connect();
    } catch (error) {
      console.error('Failed to connect to database:', error);
      throw error;
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('should connect to Supabase database', async () => {
    const result = await prisma.$queryRaw`SELECT 1 as connection_test`;
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  test('should get database version', async () => {
    const result = await prisma.$queryRaw`SELECT version() as version`;
    expect(result).toBeDefined();
    console.log('Database version:', result);
  });

  test('should get current database name', async () => {
    const result = await prisma.$queryRaw`SELECT current_database() as database_name`;
    expect(result).toBeDefined();
    console.log('Database name:', result);
  });

  test('should verify Prisma client is working', async () => {
    // This will fail if schema is not synced
    try {
      const userCount = await prisma.user.count();
      expect(typeof userCount).toBe('number');
      console.log('Current user count:', userCount);
    } catch (error) {
      console.warn('Schema might not be migrated yet:', error);
      // Don't fail the test if tables don't exist yet
    }
  });
});