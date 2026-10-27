const fs = require('fs');

const bak = fs.readFileSync('e:/UE5/修仙工厂策划案/scratch/test_bak.html', 'utf8');
const cur = fs.readFileSync('e:/UE5/修仙工厂策划案/optical_array_prototype.html', 'utf8');

// Extract full updatePanels from bak
const idxBakStart = bak.indexOf('function updatePanels(');
const idxBakEnd = bak.indexOf('function loadScenario(type)', idxBakStart);
const fullUpdatePanels = bak.substring(idxBakStart, idxBakEnd);

// Find in cur
const idxCurStart = cur.indexOf('function updatePanels(');
const idxCurEnd = cur.indexOf('function loadScenario(type)', idxCurStart);

const updatedCur = cur.substring(0, idxCurStart) + fullUpdatePanels + cur.substring(idxCurEnd);

fs.writeFileSync('e:/UE5/修仙工厂策划案/optical_array_prototype.html', updatedCur, 'utf8');
console.log('Successfully restored complete updatePanels!');
