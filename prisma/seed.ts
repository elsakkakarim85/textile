import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Wiping existing data...');
  // Clean up existing data to avoid conflicts
  await prisma.productPassport.deleteMany({});
  await prisma.marketplaceListing.deleteMany({});
  await prisma.jobApplication.deleteMany({});
  await prisma.jobPosting.deleteMany({});
  await prisma.quotation.deleteMany({});
  await prisma.rFQ.deleteMany({});
  await prisma.milestone.deleteMany({});
  await prisma.contract.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.conversation.deleteMany({});
  await prisma.factory.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Installing expert-level demo data...');

  // 1. Create Users (Admin, 2 Factory Owners, 2 Buyers)
  const admin = await prisma.user.create({
    data: { id: 'usr_admin_001', email: 'admin@tigara.org', firstName: 'TIGARA', lastName: 'Admin', role: 'admin' }
  });

  const owner1 = await prisma.user.create({
    data: { id: 'usr_owner_001', email: 'director@misr-spinning.com', firstName: 'Hassan', lastName: 'El-Mahdi', role: 'factory_owner' }
  });

  const owner2 = await prisma.user.create({
    data: { id: 'usr_owner_002', email: 'ceo@alrowad-tex.com', firstName: 'Omar', lastName: 'Tarek', role: 'factory_owner' }
  });

  const buyer1 = await prisma.user.create({
    data: { id: 'usr_buyer_001', email: 'sourcing@zara-eu.com', firstName: 'Elena', lastName: 'Russo', role: 'buyer' }
  });

  const buyer2 = await prisma.user.create({
    data: { id: 'usr_buyer_002', email: 'procurement@defacto.com.tr', firstName: 'Mehmet', lastName: 'Yilmaz', role: 'buyer' }
  });

  // 2. Create Factories
  const factory1 = await prisma.factory.create({
    data: {
      name: 'Misr Spinning & Weaving Co.',
      description: 'The largest and oldest textile manufacturing facility in the Middle East. Specialized in high-count Egyptian cotton yarns and premium woven fabrics. Over 10,000 employees.',
      address: 'Industrial Zone 1, El Mahalla El Kubra',
      taxRegistrationNumber: '111-222-333',
      status: 'APPROVED',
      subscriptionTier: 'ENTERPRISE',
      isVerified: true,
      ownerId: owner1.id,
    }
  });

  const factory2 = await prisma.factory.create({
    data: {
      name: 'Al-Rowad Advanced Dyeing',
      description: 'State-of-the-art dyeing and finishing facility utilizing Zero Liquid Discharge (ZLD) technologies. OEKO-TEX Standard 100 certified.',
      address: 'Textile City, El Mahalla El Kubra',
      taxRegistrationNumber: '444-555-666',
      status: 'APPROVED',
      subscriptionTier: 'PRO',
      isVerified: true,
      ownerId: owner2.id,
    }
  });

  // 3. Create Marketplace Listings (Products, Resources, Waste)
  const listing1 = await prisma.marketplaceListing.create({
    data: {
      title: 'Premium Giza 86 Cotton Yarn (Ne 60/1)',
      description: 'Combed, compacted Egyptian cotton yarn. Ideal for luxury shirting and high-end bed linens. Certified organic.',
      type: 'PRODUCT',
      price: 12.5, // USD
      sellerId: owner1.id,
    }
  });

  const listing2 = await prisma.marketplaceListing.create({
    data: {
      title: 'Reactive Dyed Knitted Jersey (200 GSM)',
      description: '95% Cotton 5% Elastane knitted fabric. High color fastness (ISO 105). Available in 15 standard Pantone colors.',
      type: 'PRODUCT',
      price: 6.2, // USD
      sellerId: owner2.id,
    }
  });

  const listing3 = await prisma.marketplaceListing.create({
    data: {
      title: 'Monforts Montex Stenter Machine Capacity',
      description: 'Available stenter finishing capacity. 8 chambers, gas-heated. Capable of heat setting up to 240cm width. Available for toll manufacturing.',
      type: 'RESOURCE',
      price: 500, // EGP/hour
      sellerId: owner2.id,
    }
  });

  const listing4 = await prisma.marketplaceListing.create({
    data: {
      title: '100% Cotton Spinning Waste (Comber Noil)',
      description: 'High-quality comber noil waste from Giza cotton spinning. Excellent for medical cotton, currency paper, or coarse yarn spinning.',
      type: 'WASTE',
      price: 2.1, // USD/kg
      sellerId: owner1.id,
    }
  });

  // 4. Create Digital Product Passports (DPP)
  const generateHash = (data: string) => crypto.createHash('sha256').update(data).digest('hex');

  await prisma.productPassport.create({
    data: {
      listingId: listing1.id,
      material: '100% Extra Long Staple Egyptian Cotton (Giza 86)',
      carbonFootprint: '4.2 kg CO2e / kg',
      certifications: 'GOTS, OEKO-TEX Standard 100, Egyptian Cotton Mark',
      signatureHash: generateHash(`${listing1.id}-Giza86-GOTS`),
    }
  });

  await prisma.productPassport.create({
    data: {
      listingId: listing2.id,
      material: '95% BCI Cotton, 5% Lycra',
      carbonFootprint: '5.8 kg CO2e / kg',
      certifications: 'BCI, ISO 9001, ZDHC Level 3',
      signatureHash: generateHash(`${listing2.id}-BCI-ZDHC`),
    }
  });

  // 5. Create Job Postings
  await prisma.jobPosting.create({
    data: {
      title: 'Senior Textile Chemical Engineer',
      description: 'Looking for an expert with 10+ years in reactive and disperse dyeing. Must be familiar with Datacolor spectrophotometers and recipe optimization.',
      employerId: owner2.id,
    }
  });

  await prisma.jobPosting.create({
    data: {
      title: 'Quality Assurance Inspector (Export)',
      description: 'ISO 9001 internal auditor. Responsible for final inspection (AQL 1.5) before European shipment.',
      employerId: owner1.id,
    }
  });

  // 6. Create RFQ and Quotation
  const rfq1 = await prisma.rFQ.create({
    data: {
      title: 'Supply of 50,000 meters of Twill Fabric for Workwear',
      description: 'Looking for 65/35 Poly-Cotton Twill, 240 GSM. Must withstand industrial washing at 85C.',
      quantity: '50000',
      targetPrice: '3.5 USD/meter',
      status: 'OPEN',
      buyerId: buyer1.id,
    }
  });

  await prisma.quotation.create({
    data: {
      rfqId: rfq1.id,
      factoryId: factory1.id,
      price: '3.8 USD/meter',
      message: 'We can manufacture this using Indanthrene dyes for maximum wash fastness. Lead time: 45 days.',
    }
  });

  // 7. Create Escrow Contract
  const contract = await prisma.contract.create({
    data: {
      title: 'Export Order: 10,000 Pcs Premium Polos',
      totalAmount: 45000,
      status: 'ACTIVE',
      buyerId: buyer2.id,
      factoryId: factory2.id,
    }
  });

  await prisma.milestone.create({
    data: {
      contractId: contract.id,
      title: '30% Advance Payment (Yarn Sourcing)',
      amount: 13500,
      status: 'RELEASED',
    }
  });

  await prisma.milestone.create({
    data: {
      contractId: contract.id,
      title: '70% Balance against Bill of Lading',
      amount: 31500,
      status: 'FUNDED', // Money is in escrow
    }
  });

  // 8. Reviews
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Excellent quality and perfect adherence to European REACH standards. Will order again.',
      factoryId: factory2.id,
      reviewerId: buyer1.id,
    }
  });

  console.log('Expert-level demo data installed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
