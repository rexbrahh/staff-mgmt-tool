import { UserService } from '../models/User';
import { StaffProfileService } from '../models/StaffProfile';
import { Role } from '@prisma/client';
import { prisma } from '../config/database';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createAdminUser() {
  try {
    console.log('🔐 Creating Admin User\n');

    // Get admin details
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password: ');
    const firstName = await question('Enter first name: ');
    const lastName = await question('Enter last name: ');

    // Validate inputs
    if (!email || !password || !firstName || !lastName) {
      console.log('❌ All fields are required!');
      process.exit(1);
    }

    if (password.length < 6) {
      console.log('❌ Password must be at least 6 characters long!');
      process.exit(1);
    }

    // Check if admin already exists
    const existingUser = await UserService.findUserByEmail(email);
    if (existingUser) {
      console.log('❌ User with this email already exists!');
      process.exit(1);
    }

    // Create admin user
    console.log('\n⏳ Creating admin user...');
    const adminUser = await UserService.createUser({
      email,
      password,
      firstName,
      lastName,
      role: Role.ADMIN
    });

    // Create staff profile for admin
    console.log('⏳ Creating staff profile...');
    const staffProfile = await StaffProfileService.createStaffProfile({
      userId: adminUser.id,
      department: 'Administration',
      position: 'System Administrator',
      hireDate: new Date()
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('📋 Admin Details:');
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Name: ${adminUser.firstName} ${adminUser.lastName}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log(`   User ID: ${adminUser.id}`);
    console.log(`   Created: ${adminUser.createdAt}`);

    console.log('\n🔑 Login Credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: [hidden for security]`);

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

// Handle script execution
if (require.main === module) {
  createAdminUser().catch(console.error);
}

export { createAdminUser };