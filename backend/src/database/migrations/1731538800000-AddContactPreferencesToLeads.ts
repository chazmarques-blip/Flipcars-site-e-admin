import { MigrationInterface, QueryRunner } from "typeorm";

export class AddContactPreferencesToLeads1731538800000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "leads" 
            ADD COLUMN "contact_preferences" jsonb NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "leads" 
            DROP COLUMN "contact_preferences"
        `);
    }

}
