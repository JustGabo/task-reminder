const fs = require('fs');
const path = require('path');

// Define source and destination paths
const publicDir = path.join(__dirname, 'public');
const distDir = path.join(__dirname, 'dist');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy files from public to dist
fs.readdirSync(publicDir).forEach(file => {
  const srcPath = path.join(publicDir, file);
  const destPath = path.join(distDir, file);
  fs.copyFileSync(srcPath, destPath);
//   console.log(`Copied ${file} to dist directory`);
}); 