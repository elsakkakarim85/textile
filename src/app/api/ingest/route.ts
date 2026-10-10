// @ts-nocheck
import { embedMany } from 'ai';
import { google } from '@ai-sdk/google';
import { getPineconeIndex } from '@/lib/pinecone';

export async function POST(req: Request) {
  try {
    const { text, sourceName } = await req.json();

    if (!text || text.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'No text provided' }), { status: 400 });
    }
    
    if (!process.env.PINECONE_API_KEY || process.env.PINECONE_API_KEY.includes('<')) {
      return new Response(JSON.stringify({ error: 'عذراً، لم تقم بتزويد النظام بمفتاح Pinecone API Key لتخزين البيانات.' }), { status: 500 });
    }

    // Simple chunking strategy (by paragraphs)
    const chunks = text
      .split('\n\n')
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 20);

    if (chunks.length === 0) {
      return new Response(JSON.stringify({ error: 'Text too short' }), { status: 400 });
    }

    // Embed chunks
    const { embeddings } = await embedMany({
      model: google.textEmbeddingModel('gemini-embedding-2'),
      values: chunks,
    });

    // Format for Pinecone
    const vectors = embeddings.map((embedding, idx) => ({
      id: `${sourceName || 'doc'}-${Date.now()}-${idx}`,
      values: embedding,
      metadata: {
        text: chunks[idx],
        source: sourceName || 'manual-upload'
      }
    }));

    // Upsert to Pinecone
    const index = await getPineconeIndex();
    await index.upsert(vectors);

    return new Response(JSON.stringify({ success: true, chunksProcessed: chunks.length }), { status: 200 });
  } catch (error: any) {
    console.error('Ingestion failed:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
