const fs = require('fs');

const bak = fs.readFileSync('e:/UE5/修仙工厂策划案/scratch/test_bak.html', 'utf8');
const idx = bak.indexOf('function updatePanels');
console.log(bak.substring(idx + 500, idx + 1800));
