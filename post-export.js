const fs = require('fs');
const path = require('path');

// Define source and destination paths
const publicDir = path.join(__dirname, 'public');
const distDir = path.join(__dirname, 'dist');
const assetsDir = path.join(__dirname, 'assets');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Ensure dist/assets/images directory exists
const distImagesDir = path.join(distDir, 'assets', 'images');
if (!fs.existsSync(distImagesDir)) {
  fs.mkdirSync(distImagesDir, { recursive: true });
}

// Copy files from public to dist
fs.readdirSync(publicDir).forEach(file => {
  const srcPath = path.join(publicDir, file);
  const destPath = path.join(distDir, file);
  fs.copyFileSync(srcPath, destPath);
  console.log(`Copied ${file} to dist directory`);
});

// Copy image assets
const imagesDir = path.join(assetsDir, 'images');
if (fs.existsSync(imagesDir)) {
  fs.readdirSync(imagesDir).forEach(file => {
    const srcPath = path.join(imagesDir, file);
    const destPath = path.join(distImagesDir, file);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${file} to ${path.relative(__dirname, destPath)}`);
  });
} 