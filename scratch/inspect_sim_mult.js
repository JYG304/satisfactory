const fs = require('fs');
const content = fs.readFileSync('e:/UE5/修仙工厂策划案/optical_array_prototype.html', 'utf8');

// Find how floor nodes and multipliers are calculated in solveStepNetwork
const idx = content.indexOf('hitFloorNodesSet');
console.log(content.substring(idx, idx + 1200));
