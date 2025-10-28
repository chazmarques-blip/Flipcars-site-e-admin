import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../data-source';
import { seedRolesAndPermissions } from './01-roles-permissions.seed';
import { seedUsers } from './02-users.seed';
import { seedKnowledgeBase } from './03-knowledge-base.seed';
import { seedCustomersAndLeads } from './04-customers-leads.seed';
import { seedCMSPages } from './05-cms-pages.seed';
import { seedGallery } from './06-gallery.seed';

async function runSeeds() {
  console.log('🌱 Starting database seeding...\n');

  const dataSource = new DataSource(dataSourceOptions);

  try {
    // Initialize connection
    await dataSource.initialize();
    console.log('✅ Database connection established\n');

    // Run seeds in order
    console.log('📋 Seeding Roles and Permissions...');
    await seedRolesAndPermissions(dataSource);
    console.log('✅ Roles and Permissions seeded\n');

    console.log('👤 Seeding Users...');
    await seedUsers(dataSource);
    console.log('✅ Users seeded\n');

    console.log('📚 Seeding Knowledge Base...');
    await seedKnowledgeBase(dataSource);
    console.log('✅ Knowledge Base seeded\n');

    console.log('🚗 Seeding Customers and Leads...');
    await seedCustomersAndLeads(dataSource);
    console.log('✅ Customers and Leads seeded\n');

    console.log('📄 Seeding CMS Pages...');
    await seedCMSPages(dataSource);
    console.log('✅ CMS Pages seeded\n');

    console.log('🖼️  Seeding Gallery Items...');
    await seedGallery(dataSource);
    console.log('✅ Gallery Items seeded\n');

    console.log('🎉 All seeds completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
    console.log('\n✅ Database connection closed');
  }
}

runSeeds();
