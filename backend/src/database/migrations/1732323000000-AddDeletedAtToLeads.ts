import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddDeletedAtToLeads1732323000000 implements MigrationInterface {
    name = 'AddDeletedAtToLeads1732323000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add deleted_at column to leads table
        await queryRunner.addColumn('leads', new TableColumn({
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
            default: null,
        }));

        // Add index for performance (filtering deleted records)
        await queryRunner.query(`
            CREATE INDEX "idx_leads_deleted_at" ON "leads" ("deleted_at")
        `);

        console.log('✅ Added deleted_at column to leads table');
        console.log('✅ Created index idx_leads_deleted_at');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop index
        await queryRunner.query(`DROP INDEX "idx_leads_deleted_at"`);
        
        // Drop column
        await queryRunner.dropColumn('leads', 'deleted_at');

        console.log('✅ Rolled back: Removed deleted_at column from leads table');
    }
}
