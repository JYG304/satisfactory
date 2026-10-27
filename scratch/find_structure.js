const fs = require('fs');
const html = fs.readFileSync('processor/index.html', 'utf8');

// Find variable declarations like const ... = { or let ... = {
const matches = html.match(/(const|let|var)\s+([A-Za-z0-9_]+)\s*=\s*[{[]/g);
console.log('Top level objects/arrays:', matches ? matches.slice(0, 30) : 'none');

// Search for disc or ring definitions
const lines = html.split('\n');
lines.forEach((line, i) => {
  if (line.includes('ring') && (line.includes('cx') || line.includes('radius') || line.includes('slotCount'))) {
    console.log(`Line ${i+1}: ${line.trim().substring(0, 100)}`);
  }
});
