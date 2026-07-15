const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const COMMIT = '1532fc3b7b803b3cd16e7a28bc7e22528859f54f';

function restoreFile(relativePath) {
  const oldPath = `artifacts/rika-events/${relativePath}`;
  const newPath = `frontend/${relativePath}`;
  
  try {
    const content = execSync(`git show ${COMMIT}:${oldPath}`, { encoding: 'utf-8', maxBuffer: 1024 * 1024 * 10 });
    fs.writeFileSync(newPath, content);
    console.log(`Restored: ${newPath}`);
  } catch (err) {
    console.error(`Failed to restore ${newPath} (was it added after the commit?): ${err.message}`);
  }
}

function restoreDirectory(dirPath) {
  const fullDirPath = path.join(__dirname, 'frontend', dirPath);
  
  function walk(currentDir) {
    if (!fs.existsSync(currentDir)) return;
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const entryPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(entryPath);
      } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts') || entry.name.endsWith('.css') || entry.name.endsWith('.html')) {
        // Calculate relative path from frontend/
        const relativePath = path.relative(path.join(__dirname, 'frontend'), entryPath);
        restoreFile(relativePath);
      }
    }
  }
  
  walk(fullDirPath);
}

console.log('Restoring HTML & CSS...');
restoreFile('index.html');
restoreFile('src/index.css');

console.log('Restoring UI Components...');
restoreDirectory('src/components');

console.log('Restoring Pages...');
restoreDirectory('src/pages');

console.log('Done!');
