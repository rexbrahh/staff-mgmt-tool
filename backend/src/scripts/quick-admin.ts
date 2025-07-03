import { UserService } from '../models/User';
import { StaffProfileService } from '../models/StaffProfile';
import { Role } from '@prisma/client';
import { prisma } from '../config/database';

async function createQuickAdmin() {
  try {
    // Default admin credentials - change these!
    const adminData = {
      email: 'admin@staffmanagement.com',
      password: 'admin123456',
      firstName: 'System',
      lastName: 'Administrator'
    };

    console.log('🔐 Creating default admin user...\n');

    // Check if admin already exists
    const existingUser = await UserService.findUserByEmail(adminData.email);
    if (existingUser) {
      console.log('❌ Admin user already exists!');
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Role: ${existingUser.role}`);
      console.log('\n💡 Use the existing credentials or run npm run create-admin for a new one');
      return;
    }

    // Create admin user
    const adminUser = await UserService.createUser({
      ...adminData,
      role: Role.ADMIN
    });

    // Create staff profile
    await StaffProfileService.createStaffProfile({
      userId: adminUser.id,
      department: 'Administration',
      position: 'System Administrator',
      hireDate: new Date()
    });

    console.log('✅ Default admin user created successfully!\n');
    console.log('🔑 LOGIN CREDENTIALS:');
    console.log(`   Email: ${adminData.email}`);
    console.log(`   Password: ${adminData.password}`);
    console.log('\n⚠️  IMPORTANT: Change these credentials after first login!');
    console.log('   You can update them in the admin panel or create a new admin user.\n');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Handle script execution
if (require.main === module) {
  createQuickAdmin().catch(console.error);
}

export { createQuickAdmin };