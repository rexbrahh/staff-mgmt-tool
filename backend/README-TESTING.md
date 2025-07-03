# Database Testing Guide

## Overview
This project includes comprehensive database tests to verify Supabase connection and Prisma ORM functionality.

## Test Files
- `src/tests/connection.test.ts` - Basic database connection tests
- `src/tests/database.test.ts` - Full CRUD operation tests
- `src/tests/setup.ts` - Test environment configuration

## Environment Setup

### 1. Configure Test Database
Copy `.env.test` and update with your test database credentials:
```bash
cp .env.test .env.test.local
```

Update `.env.test.local` with your Supabase test database URL:
```env
DATABASE_URL="postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres"
```

### 2. Run Database Migration
Before running tests, ensure your test database schema is up to date:
```bash
# Generate Prisma client
npx prisma generate

# Run migrations on test database
DATABASE_URL="your-test-database-url" npx prisma migrate deploy
```

## Running Tests

### Quick Connection Test
Test basic database connectivity:
```bash
npm run test:db
```

### Full Database Test Suite
Test all CRUD operations and schema validation:
```bash
npm run test:db-full
```

### All Tests
Run the complete test suite:
```bash
npm test
```

### Watch Mode
Run tests in watch mode for development:
```bash
npm run test:watch
```

## Test Coverage

### Connection Tests
- Database connectivity
- PostgreSQL version verification
- Schema synchronization

### CRUD Tests
- User creation with password hashing
- User retrieval by email and ID
- User updates and modifications
- Password verification
- User deletion
- Role-based queries

### Schema Validation
- Unique constraints (email)
- Default values
- Timestamps
- Data types

## Test Database Best Practices

1. **Use Separate Test Database**: Never run tests against production data
2. **Clean Up**: Tests automatically clean up test data after completion
3. **Isolation**: Each test is independent and doesn't rely on others
4. **Performance**: Tests use optimized queries and minimal data

## Troubleshooting

### Connection Issues
- Verify DATABASE_URL in `.env.test`
- Check Supabase project status
- Ensure database allows connections from your IP

### Schema Issues
- Run `npx prisma migrate deploy` with test DATABASE_URL
- Verify schema.prisma matches database structure
- Check for pending migrations

### Permission Issues
- Ensure database user has CREATE/DROP permissions for test operations
- Verify Supabase RLS policies allow test operations

## CI/CD Integration
These tests can be integrated into your CI/CD pipeline:
```yaml
# Example GitHub Actions step
- name: Run Database Tests
  run: |
    npm run test:db
  env:
    DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
```