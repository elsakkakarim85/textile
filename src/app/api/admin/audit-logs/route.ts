import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth, clerkClient } from '@clerk/nextjs/server';

async function checkAdmin() {
  const authObj = await auth();
  let role = (authObj.sessionClaims?.metadata as any)?.role;
  if (!role && authObj.userId) {
    const client = await clerkClient();
    const user = await client.users.getUser(authObj.userId);
    role = user.publicMetadata?.role;
  }
  return role === 'admin';
}

export async function GET() {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100, // Pagination can be added later via query params
    });
    
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
  }
}
