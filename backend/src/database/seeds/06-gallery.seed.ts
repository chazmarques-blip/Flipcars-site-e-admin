import { DataSource } from 'typeorm';
import { GalleryItem, GalleryItemType } from '../entities/gallery-item.entity';
import { User } from '../entities/user.entity';

export async function seedGallery(dataSource: DataSource): Promise<void> {
  const galleryRepository = dataSource.getRepository(GalleryItem);
  const userRepository = dataSource.getRepository(User);

  // Check if already seeded
  const existingItems = await galleryRepository.count();
  if (existingItems > 0) {
    console.log('   ⏭️  Gallery already seeded, skipping...');
    return;
  }

  // Get admin user as uploader
  const adminUser = await userRepository.findOne({ where: { email: 'admin@flipcars.us' } });

  // Define gallery items (using placeholder URLs - would be replaced with actual S3 URLs)
  const galleryData = [
    // Before/After Photos
    {
      title: 'Rear-End Collision Repair - Honda Accord',
      description: 'Complete rear bumper and trunk restoration after rear-end collision',
      imageUrl: 'https://placeholder-gallery.s3.amazonaws.com/before-after-1.jpg',
      beforeImageUrl: 'https://placeholder-gallery.s3.amazonaws.com/before-1.jpg',
      afterImageUrl: 'https://placeholder-gallery.s3.amazonaws.com/after-1.jpg',
      thumbnailUrl: 'https://placeholder-gallery.s3.amazonaws.com/thumb-1.jpg',
      type: GalleryItemType.BEFORE_AFTER,
      tags: ['collision', 'rear-end', 'honda', 'accord', 'bumper'],
      displayOrder: 1,
      isFeatured: true,
      isVisible: true,
      uploadedBy: adminUser,
    },
    {
      title: 'Side Panel Repair - Toyota Camry',
      description: 'Door and fender repair with perfect paint match',
      imageUrl: 'https://placeholder-gallery.s3.amazonaws.com/before-after-2.jpg',
      beforeImageUrl: 'https://placeholder-gallery.s3.amazonaws.com/before-2.jpg',
      afterImageUrl: 'https://placeholder-gallery.s3.amazonaws.com/after-2.jpg',
      thumbnailUrl: 'https://placeholder-gallery.s3.amazonaws.com/thumb-2.jpg',
      type: GalleryItemType.BEFORE_AFTER,
      tags: ['side-panel', 'toyota', 'camry', 'paint-match'],
      displayOrder: 2,
      isFeatured: true,
      isVisible: true,
      uploadedBy: adminUser,
    },
    {
      title: 'Front-End Collision - Ford F-150',
      description: 'Hood, grille, and bumper replacement with frame straightening',
      imageUrl: 'https://placeholder-gallery.s3.amazonaws.com/before-after-3.jpg',
      beforeImageUrl: 'https://placeholder-gallery.s3.amazonaws.com/before-3.jpg',
      afterImageUrl: 'https://placeholder-gallery.s3.amazonaws.com/after-3.jpg',
      thumbnailUrl: 'https://placeholder-gallery.s3.amazonaws.com/thumb-3.jpg',
      type: GalleryItemType.BEFORE_AFTER,
      tags: ['front-end', 'collision', 'ford', 'f150', 'frame'],
      displayOrder: 3,
      isFeatured: true,
      isVisible: true,
      uploadedBy: adminUser,
    },
    {
      title: 'Hail Damage Repair - Nissan Altima',
      description: 'Paintless dent repair on multiple panels',
      imageUrl: 'https://placeholder-gallery.s3.amazonaws.com/before-after-4.jpg',
      beforeImageUrl: 'https://placeholder-gallery.s3.amazonaws.com/before-4.jpg',
      afterImageUrl: 'https://placeholder-gallery.s3.amazonaws.com/after-4.jpg',
      thumbnailUrl: 'https://placeholder-gallery.s3.amazonaws.com/thumb-4.jpg',
      type: GalleryItemType.BEFORE_AFTER,
      tags: ['hail-damage', 'paintless', 'nissan', 'altima', 'pdr'],
      displayOrder: 4,
      isFeatured: false,
      isVisible: true,
      uploadedBy: adminUser,
    },

    // Facility Photos
    {
      title: 'State-of-the-Art Paint Booth',
      description: 'Climate-controlled paint booth for perfect finishes',
      imageUrl: 'https://placeholder-gallery.s3.amazonaws.com/facility-paint-booth.jpg',
      thumbnailUrl: 'https://placeholder-gallery.s3.amazonaws.com/thumb-paint-booth.jpg',
      type: GalleryItemType.FACILITY,
      tags: ['facility', 'paint-booth', 'equipment'],
      displayOrder: 5,
      isFeatured: true,
      isVisible: true,
      uploadedBy: adminUser,
    },
    {
      title: 'Advanced Frame Straightening Equipment',
      description: 'Laser-guided frame straightening system for precise alignment',
      imageUrl: 'https://placeholder-gallery.s3.amazonaws.com/facility-frame-rack.jpg',
      thumbnailUrl: 'https://placeholder-gallery.s3.amazonaws.com/thumb-frame-rack.jpg',
      type: GalleryItemType.FACILITY,
      tags: ['facility', 'frame-straightening', 'equipment', 'technology'],
      displayOrder: 6,
      isFeatured: true,
      isVisible: true,
      uploadedBy: adminUser,
    },
    {
      title: 'Spacious Repair Bays',
      description: 'Multiple repair bays equipped with latest tools',
      imageUrl: 'https://placeholder-gallery.s3.amazonaws.com/facility-repair-bays.jpg',
      thumbnailUrl: 'https://placeholder-gallery.s3.amazonaws.com/thumb-repair-bays.jpg',
      type: GalleryItemType.FACILITY,
      tags: ['facility', 'repair-bays', 'shop'],
      displayOrder: 7,
      isFeatured: false,
      isVisible: true,
      uploadedBy: adminUser,
    },

    // Team Photos
    {
      title: 'Our Expert Technicians',
      description: 'ASE and I-CAR certified technicians',
      imageUrl: 'https://placeholder-gallery.s3.amazonaws.com/team-technicians.jpg',
      thumbnailUrl: 'https://placeholder-gallery.s3.amazonaws.com/thumb-technicians.jpg',
      type: GalleryItemType.TEAM,
      tags: ['team', 'technicians', 'certified', 'staff'],
      displayOrder: 8,
      isFeatured: true,
      isVisible: true,
      uploadedBy: adminUser,
    },

    // Completed Work
    {
      title: 'Luxury Vehicle Restoration - BMW 5 Series',
      description: 'Complete restoration of BMW after major collision',
      imageUrl: 'https://placeholder-gallery.s3.amazonaws.com/completed-bmw.jpg',
      thumbnailUrl: 'https://placeholder-gallery.s3.amazonaws.com/thumb-completed-bmw.jpg',
      type: GalleryItemType.COMPLETED_WORK,
      tags: ['bmw', 'luxury', 'completed', 'restoration'],
      displayOrder: 9,
      isFeatured: false,
      isVisible: true,
      uploadedBy: adminUser,
    },
    {
      title: 'Classic Car Restoration - 1967 Mustang',
      description: 'Body work and paint restoration on classic Mustang',
      imageUrl: 'https://placeholder-gallery.s3.amazonaws.com/completed-mustang.jpg',
      thumbnailUrl: 'https://placeholder-gallery.s3.amazonaws.com/thumb-completed-mustang.jpg',
      type: GalleryItemType.COMPLETED_WORK,
      tags: ['mustang', 'classic', 'restoration', 'vintage'],
      displayOrder: 10,
      isFeatured: true,
      isVisible: true,
      uploadedBy: adminUser,
    },
  ];

  // Create gallery items
  const galleryItems = await galleryRepository.save(galleryData as any);
  console.log(`   ✅ Created ${galleryItems.length} gallery items`);
  console.log(`      • ${galleryData.filter(i => i.type === GalleryItemType.BEFORE_AFTER).length} Before/After photos`);
  console.log(`      • ${galleryData.filter(i => i.type === GalleryItemType.FACILITY).length} Facility photos`);
  console.log(`      • ${galleryData.filter(i => i.type === GalleryItemType.TEAM).length} Team photos`);
  console.log(`      • ${galleryData.filter(i => i.type === GalleryItemType.COMPLETED_WORK).length} Completed work photos`);
}
