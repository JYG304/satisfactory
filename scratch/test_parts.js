const fs = require('fs');

// We have extracted specs from commit 9af3d23
const specs = fs.readFileSync('e:/UE5/修仙工厂策划案/scratch/extracted_specs.js', 'utf8');

// Build the complete file
console.log('Specs length:', specs.length);
