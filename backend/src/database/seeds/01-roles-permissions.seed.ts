import { DataSource } from 'typeorm';
import { Role, RoleName } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';

export async function seedRolesAndPermissions(dataSource: DataSource): Promise<void> {
  const roleRepository = dataSource.getRepository(Role);
  const permissionRepository = dataSource.getRepository(Permission);

  // Check if already seeded
  const existingRoles = await roleRepository.count();
  if (existingRoles > 0) {
    console.log('   ⏭️  Roles already seeded, skipping...');
    return;
  }

  // Define permissions
  const permissionsData = [
    // User Management
    { name: 'users.create', resource: 'users', action: 'create', description: 'Create new users' },
    { name: 'users.read', resource: 'users', action: 'read', description: 'View users' },
    { name: 'users.update', resource: 'users', action: 'update', description: 'Update users' },
    { name: 'users.delete', resource: 'users', action: 'delete', description: 'Delete users' },
    
    // Lead Management
    { name: 'leads.create', resource: 'leads', action: 'create', description: 'Create new leads' },
    { name: 'leads.read', resource: 'leads', action: 'read', description: 'View leads' },
    { name: 'leads.update', resource: 'leads', action: 'update', description: 'Update leads' },
    { name: 'leads.delete', resource: 'leads', action: 'delete', description: 'Delete leads' },
    { name: 'leads.assign', resource: 'leads', action: 'assign', description: 'Assign leads to agents' },
    
    // Customer Management
    { name: 'customers.create', resource: 'customers', action: 'create', description: 'Create customers' },
    { name: 'customers.read', resource: 'customers', action: 'read', description: 'View customers' },
    { name: 'customers.update', resource: 'customers', action: 'update', description: 'Update customers' },
    { name: 'customers.delete', resource: 'customers', action: 'delete', description: 'Delete customers' },
    
    // Claim Management
    { name: 'claims.create', resource: 'claims', action: 'create', description: 'Create claims' },
    { name: 'claims.read', resource: 'claims', action: 'read', description: 'View claims' },
    { name: 'claims.update', resource: 'claims', action: 'update', description: 'Update claims' },
    { name: 'claims.delete', resource: 'claims', action: 'delete', description: 'Delete claims' },
    
    // AI Management
    { name: 'ai.configure', resource: 'ai', action: 'configure', description: 'Configure AI settings' },
    { name: 'ai.feedback', resource: 'ai', action: 'feedback', description: 'Submit AI feedback' },
    { name: 'ai.knowledge-base', resource: 'ai', action: 'knowledge-base', description: 'Manage knowledge base' },
    
    // CMS Management
    { name: 'cms.create', resource: 'cms', action: 'create', description: 'Create CMS content' },
    { name: 'cms.read', resource: 'cms', action: 'read', description: 'View CMS content' },
    { name: 'cms.update', resource: 'cms', action: 'update', description: 'Update CMS content' },
    { name: 'cms.delete', resource: 'cms', action: 'delete', description: 'Delete CMS content' },
    { name: 'cms.publish', resource: 'cms', action: 'publish', description: 'Publish CMS content' },
  ];

  // Create permissions
  const permissions = await permissionRepository.save(permissionsData);
  console.log(`   ✅ Created ${permissions.length} permissions`);

  // Define roles with their permissions
  const rolesData = [
    {
      name: RoleName.SUPER_ADMIN,
      description: 'Super administrator with all permissions',
      permissions: permissions, // All permissions
    },
    {
      name: RoleName.ADMIN,
      description: 'Administrator with most permissions',
      permissions: permissions.filter(p => !p.name.includes('users.delete')), // All except user deletion
    },
    {
      name: RoleName.AGENT,
      description: 'Agent with lead and customer management',
      permissions: permissions.filter(p => 
        p.resource === 'leads' || 
        p.resource === 'customers' || 
        p.resource === 'claims' ||
        (p.resource === 'ai' && p.action === 'feedback')
      ),
    },
    {
      name: RoleName.CUSTOMER,
      description: 'Customer with view-only access to their data',
      permissions: permissions.filter(p => 
        p.action === 'read' && (p.resource === 'leads' || p.resource === 'claims')
      ),
    },
    {
      name: RoleName.READ_ONLY,
      description: 'Read-only access to all data',
      permissions: permissions.filter(p => p.action === 'read'),
    },
  ];

  // Create roles
  const roles = await roleRepository.save(rolesData as any);
  console.log(`   ✅ Created ${roles.length} roles`);
}
