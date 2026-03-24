import { execSync } from 'child_process';

const INTERVAL = 10000; // 10 seconds
const BRANCH = 'main';

async function sync() {
  try {
    // Check if there are any changes (including untracked files not in .gitignore)
    const status = execSync('git status --porcelain').toString();
    
    if (status.trim()) {
      console.log(`[${new Date().toLocaleTimeString()}] Changes detected, syncing...`);
      
      // Add all changes
      execSync('git add .');
      
      // Commit changes
      const commitMsg = `auto-sync: ${new Date().toISOString()}`;
      execSync(`git commit -m "${commitMsg}"`);
      
      // Push to remote
      console.log(`Pushing to ${BRANCH}...`);
      execSync(`git push origin ${BRANCH}`);
      
      console.log(`[${new Date().toLocaleTimeString()}] Synced successfully!`);
    }
  } catch (error) {
    // Ignore cases where there's nothing to commit (should be handled by porcelain check but just in case)
    if (error.message.includes('nothing to commit')) return;
    
    console.error(`[${new Date().toLocaleTimeString()}] Sync failed:`, error.message);
  }
}

console.log('----------------------------------------------------');
console.log('🚀 Git Auto-Sync Started');
console.log(`⏱️  Interval: ${INTERVAL / 1000}s`);
console.log(`🌿 Branch: ${BRANCH}`);
console.log('----------------------------------------------------');

// Run immediately on start
sync();

// Then run periodically
setInterval(sync, INTERVAL);
