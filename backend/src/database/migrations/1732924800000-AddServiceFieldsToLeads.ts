import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

/**
 * Migration: Add Service Fields to Leads
 * 
 * SAFE MIGRATION - 100% BACKWARD COMPATIBLE
 * 
 * Purpose:
 * - Add fields to store service type (mechanic/bodyshop)
 * - Add warranty company information
 * - Add selected services (as JSON array)
 * - Add symptoms description
 * 
 * Safety guarantees:
 * - All columns are NULLABLE (optional)
 * - No changes to existing columns
 * - No data loss
 * - Backward compatible with existing data
 * - Easy rollback if needed
 * 
 * Impact:
 * - Zero downtime
 * - Existing leads continue to work
 * - New leads can use additional fields
 * - Calendar can display service information
 */
export class AddServiceFieldsToLeads1732924800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('[Migration] Adding service fields to leads table...');

    // Check if columns already exist before adding
    const table = await queryRunner.getTable('leads');
    
    if (!table) {
      console.error('[Migration] ERROR: leads table not found!');
      throw new Error('Leads table does not exist');
    }

    // Add service_type column (mechanic or bodyshop)
    const hasServiceType = table.columns.find(col => col.name === 'service_type');
    if (!hasServiceType) {
      await queryRunner.addColumn(
        'leads',
        new TableColumn({
          name: 'service_type',
          type: 'varchar',
          length: '20',
          isNullable: true,
          comment: 'Type of service requested: mechanic or bodyshop',
        })
      );
      console.log('[Migration] ✅ Added service_type column');
    } else {
      console.log('[Migration] ⏭️  service_type column already exists, skipping');
    }

    // Add warranty_company column
    const hasWarrantyCompany = table.columns.find(col => col.name === 'warranty_company');
    if (!hasWarrantyCompany) {
      await queryRunner.addColumn(
        'leads',
        new TableColumn({
          name: 'warranty_company',
          type: 'varchar',
          length: '100',
          isNullable: true,
          comment: 'Warranty or insurance company name (e.g., CARCHEX, Private Self-Pay)',
        })
      );
      console.log('[Migration] ✅ Added warranty_company column');
    } else {
      console.log('[Migration] ⏭️  warranty_company column already exists, skipping');
    }

    // Add selected_services column (JSON array)
    const hasSelectedServices = table.columns.find(col => col.name === 'selected_services');
    if (!hasSelectedServices) {
      await queryRunner.addColumn(
        'leads',
        new TableColumn({
          name: 'selected_services',
          type: 'jsonb',
          isNullable: true,
          comment: 'Array of selected service types (e.g., ["oil", "engine", "brakes"])',
        })
      );
      console.log('[Migration] ✅ Added selected_services column');
    } else {
      console.log('[Migration] ⏭️  selected_services column already exists, skipping');
    }

    // Add symptoms_description column
    const hasSymptomsDescription = table.columns.find(col => col.name === 'symptoms_description');
    if (!hasSymptomsDescription) {
      await queryRunner.addColumn(
        'leads',
        new TableColumn({
          name: 'symptoms_description',
          type: 'text',
          isNullable: true,
          comment: 'Description of vehicle symptoms or issues',
        })
      );
      console.log('[Migration] ✅ Added symptoms_description column');
    } else {
      console.log('[Migration] ⏭️  symptoms_description column already exists, skipping');
    }

    console.log('[Migration] ✅ Service fields migration completed successfully!');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('[Migration] Rolling back service fields from leads table...');

    const table = await queryRunner.getTable('leads');
    
    if (!table) {
      console.warn('[Migration] WARNING: leads table not found during rollback');
      return;
    }

    // Drop columns in reverse order (safe rollback)
    if (table.columns.find(col => col.name === 'symptoms_description')) {
      await queryRunner.dropColumn('leads', 'symptoms_description');
      console.log('[Migration] ✅ Dropped symptoms_description column');
    }

    if (table.columns.find(col => col.name === 'selected_services')) {
      await queryRunner.dropColumn('leads', 'selected_services');
      console.log('[Migration] ✅ Dropped selected_services column');
    }

    if (table.columns.find(col => col.name === 'warranty_company')) {
      await queryRunner.dropColumn('leads', 'warranty_company');
      console.log('[Migration] ✅ Dropped warranty_company column');
    }

    if (table.columns.find(col => col.name === 'service_type')) {
      await queryRunner.dropColumn('leads', 'service_type');
      console.log('[Migration] ✅ Dropped service_type column');
    }

    console.log('[Migration] ✅ Service fields rollback completed successfully!');
  }
}
