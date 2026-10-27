const fs = require('fs');
const c = fs.readFileSync('scratch/commit_9af3d23.html', 'utf8');

const regex = /<svg[\s\S]*?<\/svg>/g;
let match;
let count = 0;
while ((match = regex.exec(c)) !== null) {
  count++;
  console.log(`SVG #${count}, length: ${match[0].length}, preview: ${match[0].substring(0, 100)}...`);
  if (match[0].includes('astrolabe') || match[0].includes('celestial') || match[0].length > 1000) {
    fs.writeFileSync(`scratch/svg_${count}.svg`, match[0]);
    console.log(`Saved scratch/svg_${count}.svg`);
  }
}
