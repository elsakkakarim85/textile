import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // In a full RAG implementation (NotebookLM clone):
  // 1. Get the last user message
  // 2. Convert it to a vector using Google Vertex AI / Gemini embeddings
  // 3. Search Pinecone for relevant context (Books, research, PDFs)
  // 4. Prepend the context to the system prompt

  const systemPrompt = `You are a highly specialized AI consultant for the El Mahalla Textile Cluster. 
You act as a business, technical, and marketing expert. 
You can generate marketing plans, explain customs procedures, and analyze the textile market based on global data.
Provide your answers in a professional, structured manner in the language the user is speaking.`;

  const result = await streamText({
    model: google('gemini-1.5-pro-latest'), // Using Gemini Pro (Free Tier eligible via Google AI Studio)
    system: systemPrompt,
    messages,
  });

  return result.toDataStreamResponse();
}
