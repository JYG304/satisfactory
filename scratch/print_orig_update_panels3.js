const fs = require('fs');

const bak = fs.readFileSync('e:/UE5/修仙工厂策划案/scratch/test_bak.html', 'utf8');
const idx = bak.indexOf('function updatePanels');
const idxNext = bak.indexOf('function loadScenario', idx);
console.log(bak.substring(idx, idxNext));
