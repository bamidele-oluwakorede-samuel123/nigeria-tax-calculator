import sharp from 'sharp';
import fs from 'fs';

fs.mkdirSync('public/icons', { recursive: true });

// Create a simple blue square with "₦" text as base
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="80" fill="#1d4ed8"/>
  <text x="256" y="340" font-size="320" text-anchor="middle" fill="white" font-family="Arial">₦</text>
</svg>`;

const svgBuffer = Buffer.from(svg);

await sharp(svgBuffer).resize(192, 192).png().toFile('public/icons/icon-192.png');
console.log('✅ icon-192.png generated');

await sharp(svgBuffer).resize(512, 512).png().toFile('public/icons/icon-512.png');
console.log('✅ icon-512.png generated');