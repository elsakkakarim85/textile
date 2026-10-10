import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';
import { prisma } from '@/lib/prisma';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

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

export async function POST(req: Request) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { messages } = await req.json();

    const totalUsers = await prisma.user.count();
    const approvedFactories = await prisma.factory.count({ where: { status: 'APPROVED' } });
    const pendingFactories = await prisma.factory.count({ where: { status: 'PENDING' } });
    const settings = await prisma.systemSetting.findMany();
    const logs = await prisma.auditLog.findMany({ take: 5, orderBy: { createdAt: 'desc' } });

    const dbContext = `
      CURRENT PLATFORM STATISTICS:
      - Total Registered Users: ${totalUsers}
      - Approved Factories: ${approvedFactories}
      - Pending Factories (Need Review): ${pendingFactories}
      
      GLOBAL SETTINGS:
      ${settings.map(s => `- ${s.key}: ${s.value}`).join('\n')}

      LAST 5 ADMIN ACTIONS:
      ${logs.map(l => `- ${l.action} on ${l.entity}`).join('\n')}
    `;

    const systemPrompt = `You are the Expert Super Admin AI for the Mahalla Cluster platform. 
    You have direct access to the live platform database statistics.
    Your job is to answer the admin's questions about the platform, summarize activity, and provide strategic advice.
    You MUST respond in the language the user speaks. If they speak Arabic, respond in professional Egyptian Arabic.
    
    Here is the live data from the database right now:
    ${dbContext}
    `;

    const sanitizedMessages = messages.map((m: any) => ({
      role: m.role,
      content: m.content
    }));

    const result = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: systemPrompt,
      messages: sanitizedMessages,
    });

    return NextResponse.json({ text: result.text });
  } catch (error) {
    console.error('Admin AI Error:', error);
    return NextResponse.json({ error: 'AI failed to process request.' }, { status: 500 });
  }
}
