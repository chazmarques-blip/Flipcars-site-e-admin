import { DataSource } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { Lead, LeadStatus, LeadPriority } from '../entities/lead.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { User } from '../entities/user.entity';

export async function seedCustomersAndLeads(dataSource: DataSource): Promise<void> {
  const customerRepository = dataSource.getRepository(Customer);
  const leadRepository = dataSource.getRepository(Lead);
  const vehicleRepository = dataSource.getRepository(Vehicle);
  const userRepository = dataSource.getRepository(User);

  // Check if already seeded
  const existingCustomers = await customerRepository.count();
  if (existingCustomers > 0) {
    console.log('   ⏭️  Customers and Leads already seeded, skipping...');
    return;
  }

  // Get agents for assignment
  const agents = await userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.roles', 'roles')
    .where('roles.name = :roleName', { roleName: 'agent' })
    .getMany();

  const agent1 = agents[0];
  const agent2 = agents[1];

  // Helper function to generate reference number
  const generateReferenceNumber = (index: number): string => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    return `FLIP-${dateStr}-${String(index).padStart(4, '0')}`;
  };

  // Define customers and their leads
  const customersData = [
    // HIGH PRIORITY LEADS (Score 71-100)
    {
      customer: {
        name: 'John Anderson',
        email: 'john.anderson@email.com',
        phone: '+1-555-1001',
        address: '123 Main St',
        city: 'Miami',
        state: 'FL',
        zipCode: '33101',
        preferredLanguage: 'en',
      },
      vehicle: {
        vin: 'JH4KA8170PC000001',
        make: 'Honda',
        model: 'Accord',
        year: '2022',
        color: 'Silver',
        mileage: 15000,
      },
      lead: {
        referenceNumber: generateReferenceNumber(1),
        name: 'John Anderson',
        phone: '+1-555-1001',
        email: 'john.anderson@email.com',
        preferredLanguage: 'en',
        hasInsurance: true,
        insuranceProvider: 'State Farm',
        claimNumber: 'SF2024-12345',
        accidentDescription: 'Rear-ended at traffic light, moderate damage to rear bumper and trunk',
        accidentDate: new Date('2024-10-15'),
        isDrivable: false,
        needsTow: true,
        needsRental: true,
        aiQualificationScore: 95,
        status: LeadStatus.QUALIFIED_AI,
        priority: LeadPriority.HIGH,
        estimatedValue: 4500,
        assignedHumanAgent: agent1,
      },
    },
    {
      customer: {
        name: 'Sarah Williams',
        email: 'sarah.williams@email.com',
        phone: '+1-555-1002',
        address: '456 Oak Ave',
        city: 'Fort Lauderdale',
        state: 'FL',
        zipCode: '33301',
        preferredLanguage: 'en',
      },
      vehicle: {
        vin: 'JH4KA8170PC000002',
        make: 'Toyota',
        model: 'Camry',
        year: '2021',
        color: 'White',
        mileage: 22000,
      },
      lead: {
        referenceNumber: generateReferenceNumber(2),
        name: 'Sarah Williams',
        phone: '+1-555-1002',
        email: 'sarah.williams@email.com',
        preferredLanguage: 'en',
        hasInsurance: true,
        insuranceProvider: 'Geico',
        claimNumber: 'GEI-2024-67890',
        accidentDescription: 'Side collision, driver door and fender damage',
        accidentDate: new Date('2024-10-20'),
        isDrivable: true,
        needsTow: false,
        needsRental: true,
        aiQualificationScore: 88,
        status: LeadStatus.HUMAN_CONTACTED,
        priority: LeadPriority.HIGH,
        estimatedValue: 3800,
        assignedHumanAgent: agent1,
      },
    },
    {
      customer: {
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        phone: '+1-555-1003',
        address: '789 Pine Rd',
        city: 'West Palm Beach',
        state: 'FL',
        zipCode: '33401',
        preferredLanguage: 'en',
      },
      vehicle: {
        vin: 'JH4KA8170PC000003',
        make: 'Ford',
        model: 'F-150',
        year: '2023',
        color: 'Blue',
        mileage: 8000,
      },
      lead: {
        referenceNumber: generateReferenceNumber(3),
        name: 'Michael Chen',
        phone: '+1-555-1003',
        email: 'michael.chen@email.com',
        preferredLanguage: 'en',
        hasInsurance: true,
        insuranceProvider: 'Progressive',
        claimNumber: 'PRG-2024-11111',
        accidentDescription: 'Front collision, hood and grille damage',
        accidentDate: new Date('2024-10-22'),
        isDrivable: false,
        needsTow: true,
        needsRental: true,
        aiQualificationScore: 92,
        status: LeadStatus.ESTIMATE_SENT,
        priority: LeadPriority.HIGH,
        estimatedValue: 5200,
        assignedHumanAgent: agent2,
      },
    },
    {
      customer: {
        name: 'Maria Rodriguez',
        email: 'maria.rodriguez@email.com',
        phone: '+1-555-1004',
        address: '321 Sunset Blvd',
        city: 'Miami',
        state: 'FL',
        zipCode: '33125',
        preferredLanguage: 'es',
      },
      vehicle: {
        vin: 'JH4KA8170PC000004',
        make: 'Nissan',
        model: 'Altima',
        year: '2020',
        color: 'Red',
        mileage: 35000,
      },
      lead: {
        referenceNumber: generateReferenceNumber(4),
        name: 'Maria Rodriguez',
        phone: '+1-555-1004',
        email: 'maria.rodriguez@email.com',
        preferredLanguage: 'es',
        hasInsurance: true,
        insuranceProvider: 'Allstate',
        claimNumber: 'ALL-2024-22222',
        accidentDescription: 'Puerta trasera golpeada en estacionamiento',
        accidentDate: new Date('2024-10-25'),
        isDrivable: true,
        needsTow: false,
        needsRental: true,
        aiQualificationScore: 85,
        status: LeadStatus.QUALIFIED_AI,
        priority: LeadPriority.HIGH,
        estimatedValue: 2900,
        assignedHumanAgent: agent2,
      },
    },
    {
      customer: {
        name: 'David Thompson',
        email: 'david.thompson@email.com',
        phone: '+1-555-1005',
        address: '654 Beach Dr',
        city: 'Hollywood',
        state: 'FL',
        zipCode: '33019',
        preferredLanguage: 'en',
      },
      vehicle: {
        vin: 'JH4KA8170PC000005',
        make: 'Chevrolet',
        model: 'Silverado',
        year: '2022',
        color: 'Black',
        mileage: 18000,
      },
      lead: {
        referenceNumber: generateReferenceNumber(5),
        name: 'David Thompson',
        phone: '+1-555-1005',
        email: 'david.thompson@email.com',
        preferredLanguage: 'en',
        hasInsurance: true,
        insuranceProvider: 'Liberty Mutual',
        claimNumber: 'LIB-2024-33333',
        accidentDescription: 'Multiple panel damage from parking lot incident',
        accidentDate: new Date('2024-10-26'),
        isDrivable: true,
        needsTow: false,
        needsRental: true,
        aiQualificationScore: 78,
        status: LeadStatus.NEW,
        priority: LeadPriority.HIGH,
        estimatedValue: 4100,
      },
    },

    // MEDIUM PRIORITY LEADS (Score 41-70)
    {
      customer: {
        name: 'Jennifer Martinez',
        email: 'jennifer.martinez@email.com',
        phone: '+1-555-2001',
        address: '111 Maple St',
        city: 'Miami',
        state: 'FL',
        zipCode: '33130',
        preferredLanguage: 'en',
      },
      vehicle: {
        vin: 'JH4KA8170PC000006',
        make: 'Hyundai',
        model: 'Elantra',
        year: '2021',
        color: 'Gray',
        mileage: 28000,
      },
      lead: {
        referenceNumber: generateReferenceNumber(6),
        name: 'Jennifer Martinez',
        phone: '+1-555-2001',
        email: 'jennifer.martinez@email.com',
        preferredLanguage: 'en',
        hasInsurance: true,
        insuranceProvider: 'State Farm',
        claimNumber: 'SF2024-44444',
        accidentDescription: 'Minor fender bender, front bumper scuff',
        accidentDate: new Date('2024-10-23'),
        isDrivable: true,
        needsTow: false,
        needsRental: false,
        aiQualificationScore: 65,
        status: LeadStatus.QUALIFIED_AI,
        priority: LeadPriority.MEDIUM,
        estimatedValue: 1200,
        assignedHumanAgent: agent1,
      },
    },
    {
      customer: {
        name: 'Robert Johnson',
        email: 'robert.johnson@email.com',
        phone: '+1-555-2002',
        address: '222 Elm St',
        city: 'Coral Springs',
        state: 'FL',
        zipCode: '33065',
        preferredLanguage: 'en',
      },
      vehicle: {
        vin: 'JH4KA8170PC000007',
        make: 'Mazda',
        model: 'CX-5',
        year: '2020',
        color: 'Blue',
        mileage: 42000,
      },
      lead: {
        referenceNumber: generateReferenceNumber(7),
        name: 'Robert Johnson',
        phone: '+1-555-2002',
        email: 'robert.johnson@email.com',
        preferredLanguage: 'en',
        hasInsurance: true,
        insuranceProvider: 'Farmers',
        accidentDescription: 'Door ding and scratch from shopping cart',
        accidentDate: new Date('2024-10-24'),
        isDrivable: true,
        needsTow: false,
        needsRental: false,
        aiQualificationScore: 58,
        status: LeadStatus.NEW,
        priority: LeadPriority.MEDIUM,
        estimatedValue: 800,
      },
    },
    {
      customer: {
        name: 'Lisa Brown',
        email: 'lisa.brown@email.com',
        phone: '+1-555-2003',
        address: '333 Cedar Ave',
        city: 'Pembroke Pines',
        state: 'FL',
        zipCode: '33024',
        preferredLanguage: 'en',
      },
      vehicle: {
        vin: 'JH4KA8170PC000008',
        make: 'Volkswagen',
        model: 'Jetta',
        year: '2019',
        color: 'White',
        mileage: 55000,
      },
      lead: {
        referenceNumber: generateReferenceNumber(8),
        name: 'Lisa Brown',
        phone: '+1-555-2003',
        email: 'lisa.brown@email.com',
        preferredLanguage: 'en',
        hasInsurance: false,
        accidentDescription: 'Rear bumper damage, minor dent',
        accidentDate: new Date('2024-10-21'),
        isDrivable: true,
        needsTow: false,
        needsRental: false,
        aiQualificationScore: 42,
        status: LeadStatus.NEW,
        priority: LeadPriority.MEDIUM,
        estimatedValue: 950,
      },
    },
    {
      customer: {
        name: 'Carlos Silva',
        email: 'carlos.silva@email.com',
        phone: '+1-555-2004',
        address: '444 Palm Dr',
        city: 'Hialeah',
        state: 'FL',
        zipCode: '33010',
        preferredLanguage: 'es',
      },
      vehicle: {
        vin: 'JH4KA8170PC000009',
        make: 'Kia',
        model: 'Sportage',
        year: '2021',
        color: 'Silver',
        mileage: 25000,
      },
      lead: {
        referenceNumber: generateReferenceNumber(9),
        name: 'Carlos Silva',
        phone: '+1-555-2004',
        email: 'carlos.silva@email.com',
        preferredLanguage: 'es',
        hasInsurance: true,
        insuranceProvider: 'Geico',
        accidentDescription: 'Espejo retrovisor roto',
        accidentDate: new Date('2024-10-26'),
        isDrivable: true,
        needsTow: false,
        needsRental: false,
        aiQualificationScore: 52,
        status: LeadStatus.NEW,
        priority: LeadPriority.MEDIUM,
        estimatedValue: 450,
      },
    },
    {
      customer: {
        name: 'Emily Davis',
        email: 'emily.davis@email.com',
        phone: '+1-555-2005',
        address: '555 Ocean Blvd',
        city: 'Boca Raton',
        state: 'FL',
        zipCode: '33431',
        preferredLanguage: 'en',
      },
      vehicle: {
        vin: 'JH4KA8170PC000010',
        make: 'Subaru',
        model: 'Outback',
        year: '2022',
        color: 'Green',
        mileage: 12000,
      },
      lead: {
        referenceNumber: generateReferenceNumber(10),
        name: 'Emily Davis',
        phone: '+1-555-2005',
        email: 'emily.davis@email.com',
        preferredLanguage: 'en',
        hasInsurance: true,
        insuranceProvider: 'USAA',
        accidentDescription: 'Scratches on passenger side from tight parking',
        accidentDate: new Date('2024-10-27'),
        isDrivable: true,
        needsTow: false,
        needsRental: false,
        aiQualificationScore: 68,
        status: LeadStatus.NEW,
        priority: LeadPriority.MEDIUM,
        estimatedValue: 1500,
      },
    },

    // LOW PRIORITY LEADS (Score 0-40)
    {
      customer: {
        name: 'Thomas Wilson',
        email: 'thomas.wilson@email.com',
        phone: '+1-555-3001',
        address: '666 Lake Rd',
        city: 'Delray Beach',
        state: 'FL',
        zipCode: '33444',
        preferredLanguage: 'en',
      },
      vehicle: {
        vin: 'JH4KA8170PC000011',
        make: 'Honda',
        model: 'Civic',
        year: '2018',
        color: 'Black',
        mileage: 68000,
      },
      lead: {
        referenceNumber: generateReferenceNumber(11),
        name: 'Thomas Wilson',
        phone: '+1-555-3001',
        email: 'thomas.wilson@email.com',
        preferredLanguage: 'en',
        hasInsurance: false,
        accidentDescription: 'Small dent on hood, looking for estimate',
        accidentDate: new Date('2024-09-15'),
        isDrivable: true,
        needsTow: false,
        needsRental: false,
        aiQualificationScore: 28,
        status: LeadStatus.NEW,
        priority: LeadPriority.LOW,
        estimatedValue: 350,
      },
    },
    {
      customer: {
        name: 'Patricia Moore',
        email: 'patricia.moore@email.com',
        phone: '+1-555-3002',
        address: '777 River St',
        city: 'Boynton Beach',
        state: 'FL',
        zipCode: '33435',
        preferredLanguage: 'en',
      },
      vehicle: {
        vin: 'JH4KA8170PC000012',
        make: 'Toyota',
        model: 'Corolla',
        year: '2017',
        color: 'Red',
        mileage: 75000,
      },
      lead: {
        referenceNumber: generateReferenceNumber(12),
        name: 'Patricia Moore',
        phone: '+1-555-3002',
        email: 'patricia.moore@email.com',
        preferredLanguage: 'en',
        hasInsurance: false,
        accidentDescription: 'Light scratch on door, might not repair',
        accidentDate: new Date('2024-10-10'),
        isDrivable: true,
        needsTow: false,
        needsRental: false,
        aiQualificationScore: 18,
        status: LeadStatus.NEW,
        priority: LeadPriority.LOW,
        estimatedValue: 200,
      },
    },
    {
      customer: {
        name: 'James Taylor',
        email: 'james.taylor@email.com',
        phone: '+1-555-3003',
        address: '888 Valley Ave',
        city: 'Deerfield Beach',
        state: 'FL',
        zipCode: '33441',
        preferredLanguage: 'en',
      },
      vehicle: {
        vin: 'JH4KA8170PC000013',
        make: 'Ford',
        model: 'Focus',
        year: '2016',
        color: 'Gray',
        mileage: 95000,
      },
      lead: {
        referenceNumber: generateReferenceNumber(13),
        name: 'James Taylor',
        phone: '+1-555-3003',
        email: 'james.taylor@email.com',
        preferredLanguage: 'en',
        hasInsurance: false,
        accidentDescription: 'Old damage, just checking prices',
        accidentDate: new Date('2024-08-01'),
        isDrivable: true,
        needsTow: false,
        needsRental: false,
        aiQualificationScore: 12,
        status: LeadStatus.NEW,
        priority: LeadPriority.LOW,
        estimatedValue: 150,
      },
    },
    {
      customer: {
        name: 'Nancy Anderson',
        email: 'nancy.anderson@email.com',
        phone: '+1-555-3004',
        address: '999 Hill Ct',
        city: 'Pompano Beach',
        state: 'FL',
        zipCode: '33060',
        preferredLanguage: 'en',
      },
      vehicle: {
        vin: 'JH4KA8170PC000014',
        make: 'Nissan',
        model: 'Sentra',
        year: '2015',
        color: 'Blue',
        mileage: 110000,
      },
      lead: {
        referenceNumber: generateReferenceNumber(14),
        name: 'Nancy Anderson',
        phone: '+1-555-3004',
        email: 'nancy.anderson@email.com',
        preferredLanguage: 'en',
        hasInsurance: false,
        accidentDescription: 'Minor rust spot and paint chip',
        accidentDate: new Date('2024-07-15'),
        isDrivable: true,
        needsTow: false,
        needsRental: false,
        aiQualificationScore: 22,
        status: LeadStatus.NEW,
        priority: LeadPriority.LOW,
        estimatedValue: 300,
      },
    },
    {
      customer: {
        name: 'Daniel White',
        email: 'daniel.white@email.com',
        phone: '+1-555-3005',
        address: '1010 Bay St',
        city: 'Sunrise',
        state: 'FL',
        zipCode: '33323',
        preferredLanguage: 'en',
      },
      vehicle: {
        vin: 'JH4KA8170PC000015',
        make: 'Chevrolet',
        model: 'Cruze',
        year: '2016',
        color: 'White',
        mileage: 88000,
      },
      lead: {
        referenceNumber: generateReferenceNumber(15),
        name: 'Daniel White',
        phone: '+1-555-3005',
        email: 'daniel.white@email.com',
        preferredLanguage: 'en',
        hasInsurance: false,
        accidentDescription: 'Thinking about touch-up paint',
        accidentDate: new Date('2024-09-20'),
        isDrivable: true,
        needsTow: false,
        needsRental: false,
        aiQualificationScore: 8,
        status: LeadStatus.NEW,
        priority: LeadPriority.LOW,
        estimatedValue: 100,
      },
    },
  ];

  let createdCustomers = 0;
  let createdVehicles = 0;
  let createdLeads = 0;

  for (const data of customersData) {
    // Create customer
    const customer = await customerRepository.save(data.customer);
    createdCustomers++;

    // Create vehicle
    const vehicle = await vehicleRepository.save({
      ...data.vehicle,
      customer: customer,
    });
    createdVehicles++;

    // Create lead
    const lead = await leadRepository.save({
      ...data.lead,
      customer: customer,
      vehicle: vehicle,
      vehicleYear: vehicle.year,
      vehicleMake: vehicle.make,
      vehicleModel: vehicle.model,
      vehicleColor: vehicle.color,
    });
    createdLeads++;
  }

  console.log(`   ✅ Created ${createdCustomers} customers`);
  console.log(`   ✅ Created ${createdVehicles} vehicles`);
  console.log(`   ✅ Created ${createdLeads} leads`);
  console.log(`      • ${customersData.filter(d => d.lead.priority === LeadPriority.HIGH).length} HIGH priority`);
  console.log(`      • ${customersData.filter(d => d.lead.priority === LeadPriority.MEDIUM).length} MEDIUM priority`);
  console.log(`      • ${customersData.filter(d => d.lead.priority === LeadPriority.LOW).length} LOW priority`);
}
