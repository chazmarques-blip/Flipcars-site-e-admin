import { DataSource } from 'typeorm';
import { Page, PageStatus } from '../entities/page.entity';
import { BlogPost, BlogPostStatus } from '../entities/blog-post.entity';
import { User } from '../entities/user.entity';

export async function seedCMSPages(dataSource: DataSource): Promise<void> {
  const pageRepository = dataSource.getRepository(Page);
  const blogRepository = dataSource.getRepository(BlogPost);
  const userRepository = dataSource.getRepository(User);

  // Check if already seeded
  const existingPages = await pageRepository.count();
  if (existingPages > 0) {
    console.log('   ⏭️  CMS Pages already seeded, skipping...');
    return;
  }

  // Get admin user as author
  const adminUser = await userRepository.findOne({ where: { email: 'admin@flipcars.us' } });

  // Define pages
  const pagesData = [
    {
      title: 'Home',
      slug: 'home',
      excerpt: 'Welcome to FlipCars - Your trusted auto body shop',
      content: `# Your Car, Perfectly Restored After an Accident

From towing to rental car - we handle everything so your car gets back to perfect condition.

## Why Choose FlipCars?

- ✅ Work with all insurance companies
- ✅ Free towing services available
- ✅ Rental car assistance
- ✅ Lifetime warranty on repairs
- ✅ AI-powered customer service

Get your free estimate today!`,
      language: 'en',
      status: PageStatus.PUBLISHED,
      metaTitle: 'FlipCars - Auto Body Shop | Collision Repair Miami',
      metaDescription: 'Professional auto body repair and collision services in Miami. We work with all insurance companies. Free estimates and towing services available.',
      metaKeywords: ['auto body shop', 'collision repair', 'miami', 'insurance', 'towing'],
      author: adminUser,
      publishedAt: new Date(),
    },
    {
      title: 'About Us',
      slug: 'about',
      excerpt: 'Learn about FlipCars and our commitment to excellence',
      content: `# About FlipCars

FlipCars has been serving the Miami community for over 15 years with professional auto body repair services.

## Our Mission

To provide the highest quality auto body repairs while making the process as stress-free as possible for our customers.

## Our Values

- **Quality**: We never compromise on the quality of our work
- **Integrity**: Honest estimates and transparent communication
- **Innovation**: Using the latest technology including AI customer service
- **Service**: Your satisfaction is our top priority

## Certifications

- I-CAR Gold Class Certified
- ASE Certified Technicians
- PPG Certified Refinish Facility`,
      language: 'en',
      status: PageStatus.PUBLISHED,
      metaTitle: 'About FlipCars - Miami Auto Body Shop',
      metaDescription: 'Learn about FlipCars, Miami\'s trusted auto body shop with 15+ years of experience, certified technicians, and commitment to quality.',
      author: adminUser,
      publishedAt: new Date(),
    },
    {
      title: 'Services',
      slug: 'services',
      excerpt: 'Comprehensive auto body repair services',
      content: `# Our Services

## Collision Repair
Complete collision repair services for all makes and models.

## Paintless Dent Repair
Quick and affordable dent removal without repainting.

## Paint & Refinishing
Computerized paint matching for perfect color results.

## Frame Straightening
State-of-the-art frame straightening equipment.

## Bumper Repair
Expert bumper repair and replacement services.

## Glass Replacement
Windshield and auto glass replacement.

## Insurance Claims
We handle the entire insurance claims process for you.`,
      language: 'en',
      status: PageStatus.PUBLISHED,
      metaTitle: 'Auto Body Services - Collision Repair Miami | FlipCars',
      metaDescription: 'Complete auto body services including collision repair, paintless dent repair, paint matching, frame straightening, and insurance claims assistance.',
      author: adminUser,
      publishedAt: new Date(),
    },
    {
      title: 'FAQ',
      slug: 'faq',
      excerpt: 'Frequently asked questions about auto body repair',
      content: `# Frequently Asked Questions

## Do you work with my insurance?
Yes! We work with all major insurance companies and can handle the entire claims process for you.

## How long will repairs take?
Minor repairs: 1-3 days. Major collision repairs: 5-10 days. We provide a detailed timeline during your estimate.

## Do you offer rental cars?
Yes, we can arrange rental vehicles through our partners. Many insurance policies cover rental costs.

## What is your warranty?
We offer a lifetime warranty on all workmanship and paint. Parts are covered by manufacturer warranties.

## Do you use OEM parts?
We use certified aftermarket parts that meet or exceed OEM specifications, unless you specifically request OEM parts.

## Is towing available?
Yes, we offer 24/7 towing services. Costs may be covered by your insurance.`,
      language: 'en',
      status: PageStatus.PUBLISHED,
      metaTitle: 'FAQ - Auto Body Repair Questions | FlipCars Miami',
      metaDescription: 'Get answers to common questions about auto body repair, insurance claims, warranties, rental cars, and our repair process.',
      author: adminUser,
      publishedAt: new Date(),
    },
    {
      title: 'Contact Us',
      slug: 'contact',
      excerpt: 'Get in touch with FlipCars',
      content: `# Contact FlipCars

## Get Your Free Estimate

Call us or fill out our online form to get a free estimate for your auto body repair.

## Location
123 Auto Body Lane
Miami, FL 33101

## Hours
Monday - Friday: 8:00 AM - 6:00 PM
Saturday: 9:00 AM - 3:00 PM
Sunday: Closed

## Phone
Main: (305) 555-FLIP (3547)
After Hours Towing: (305) 555-TOWS

## Email
info@flipcars.us
estimates@flipcars.us

## Emergency Services
24/7 Towing Available
Call: (305) 555-TOWS`,
      language: 'en',
      status: PageStatus.PUBLISHED,
      metaTitle: 'Contact FlipCars - Miami Auto Body Shop',
      metaDescription: 'Contact FlipCars for auto body repair estimates. Located in Miami with 24/7 towing services. Call (305) 555-FLIP or visit us today.',
      author: adminUser,
      publishedAt: new Date(),
    },
  ];

  // Create pages
  const pages = await pageRepository.save(pagesData as any);
  console.log(`   ✅ Created ${pages.length} CMS pages`);

  // Define blog posts
  const blogPostsData = [
    {
      title: '5 Things to Do Immediately After a Car Accident',
      slug: '5-things-after-car-accident',
      excerpt: 'Essential steps to take right after being involved in a car accident to protect yourself and streamline the repair process.',
      content: `# 5 Things to Do Immediately After a Car Accident

Being in a car accident is stressful, but knowing what to do can make the process smoother.

## 1. Ensure Safety First
Move to a safe location if possible and check for injuries.

## 2. Call the Police
Always file an official police report, even for minor accidents.

## 3. Document Everything
Take photos of all vehicles, damage, and the accident scene.

## 4. Exchange Information
Get contact and insurance information from all parties involved.

## 5. Contact Your Insurance
Report the accident to your insurance company as soon as possible.

Need auto body repair? Contact FlipCars for a free estimate!`,
      language: 'en',
      status: BlogPostStatus.PUBLISHED,
      tags: ['safety', 'accidents', 'insurance', 'tips'],
      category: 'Safety Tips',
      metaTitle: '5 Essential Steps After a Car Accident | FlipCars Blog',
      metaDescription: 'Learn what to do immediately after a car accident to protect yourself and streamline the insurance claims and repair process.',
      author: adminUser,
      publishedAt: new Date('2024-10-01'),
    },
    {
      title: 'OEM vs Aftermarket Parts: What\'s the Difference?',
      slug: 'oem-vs-aftermarket-parts',
      excerpt: 'Understanding the difference between OEM and aftermarket auto parts and which is right for your repair.',
      content: `# OEM vs Aftermarket Parts: What You Need to Know

When repairing your vehicle, you may need to choose between OEM and aftermarket parts.

## What are OEM Parts?
OEM (Original Equipment Manufacturer) parts are made by your vehicle's manufacturer.

**Pros:**
- Guaranteed fit and quality
- Maintain vehicle resale value
- Warranty protection

**Cons:**
- Higher cost
- Limited availability

## What are Aftermarket Parts?
Aftermarket parts are made by third-party manufacturers.

**Pros:**
- Lower cost
- Wide availability
- Often meet or exceed OEM quality

**Cons:**
- Quality varies by manufacturer
- May affect resale value slightly

## Our Recommendation
We use certified aftermarket parts that meet or exceed OEM specifications, offering the best value while maintaining quality.`,
      language: 'en',
      status: BlogPostStatus.PUBLISHED,
      tags: ['parts', 'OEM', 'aftermarket', 'repair'],
      category: 'Auto Repair',
      metaTitle: 'OEM vs Aftermarket Auto Parts Explained | FlipCars',
      metaDescription: 'Learn the difference between OEM and aftermarket auto parts, their pros and cons, and which option is best for your vehicle repair.',
      author: adminUser,
      publishedAt: new Date('2024-10-15'),
    },
  ];

  // Create blog posts
  const blogPosts = await blogRepository.save(blogPostsData as any);
  console.log(`   ✅ Created ${blogPosts.length} blog posts`);
}
