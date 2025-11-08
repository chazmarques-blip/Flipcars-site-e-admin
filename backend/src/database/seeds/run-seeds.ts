import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../data-source';
import { seedRolesAndPermissions } from './01-roles-permissions.seed';
import { seedUsers } from './02-users.seed';
import { seedKnowledgeBase } from './03-knowledge-base.seed';
import { seedCustomersAndLeads } from './04-customers-leads.seed';
import { seedCMSPages } from './05-cms-pages.seed';
import { seedGallery } from './06-gallery.seed';

export async function runSeeds(existingDataSource?: DataSource) {
  console.log('🌱 Starting database seeding...\n');

  let dataSource = existingDataSource;
  let shouldCloseConnection = false;

  try {
    // If no existing data source, create and initialize one
    if (!dataSource) {
      dataSource = new DataSource(dataSourceOptions);
      await dataSource.initialize();
      shouldCloseConnection = true;
      console.log('✅ Database connection established\n');
    }

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
    throw error;
  } finally {
    if (shouldCloseConnection && dataSource) {
      await dataSource.destroy();
      console.log('\n✅ Database connection closed');
    }
  }
}

// Allow running as standalone script
if (require.main === module) {
  runSeeds()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
