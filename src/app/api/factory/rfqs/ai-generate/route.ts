import { z } from 'zod';
import { requireFactory } from '@/server/auth';
import { parseBody, route } from '@/server/http';
import { generate } from '@/server/ai';

export const maxDuration = 30;

const schema = z.object({
  rfqTitle: z.string().trim().min(1).max(300),
  rfqDescription: z.string().trim().max(5000).default(''),
});

export const POST = route(async (req) => {
  const { factory } = await requireFactory();
  const { rfqTitle, rfqDescription } = await parseBody(req, schema);

  const system = `You are an expert B2B export sales writer for a textile factory in El Mahalla El Kubra, Egypt.
Write a professional, persuasive quotation cover letter (max 150 words). Never use placeholders such as "[Your Name]".
Do not invent certifications, prices or capacities that are not given. Sign off as "${factory.name} Team".`;

  const facts = [
    `Factory: ${factory.name}`,
    factory.description && `About: ${factory.description}`,
    factory.capabilities.length && `Capabilities: ${factory.capabilities.join(', ')}`,
    factory.monthlyCapacity && `Monthly capacity: ${factory.monthlyCapacity} ${factory.capacityUnit ?? ''}`,
    factory.leadTimeDays && `Typical lead time: ${factory.leadTimeDays} days`,
    factory.isVerified && 'Verified supplier on Mahalla Cluster',
  ]
    .filter(Boolean)
    .join('\n');

  const { text } = await generate({
    system,
    temperature: 0.6,
    messages: [{ role: 'user', content: `RFQ title: ${rfqTitle}\nRFQ description: ${rfqDescription}\n\n${facts}` }],
  });

  return { pitch: text.trim() };
});
