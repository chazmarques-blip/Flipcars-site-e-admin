import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateInventoryVehiclesTable1735207200000 implements MigrationInterface {
  name = 'CreateInventoryVehiclesTable1735207200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum types
    await queryRunner.query(`
      CREATE TYPE "inventory_vehicle_status_enum" AS ENUM (
        'In Stock',
        'Sold',
        'Pending',
        'Reserved'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE "inventory_vehicle_acquisition_type_enum" AS ENUM (
        'Purchase',
        'Trade-in',
        'Auction',
        'Consignment'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE "inventory_vehicle_fuel_type_enum" AS ENUM (
        'Gasoline',
        'Diesel',
        'Electric',
        'Hybrid',
        'Plug-in Hybrid'
      );
    `);

    // Create table
    await queryRunner.createTable(
      new Table({
        name: 'inventory_vehicles',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'vin',
            type: 'varchar',
            length: '20',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'make',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'model',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'year',
            type: 'varchar',
            length: '10',
            isNullable: false,
          },
          {
            name: 'exterior_color',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'interior_color',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'mileage',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'fuel_type',
            type: 'inventory_vehicle_fuel_type_enum',
            default: "'Gasoline'",
            isNullable: false,
          },
          {
            name: 'suggested_sale_price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'commission',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'bonus',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'acquisition_type',
            type: 'inventory_vehicle_acquisition_type_enum',
            default: "'Purchase'",
            isNullable: false,
          },
          {
            name: 'status',
            type: 'inventory_vehicle_status_enum',
            default: "'In Stock'",
            isNullable: false,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'images',
            type: 'json',
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

    // Create indexes
    await queryRunner.createIndex(
      'inventory_vehicles',
      new TableIndex({
        name: 'idx_inventory_vehicle_vin',
        columnNames: ['vin'],
      }),
    );

    await queryRunner.createIndex(
      'inventory_vehicles',
      new TableIndex({
        name: 'idx_inventory_vehicle_status',
        columnNames: ['status'],
      }),
    );

    // Insert sample data based on your screenshots
    await queryRunner.query(`
      INSERT INTO inventory_vehicles (
        vin, make, model, year, exterior_color, interior_color,
        mileage, fuel_type, suggested_sale_price, commission, bonus,
        acquisition_type, status
      ) VALUES
      (
        '1G1ZD5ST4SF116584',
        'CHEVROLET',
        'Malibu',
        '2025',
        'GOLD',
        'GRAY',
        34000,
        'Gasoline',
        22900,
        1000,
        0,
        'Purchase',
        'In Stock'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('inventory_vehicles');
    await queryRunner.query(`DROP TYPE "inventory_vehicle_status_enum";`);
    await queryRunner.query(`DROP TYPE "inventory_vehicle_acquisition_type_enum";`);
    await queryRunner.query(`DROP TYPE "inventory_vehicle_fuel_type_enum";`);
  }
}
