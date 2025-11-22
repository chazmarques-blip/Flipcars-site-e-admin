import { MigrationInterface, QueryRunner } from "typeorm";

export class EnsureLeadsTableAndAddSeeds1732233600000 implements MigrationInterface {
    name = 'EnsureLeadsTableAndAddSeeds1732233600000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if leads table exists
        const tableExists = await queryRunner.hasTable("leads");
        
        if (!tableExists) {
            throw new Error("Leads table does not exist! Run initial schema creation first.");
        }

        // Remove service_type column if it exists (from reverted commit)
        const hasServiceType = await queryRunner.hasColumn("leads", "service_type");
        if (hasServiceType) {
            console.log("🗑️  Removing service_type column from leads table...");
            await queryRunner.dropColumn("leads", "service_type");
        }

        // Count existing leads
        const result = await queryRunner.query("SELECT COUNT(*) as count FROM leads");
        const count = parseInt(result[0].count);
        
        console.log(`📊 Current leads count: ${count}`);

        // If no leads exist, add sample data
        if (count === 0) {
            console.log("📝 Adding sample leads...");
            
            await queryRunner.query(`
                INSERT INTO leads (
                    id, reference_number, name, phone, email, preferred_language,
                    vehicle_year, vehicle_make, vehicle_model, vehicle_color,
                    has_insurance, is_drivable, status, priority, source,
                    created_at, updated_at
                ) VALUES
                (
                    gen_random_uuid(),
                    'FLIP-20251122-0001',
                    'John Smith',
                    '+1234567890',
                    'john.smith@example.com',
                    'en',
                    '2020',
                    'Toyota',
                    'Camry',
                    'Blue',
                    true,
                    true,
                    'new',
                    'high',
                    'website',
                    NOW(),
                    NOW()
                ),
                (
                    gen_random_uuid(),
                    'FLIP-20251122-0002',
                    'Maria Garcia',
                    '+1987654321',
                    'maria.garcia@example.com',
                    'en',
                    '2019',
                    'Honda',
                    'Civic',
                    'Red',
                    false,
                    true,
                    'new',
                    'medium',
                    'referral',
                    NOW(),
                    NOW()
                ),
                (
                    gen_random_uuid(),
                    'FLIP-20251122-0003',
                    'Robert Johnson',
                    '+1555555555',
                    'robert.j@example.com',
                    'en',
                    '2021',
                    'Ford',
                    'F-150',
                    'Black',
                    true,
                    false,
                    'qualified_ai',
                    'high',
                    'website',
                    NOW(),
                    NOW()
                )
            `);
            
            console.log("✅ Sample leads added successfully");
        } else {
            console.log("✅ Leads already exist, skipping seed data");
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove sample leads added by this migration
        await queryRunner.query(`
            DELETE FROM leads 
            WHERE reference_number IN (
                'FLIP-20251122-0001',
                'FLIP-20251122-0002',
                'FLIP-20251122-0003'
            )
        `);
    }
}
