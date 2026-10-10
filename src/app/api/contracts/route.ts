import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: Request) {
  const authObj = await auth();
  if (!authObj.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    let contracts = await prisma.contract.findMany({
      where: {
        OR: [
          { buyerId: authObj.userId },
          { factory: { ownerId: authObj.userId } }
        ]
      },
      include: {
        buyer: true,
        factory: true,
        milestones: { orderBy: { createdAt: 'asc' } }
      }
    });

    // For Demo: Auto-generate a dummy contract if none exist and the user has a factory
    if (contracts.length === 0) {
      const factory = await prisma.factory.findFirst({ where: { ownerId: authObj.userId } });
      if (factory) {
        const dummyBuyer = await prisma.user.findFirst({ where: { id: { not: authObj.userId } } });
        if (dummyBuyer) {
          const newContract = await prisma.contract.create({
            data: {
              title: "Export Order: 10,000 Cotton Towels",
              totalAmount: 25000,
              buyerId: dummyBuyer.id,
              factoryId: factory.id,
              milestones: {
                create: [
                  { title: "30% Advance Payment (Materials)", amount: 7500, status: "FUNDED" },
                  { title: "70% On Bill of Lading (Shipping)", amount: 17500, status: "PENDING" }
                ]
              }
            },
            include: { buyer: true, factory: true, milestones: true }
          });
          contracts = [newContract];
        }
      } else {
        // If user is a buyer, generate a dummy contract with some factory
        const randomFactory = await prisma.factory.findFirst();
        if (randomFactory) {
          const newContract = await prisma.contract.create({
            data: {
              title: "Export Order: 5,000 T-Shirts",
              totalAmount: 15000,
              buyerId: authObj.userId,
              factoryId: randomFactory.id,
              milestones: {
                create: [
                  { title: "30% Advance Payment", amount: 4500, status: "PENDING" },
                  { title: "70% On Delivery", amount: 10500, status: "PENDING" }
                ]
              }
            },
            include: { buyer: true, factory: true, milestones: true }
          });
          contracts = [newContract];
        }
      }
    }

    return NextResponse.json(contracts);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch contracts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authObj = await auth();
  if (!authObj.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { milestoneId, action } = await req.json();
    
    // action: "FUND" or "RELEASE"
    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { contract: { include: { factory: true } } }
    });

    if (!milestone) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (action === 'FUND' && milestone.contract.buyerId === authObj.userId) {
      await prisma.milestone.update({ where: { id: milestoneId }, data: { status: 'FUNDED' } });
      await prisma.notification.create({
        data: {
          userId: milestone.contract.factory.ownerId,
          title: "Milestone Funded! 💰",
          message: `The buyer has funded "${milestone.title}". Funds are secured in Escrow.`,
        }
      });
    } else if (action === 'RELEASE' && milestone.contract.buyerId === authObj.userId) {
      await prisma.milestone.update({ where: { id: milestoneId }, data: { status: 'RELEASED' } });
      await prisma.notification.create({
        data: {
          userId: milestone.contract.factory.ownerId,
          title: "Funds Released! 🚀",
          message: `The buyer has released funds for "${milestone.title}". Expect transfer to your bank.`,
        }
      });
    } else {
      return NextResponse.json({ error: 'Not authorized for this action' }, { status: 403 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
