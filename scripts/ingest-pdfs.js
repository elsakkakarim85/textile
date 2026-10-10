const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const { Pinecone } = require('@pinecone-database/pinecone');
const { embedMany } = require('ai');
const { google } = require('@ai-sdk/google');

// Secrets are loaded from .env.local (never hardcode keys in source).
try { process.loadEnvFile(path.join(__dirname, '..', '.env.local')); } catch {}
if (!process.env.PINECONE_API_KEY || !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  console.error('Missing PINECONE_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY in .env.local');
  process.exit(1);
}
const PINECONE_INDEX_NAME = 'mahalla-textiles-index';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function ingestFolder(folderPath) {
  const pc = new Pinecone();
  const index = pc.index(PINECONE_INDEX_NAME);

  const progressFile = path.join(__dirname, 'ingest-progress.json');
  let processedFiles = [];
  if (fs.existsSync(progressFile)) {
    processedFiles = JSON.parse(fs.readFileSync(progressFile));
  }

  const files = fs.readdirSync(folderPath);
  
  for (const file of files) {
    if (!file.endsWith('.pdf')) continue;
    if (processedFiles.includes(file)) {
      console.log(`Skipping ${file} (already processed)...`);
      continue;
    }
    
    console.log(`Processing ${file}...`);
    
    try {
      const dataBuffer = fs.readFileSync(path.join(folderPath, file));
      let text = '';
      try {
        const data = await pdfParse(dataBuffer);
        text = data.text;
      } catch (e) {
        console.error(`  - Failed to parse PDF: ${e.message}`);
        continue;
      }
      
      text = text.replace(/\s+/g, ' ');
      
      const chunks = [];
      for (let i = 0; i < text.length; i += 2000) {
        const chunk = text.slice(i, i + 2000).trim();
        if (chunk.length > 50) {
          chunks.push(chunk);
        }
      }
      
      if (chunks.length === 0) {
        processedFiles.push(file);
        fs.writeFileSync(progressFile, JSON.stringify(processedFiles));
        continue;
      }
      
      console.log(`- Extracted ${chunks.length} chunks. Generating embeddings...`);
      
      const batchSize = 10;
      for (let i = 0; i < chunks.length; i += batchSize) {
        const batchChunks = chunks.slice(i, i + batchSize);
        console.log(`  - Embedding chunks ${i} to ${i + batchChunks.length - 1}...`);
        
        let success = false;
        let retries = 5;
        while (!success && retries > 0) {
          try {
            const { embeddings } = await embedMany({
              model: google.textEmbeddingModel('gemini-embedding-2'),
              values: batchChunks,
            });
            
            if (embeddings && embeddings.length > 0) {
              const vectors = embeddings.map((embedding, idx) => ({
                id: `doc-${file.replace(/[^a-zA-Z0-9]/g, '')}-${i + idx}`,
                values: embedding,
                metadata: {
                  text: batchChunks[idx],
                  source: file
                }
              }));
              
              await index.upsert(vectors);
              console.log(`  - Upserted ${vectors.length} vectors to Pinecone.`);
            } else {
              console.log(`  - No embeddings returned for this batch.`);
            }
            success = true;
            await delay(3000);
          } catch (err) {
            let waitTime = 65000; // default 65s
            
            const errMsg = err.message || '';
            const match = errMsg.match(/retry in ([\d\.]+)s/);
            if (match) {
              waitTime = Math.ceil(parseFloat(match[1])) * 1000 + 5000;
            }
            
            console.error(`  - Rate limit hit, retrying in ${waitTime/1000} seconds...`);
            retries--;
            await delay(waitTime);
          }
        }
      }
      console.log(`Finished ${file}`);
      processedFiles.push(file);
      fs.writeFileSync(progressFile, JSON.stringify(processedFiles));
      
    } catch (err) {
      console.error(`Failed to process ${file}:`, err);
    }
  }
  
  console.log('All files processed!');
}

const targetFolder = path.join(__dirname, '..', 'temp_drive', 'Textile');
ingestFolder(targetFolder).catch(console.error);
