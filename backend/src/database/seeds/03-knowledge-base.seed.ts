import { DataSource } from 'typeorm';
import { AiKnowledgeBase, KnowledgeBaseCategory } from '../entities/ai-knowledge-base.entity';
import { User } from '../entities/user.entity';

export async function seedKnowledgeBase(dataSource: DataSource): Promise<void> {
  const kbRepository = dataSource.getRepository(AiKnowledgeBase);
  const userRepository = dataSource.getRepository(User);

  // Check if already seeded
  const existingKB = await kbRepository.count();
  if (existingKB > 0) {
    console.log('   ⏭️  Knowledge Base already seeded, skipping...');
    return;
  }

  // Get admin user as creator
  const adminUser = await userRepository.findOne({ where: { email: 'admin@flipcars.us' } });

  // Define knowledge base entries
  const kbData = [
    {
      title: 'What types of auto body repairs do you offer?',
      content: 'We offer comprehensive auto body repair services including collision repair, dent removal, paintless dent repair, paint and refinishing, bumper repair, frame straightening, and glass replacement. We work with all insurance companies and provide free estimates.',
      category: KnowledgeBaseCategory.FAQ,
      language: 'en',
      keywords: ['services', 'repairs', 'collision', 'dent', 'paint', 'insurance'],
      isActive: true,
      createdBy: adminUser,
    },
    {
      title: 'Do you work with insurance companies?',
      content: 'Yes, we work with all major insurance companies. We can handle the entire claims process for you, including direct billing to your insurance provider. We also provide detailed estimates and documentation required by insurance companies.',
      category: KnowledgeBaseCategory.FAQ,
      language: 'en',
      keywords: ['insurance', 'claims', 'billing', 'estimate'],
      isActive: true,
      createdBy: adminUser,
    },
    {
      title: 'How long does a typical repair take?',
      content: 'Repair time varies depending on the extent of damage. Minor repairs like small dents or scratches can take 1-3 days. More extensive collision repairs typically take 5-10 days. We provide a detailed timeline during the estimate process and keep you updated throughout.',
      category: KnowledgeBaseCategory.FAQ,
      language: 'en',
      keywords: ['time', 'duration', 'estimate', 'timeline', 'repair-time'],
      isActive: true,
      createdBy: adminUser,
    },
    {
      title: 'Do you provide rental cars?',
      content: 'Yes, we offer rental car services through our partnerships with major rental companies. We can arrange a rental vehicle for you while your car is being repaired. Many insurance policies cover rental costs - we can help verify your coverage.',
      category: KnowledgeBaseCategory.FAQ,
      language: 'en',
      keywords: ['rental', 'rental-car', 'loaner', 'transportation'],
      isActive: true,
      createdBy: adminUser,
    },
    {
      title: 'Auto Body Repair Process Overview',
      content: '1. Initial Assessment: We inspect the vehicle and document all damage. 2. Insurance Coordination: We contact your insurance and get approval. 3. Parts Ordering: We order OEM or quality aftermarket parts. 4. Repair Work: Our certified technicians perform repairs. 5. Quality Control: We inspect all work to ensure quality. 6. Final Detailing: Vehicle is cleaned and detailed. 7. Customer Pickup: We walk you through all repairs performed.',
      category: KnowledgeBaseCategory.PROCESS,
      language: 'en',
      keywords: ['process', 'workflow', 'steps', 'procedure'],
      isActive: true,
      createdBy: adminUser,
    },
    {
      title: 'Warranty Policy',
      content: 'We stand behind our work with a lifetime warranty on all repairs performed. This includes workmanship and paint. The warranty is transferable if you sell your vehicle. Parts are covered by manufacturer warranties (typically 1-3 years).',
      category: KnowledgeBaseCategory.POLICY,
      language: 'en',
      keywords: ['warranty', 'guarantee', 'policy', 'coverage'],
      isActive: true,
      createdBy: adminUser,
    },
    {
      title: 'Pricing and Payment Options',
      content: 'We offer competitive pricing and multiple payment options including cash, credit cards, financing, and direct insurance billing. We provide free detailed estimates. Payment is typically due upon vehicle pickup unless you have arranged financing or insurance direct billing.',
      category: KnowledgeBaseCategory.PRICING,
      language: 'en',
      keywords: ['price', 'cost', 'payment', 'financing', 'billing'],
      isActive: true,
      createdBy: adminUser,
    },
    {
      title: 'OEM vs Aftermarket Parts',
      content: 'OEM (Original Equipment Manufacturer) parts are made by your vehicle manufacturer and are identical to original parts. Aftermarket parts are made by third-party manufacturers and are typically less expensive. We use certified aftermarket parts that meet or exceed OEM specifications unless you specifically request OEM parts.',
      category: KnowledgeBaseCategory.TECHNICAL,
      language: 'en',
      keywords: ['parts', 'OEM', 'aftermarket', 'quality', 'specifications'],
      isActive: true,
      createdBy: adminUser,
    },
    {
      title: 'Towing Services',
      content: 'If your vehicle is not drivable, we offer towing services to our facility. We have partnerships with local towing companies to provide 24/7 service. Towing costs may be covered by your insurance - we can help you verify coverage.',
      category: KnowledgeBaseCategory.FAQ,
      language: 'en',
      keywords: ['towing', 'tow', 'not-drivable', 'transport'],
      isActive: true,
      createdBy: adminUser,
    },
    {
      title: 'Paint Matching Technology',
      content: 'We use advanced computerized paint matching technology to ensure your vehicle paint matches perfectly. Our system analyzes your current paint and creates a custom formula. All paint work is done in our climate-controlled paint booth for optimal results.',
      category: KnowledgeBaseCategory.TECHNICAL,
      language: 'en',
      keywords: ['paint', 'color-match', 'technology', 'booth'],
      isActive: true,
      createdBy: adminUser,
    },
  ];

  // Create knowledge base entries
  const kbEntries = await kbRepository.save(kbData as any);
  console.log(`   ✅ Created ${kbEntries.length} knowledge base entries`);
}
