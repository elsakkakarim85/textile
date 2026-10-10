const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// The public Google Drive folder URL
const FOLDER_URL = 'https://drive.google.com/drive/folders/14wSDpyyLUN3ckPALB4q1j6nRHnzouw5E?usp=sharing';

// Sync interval (default: 1 hour)
const SYNC_INTERVAL_MS = 60 * 60 * 1000; 

function checkPrerequisites() {
  try {
    execSync('gdown --version', { stdio: 'ignore' });
  } catch (error) {
    console.error('Error: "gdown" is not installed or not in PATH.');
    console.error('Please install it by running: pip install gdown');
    process.exit(1);
  }
}

function syncAndIngest() {
  console.log(`\n======================================================`);
  console.log(`[${new Date().toLocaleString()}] Starting AI Knowledge Sync`);
  console.log(`======================================================`);
  
  try {
    // 1. Download files from Google Drive
    console.log(`\n📥 Fetching new files from Google Drive...`);
    // gdown will download the contents of the folder into the temp_drive directory
    execSync(`gdown --folder "${FOLDER_URL}" -O temp_drive`, { stdio: 'inherit' });
    
    // 2. Run the ingestion pipeline
    console.log(`\n🧠 Processing and learning new files...`);
    execSync('node scripts/ingest-pdfs.js', { stdio: 'inherit' });
    
    console.log(`\n✅ Sync cycle complete!`);
    console.log(`⏳ Sleeping for ${SYNC_INTERVAL_MS / 1000 / 60} minutes until next sync...`);
  } catch (error) {
    console.error(`\n❌ Error during sync cycle:`, error.message);
    console.log(`⏳ Will retry in ${SYNC_INTERVAL_MS / 1000 / 60} minutes...`);
  }
}

// Start the daemon
console.log('🚀 Starting Google Drive Auto-Sync Daemon for AI Brain');
checkPrerequisites();

if (!fs.existsSync(path.join(__dirname, '../temp_drive'))) {
  fs.mkdirSync(path.join(__dirname, '../temp_drive'));
}

syncAndIngest();
setInterval(syncAndIngest, SYNC_INTERVAL_MS);
