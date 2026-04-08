import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddCustomerFields1733935000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add type column
    await queryRunner.addColumn(
      'customers',
      new TableColumn({
        name: 'type',
        type: 'varchar',
        length: '20',
        isNullable: true,
        default: "'individual'",
      }),
    );

    // Add business_name column
    await queryRunner.addColumn(
      'customers',
      new TableColumn({
        name: 'business_name',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    );

    // Add tax_id column
    await queryRunner.addColumn(
      'customers',
      new TableColumn({
        name: 'tax_id',
        type: 'varchar',
        length: '50',
        isNullable: true,
      }),
    );

    // Add preferred_contact_method column
    await queryRunner.addColumn(
      'customers',
      new TableColumn({
        name: 'preferred_contact_method',
        type: 'varchar',
        length: '20',
        isNullable: true,
      }),
    );

    // Add language_preference column
    await queryRunner.addColumn(
      'customers',
      new TableColumn({
        name: 'language_preference',
        type: 'varchar',
        length: '100',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('customers', 'language_preference');
    await queryRunner.dropColumn('customers', 'preferred_contact_method');
    await queryRunner.dropColumn('customers', 'tax_id');
    await queryRunner.dropColumn('customers', 'business_name');
    await queryRunner.dropColumn('customers', 'type');
  }
}
