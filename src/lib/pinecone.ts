import { Pinecone } from '@pinecone-database/pinecone';

export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || 'placeholder',
});

export const getPineconeIndex = () => {
  return pinecone.Index(process.env.PINECONE_INDEX_NAME || 'mahalla-textiles-index');
};
