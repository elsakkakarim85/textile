import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding new cluster modules...');

  // 1. Get existing factories & users
  const factories = await prisma.factory.findMany();
  const users = await prisma.user.findMany();
  if (factories.length === 0 || users.length === 0) {
    console.log('No core data found, aborting.');
    return;
  }
  const f1 = factories[0];
  const f2 = factories[1] || factories[0];
  const admin = users.find(u => u.role === 'admin') || users[0];
  const owner = users.find(u => u.role === 'factory_owner') || users[0];

  // 2. Capacity Exchange
  await prisma.capacityPost.create({
    data: {
      factoryId: f1.id,
      kind: 'OFFER',
      process: 'weaving',
      title: 'Idle Looms for Denim Weaving',
      description: 'We have 5 Sulzer looms available for the next 3 weeks.',
      availableFrom: new Date(),
      availableTo: new Date(Date.now() + 21*86400000),
      quantity: 15000,
      unit: 'm',
      status: 'OPEN'
    }
  });

  await prisma.capacityPost.create({
    data: {
      factoryId: f2.id,
      kind: 'REQUEST',
      process: 'dyeing',
      title: 'Need Reactive Dyeing (10 tons)',
      description: 'Looking for a reliable dyeing house to handle 10 tons of 100% cotton yarn in navy blue.',
      availableFrom: new Date(Date.now() + 2*86400000),
      availableTo: new Date(Date.now() + 15*86400000),
      quantity: 10000,
      unit: 'kg',
      status: 'OPEN'
    }
  });

  // 3. Consortia
  const consortium = await prisma.consortium.create({
    data: {
      name: 'Mahalla Denim Export Alliance',
      description: 'Targeting European buyers with integrated spinning to sewing.',
      targetMarket: 'EU',
      leadFactoryId: f1.id,
      status: 'ACTIVE',
      members: {
        create: [
          { factoryId: f1.id, role: 'Lead / Final Assembly', status: 'ACCEPTED', sharePct: 60 },
          { factoryId: f2.id, role: 'Dyeing & Finishing', status: 'ACCEPTED', sharePct: 40 }
        ]
      }
    }
  });

  // 4. Procurement
  const pool = await prisma.procurementPool.create({
    data: {
      organizerId: admin.id,
      title: 'Giza Cotton Yarn (Ne 30/1)',
      description: 'Bulk purchase of Giza cotton yarn to secure a 15% discount.',
      category: 'YARN',
      targetQty: 50000,
      unit: 'kg',
      minCommitQty: 1000,
      benchmarkUnitPrice: 250,
      targetUnitPrice: 215,
      deadline: new Date(Date.now() + 7*86400000),
      status: 'OPEN',
      commitments: {
        create: [
          { factoryId: f1.id,  quantity: 15000, status: 'COMMITTED' },
          { factoryId: f2.id,  quantity: 8000, status: 'COMMITTED' }
        ]
      }
    }
  });

  // 5. Shared Facilities
  await prisma.sharedFacility.create({
    data: {
      name: 'TIGARA Textile Testing Lab',
      description: 'ISO certified lab for yarn strength, color fastness, and composition testing.',
      type: 'TESTING_LAB',
      ratePerHour: 500,
      location: 'Mahalla Cluster Center, Bldg B',
      operator: 'Eng. Khaled',
      equipment: ['Tensile Tester', 'Spectrophotometer']
    }
  });

  await prisma.sharedFacility.create({
    data: {
      name: 'CAD/CAM Design Studio',
      description: 'High-end workstations with Optitex and Gerber software for pattern making.',
      type: 'CAD_DESIGN',
      ratePerHour: 150,
      location: 'Innovation Hub',
      equipment: ['Optitex 3D', 'Plotter']
    }
  });

  // 6. Maturity Assessments
  await prisma.maturityAssessment.create({
    data: {
      factoryId: f1.id,
      takenById: owner.id,
      answers: {},
      scores: { digital: 45, production: 60, quality: 75, sustainability: 30, market: 55, people: 40 },
      overallScore: 51,
      level: 3,
      recommendations: [
        { dimension: 'sustainability', priority: 'Now', action: 'Install digital energy sub-meters.', actionAr: 'تركيب عدادات طاقة رقمية فرعية.', tag: 'sustainability', category: 'SUSTAINABILITY' }
      ]
    }
  });

  // 7. Courses
  await prisma.course.create({
    data: {
      slug: 'lean-manufacturing',
      title: 'Lean Manufacturing for Textiles',
      titleAr: 'التصنيع الرشيق لقطاع النسيج',
      description: 'Reduce waste and improve efficiency in spinning and weaving.',
      descriptionAr: 'تقليل الهدر وتحسين الكفاءة في الغزل والنسيج.',
      provider: 'UNIDO',
      durationHours: 12,
      level: 'INTERMEDIATE',
      category: 'MANAGEMENT',
    }
  });

  await prisma.course.create({
    data: {
      slug: 'zdhc-basics',
      title: 'ZDHC Chemical Management Basics',
      titleAr: 'أساسيات إدارة الكيماويات ZDHC',
      description: 'Safe handling of dyes and chemicals for export compliance.',
      descriptionAr: 'التعامل الآمن مع الأصباغ والكيماويات للتوافق مع التصدير.',
      provider: 'TIGARA',
      durationHours: 6,
      level: 'BEGINNER',
      category: 'SUSTAINABILITY',
      
    }
  });

  // 8. Sustainability Records
  await prisma.sustainabilityRecord.create({
    data: {
      factoryId: f1.id,
      period: '2026-08',
      productionVolumeKg: 50000,
      electricityKwh: 120000,
      renewableSharePct: 0,
      waterM3: 2000,
      wasteTotalKg: 1500,
      wasteRecycledKg: 500,
      certZdhc: false,
      certOekoTex: true,
      co2eKg: 120000 * 0.45,
    }
  });
  await prisma.sustainabilityRecord.create({
    data: {
      factoryId: f1.id,
      period: '2026-09',
      productionVolumeKg: 52000,
      electricityKwh: 118000,
      renewableSharePct: 5,
      waterM3: 1950,
      wasteTotalKg: 1400,
      wasteRecycledKg: 600,
      certZdhc: false,
      certOekoTex: true,
      co2eKg: (118000 * 0.95 * 0.45),
    }
  });

  // 9. Funding Programs
  await prisma.fundingProgram.create({
    data: {
      title: 'SME Green Transformation Grant',
      provider: 'EBRD & MSMEDA',
      description: 'Financial assistance for installing solar panels and water recycling systems.',
      type: 'GRANT',
      maxAmount: 500000,
      deadline: new Date(Date.now() + 15*86400000),
      tags: ['sustainability', 'energy'],
      isActive: true,
    }
  });

  await prisma.fundingProgram.create({
    data: {
      title: 'Digital ERP Subsidy',
      provider: 'TIGARA / IMC',
      description: '70% subsidy for implementing cloud ERP and tracking software.',
      type: 'SUBSIDY',
      maxAmount: 150000,
      deadline: new Date(Date.now() + 45*86400000),
      tags: ['digital', 'production'],
      isActive: true,
    }
  });

  // 10. Forum
  await prisma.forumThread.create({
    data: {
      authorId: owner.id,
      title: 'أفضل طريقة لتقليل استهلاك المياه في الصباغة؟',
      body: 'نبحث عن طرق عملية لتقليل استهلاك المياه في عمليات صباغة القطن دون التأثير على ثبات الألوان.',
      category: 'TECHNICAL',
      isPinned: true,
      hasAcceptedAnswer: true,
      tags: ['Dyeing', 'Water', 'Sustainability']
    }
  });

  // 11. Events
  await prisma.clusterEvent.create({
    data: {
      organizerId: admin.id,
      title: 'Heimtextil Frankfurt Preparation Workshop',
      description: 'Prepare your collections for the upcoming German exhibition. Focus on sustainability standards and DPP.',
      type: 'WORKSHOP',
      startAt: new Date(Date.now() + 5*86400000),
      endAt: new Date(Date.now() + 5*86400000 + 4*3600000),
      location: 'Mahalla Training Center',
      isOnline: false,
      capacity: 50,
    }
  });

  await prisma.clusterEvent.create({
    data: {
      organizerId: admin.id,
      title: 'EU DPP Requirements Webinar',
      description: 'Online session covering Digital Product Passport requirements for 2027.',
      type: 'WEBINAR',
      startAt: new Date(Date.now() + 12*86400000),
      endAt: new Date(Date.now() + 12*86400000 + 2*3600000),
      location: 'Zoom',
      isOnline: true,
      capacity: 200,
      
    }
  });

  // 12. Experts
  await prisma.expertProfile.create({
    data: {
      
      headline: 'Lean Manufacturing & Dyeing Specialist',
      bio: '20+ years of experience optimizing dyeing houses across Egypt and Turkey. Specialized in reactive and vat dyeing.',
      expertise: ['Lean', 'Dyeing', 'Quality'],
      yearsOfExperience: 22,
      languages: ['English', 'Arabic'],
      isAvailableForMentorship: true,
      isVerified: true,
      hourlyRate: 0, // Pro bono
    }
  });

  // 13. Announcements
  await prisma.announcement.create({
    data: {
      authorId: admin.id,
      title: 'Cluster wide electricity maintenance',
      titleAr: 'صيانة الكهرباء على مستوى التجمع',
      bodyEn: 'Please be informed that the main grid will be under maintenance this Friday from 2 AM to 6 AM.',
      bodyAr: 'يرجى العلم أن الشبكة الرئيسية ستخضع للصيانة يوم الجمعة من 2 صباحاً إلى 6 صباحاً.',
      targetRole: 'ALL',
      isPinned: true,
      isActive: true,
    }
  });

  console.log('New cluster modules seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });









