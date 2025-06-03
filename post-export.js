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

// Copy browser.js to root of dist
const browserJsPath = path.join(distDir, '_expo', 'static', 'js', 'web', 'browser-e8502e9de8d0bc6843e8affbdb1b30b7.js');
if (fs.existsSync(browserJsPath)) {
  const destPath = path.join(distDir, 'browser-e8502e9de8d0bc6843e8affbdb1b30b7.js');
  fs.copyFileSync(browserJsPath, destPath);
  console.log('Copied browser.js to dist root');
}

// Ensure we don't delete the _expo directory and its contents
const expoStaticDir = path.join(distDir, '_expo', 'static');
if (fs.existsSync(expoStaticDir)) {
  console.log('Preserving _expo/static directory');
} 