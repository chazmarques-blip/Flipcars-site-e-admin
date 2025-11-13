import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSchedulingFieldsToLeads1763059418320 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add preferred_date column (DATE type for date-only values)
        await queryRunner.query(`
            ALTER TABLE "leads" 
            ADD COLUMN IF NOT EXISTS "preferred_date" DATE NULL
        `);
        
        // Add preferred_time_slot column (VARCHAR for time slot strings like "morning", "afternoon", "09:00-10:00")
        await queryRunner.query(`
            ALTER TABLE "leads" 
            ADD COLUMN IF NOT EXISTS "preferred_time_slot" VARCHAR(50) NULL
        `);
        
        // Add comment for documentation
        await queryRunner.query(`
            COMMENT ON COLUMN "leads"."preferred_date" IS 'Customer preferred date for appointment (NULL = no appointment scheduled)'
        `);
        
        await queryRunner.query(`
            COMMENT ON COLUMN "leads"."preferred_time_slot" IS 'Customer preferred time slot (e.g., morning, afternoon, evening, or specific time range)'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove columns in reverse order
        await queryRunner.query(`
            ALTER TABLE "leads" 
            DROP COLUMN IF EXISTS "preferred_time_slot"
        `);
        
        await queryRunner.query(`
            ALTER TABLE "leads" 
            DROP COLUMN IF EXISTS "preferred_date"
        `);
    }
}
