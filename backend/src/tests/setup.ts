// Test setup file to ensure environment variables are set correctly
// This file will be executed before running the tests

// Set JWT secret for testing
process.env.JWT_SECRET = 'test-jwt-secret';

// Set MongoDB URI for testing - use in-memory MongoDB for faster tests if available
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/staff-mgmt-test';

// Other environment variables for testing can be set here 