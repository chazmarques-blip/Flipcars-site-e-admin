import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserStatus } from '../entities/user.entity';
import { Role, RoleName } from '../entities/role.entity';

export async function seedUsers(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(User);
  const roleRepository = dataSource.getRepository(Role);

  // Check if already seeded
  const existingUsers = await userRepository.count();
  if (existingUsers > 0) {
    console.log('   ⏭️  Users already seeded, skipping...');
    return;
  }

  // Get roles
  const superAdminRole = await roleRepository.findOne({ where: { name: RoleName.SUPER_ADMIN } });
  const adminRole = await roleRepository.findOne({ where: { name: RoleName.ADMIN } });
  const agentRole = await roleRepository.findOne({ where: { name: RoleName.AGENT } });
  const customerRole = await roleRepository.findOne({ where: { name: RoleName.CUSTOMER } });
  const readOnlyRole = await roleRepository.findOne({ where: { name: RoleName.READ_ONLY } });

  // Hash password for all users (same password for easy testing)
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // Define users
  const usersData = [
    {
      name: 'Super Admin',
      email: 'superadmin@flipcars.us',
      password: hashedPassword,
      phone: '+1-555-0001',
      status: UserStatus.ACTIVE,
      language: 'en',
      emailVerified: true,
      roles: [superAdminRole!],
    },
    {
      name: 'Admin User',
      email: 'admin@flipcars.us',
      password: hashedPassword,
      phone: '+1-555-0002',
      status: UserStatus.ACTIVE,
      language: 'en',
      emailVerified: true,
      roles: [adminRole!],
    },
    {
      name: 'Agent Smith',
      email: 'agent@flipcars.us',
      password: hashedPassword,
      phone: '+1-555-0003',
      status: UserStatus.ACTIVE,
      language: 'en',
      emailVerified: true,
      roles: [agentRole!],
    },
    {
      name: 'Maria Garcia',
      email: 'maria.agent@flipcars.us',
      password: hashedPassword,
      phone: '+1-555-0004',
      status: UserStatus.ACTIVE,
      language: 'es',
      emailVerified: true,
      roles: [agentRole!],
    },
    {
      name: 'João Silva',
      email: 'joao.agent@flipcars.us',
      password: hashedPassword,
      phone: '+1-555-0005',
      status: UserStatus.ACTIVE,
      language: 'pt',
      emailVerified: true,
      roles: [agentRole!],
    },
    {
      name: 'Customer Test',
      email: 'customer@flipcars.us',
      password: hashedPassword,
      phone: '+1-555-0100',
      status: UserStatus.ACTIVE,
      language: 'en',
      emailVerified: true,
      roles: [customerRole!],
    },
    {
      name: 'Read Only User',
      email: 'readonly@flipcars.us',
      password: hashedPassword,
      phone: '+1-555-0200',
      status: UserStatus.ACTIVE,
      language: 'en',
      emailVerified: true,
      roles: [readOnlyRole!],
    },
  ];

  // Create users
  const users = await userRepository.save(usersData as any);
  console.log(`   ✅ Created ${users.length} users`);
  console.log('   📧 All users have password: Password123!');
}
