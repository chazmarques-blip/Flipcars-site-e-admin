import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateAppointmentsTable1731619200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create appointments table
    await queryRunner.createTable(
      new Table({
        name: 'appointments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'lead_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'appointment_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'appointment_time_slot',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'appointment_start_time',
            type: 'time',
            isNullable: true,
          },
          {
            name: 'appointment_end_time',
            type: 'time',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'scheduled'",
          },
          {
            name: 'contact_preferences',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'admin_notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'confirmed_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'confirmed_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Add foreign key to leads table
    await queryRunner.createForeignKey(
      'appointments',
      new TableForeignKey({
        columnNames: ['lead_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'leads',
        onDelete: 'CASCADE',
        name: 'FK_appointments_lead',
      }),
    );

    // Add foreign key to users table for confirmed_by
    await queryRunner.createForeignKey(
      'appointments',
      new TableForeignKey({
        columnNames: ['confirmed_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
        name: 'FK_appointments_confirmed_by',
      }),
    );

    // Add unique constraint for lead_id (one appointment per lead)
    await queryRunner.createIndex(
      'appointments',
      new TableIndex({
        name: 'UQ_appointments_lead',
        columnNames: ['lead_id'],
        isUnique: true,
      }),
    );

    // Add indexes for performance
    await queryRunner.createIndex(
      'appointments',
      new TableIndex({
        name: 'IDX_appointments_date',
        columnNames: ['appointment_date'],
      }),
    );

    await queryRunner.createIndex(
      'appointments',
      new TableIndex({
        name: 'IDX_appointments_status',
        columnNames: ['status'],
      }),
    );

    await queryRunner.createIndex(
      'appointments',
      new TableIndex({
        name: 'IDX_appointments_date_status',
        columnNames: ['appointment_date', 'status'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.dropIndex('appointments', 'IDX_appointments_date_status');
    await queryRunner.dropIndex('appointments', 'IDX_appointments_status');
    await queryRunner.dropIndex('appointments', 'IDX_appointments_date');
    await queryRunner.dropIndex('appointments', 'UQ_appointments_lead');

    // Drop foreign keys
    await queryRunner.dropForeignKey('appointments', 'FK_appointments_confirmed_by');
    await queryRunner.dropForeignKey('appointments', 'FK_appointments_lead');

    // Drop table
    await queryRunner.dropTable('appointments');
  }
}
