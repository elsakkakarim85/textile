import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const authObj = await auth();
  if (!authObj.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { rfqTitle, rfqDescription } = await req.json();

    // Get Factory Profile
    const factory = await prisma.factory.findFirst({
      where: { ownerId: authObj.userId }
    });

    if (!factory) {
      return NextResponse.json({ error: 'Factory profile required' }, { status: 400 });
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 });
    }

    const prompt = `
      You are an expert B2B sales agent for a textile factory in Mahalla El Kubra, Egypt.
      Write a highly professional, persuasive, and concise Quotation Proposal (Cover Letter) for the following Request for Quotation (RFQ).
      
      RFQ Title: ${rfqTitle}
      RFQ Description: ${rfqDescription}
      
      My Factory Name: ${factory.name}
      My Factory Details: ${factory.description}
      
      Do not include placeholders like "[Your Name]". Sign off as "${factory.name} Team".
      Make it sound confident, highlighting quality, export readiness, and asking to open a chat for final pricing and samples.
      Keep it under 150 words.
    `;

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    const data = await res.json();
    const generatedPitch = data.choices[0]?.message?.content || 'Failed to generate.';

    return NextResponse.json({ pitch: generatedPitch.trim() });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'AI Generation Failed' }, { status: 500 });
  }
}
