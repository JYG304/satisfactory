const fs = require('fs');
const content = fs.readFileSync('e:/UE5/修仙工厂策划案/optical_array_prototype.html', 'utf8');

// Find function solveStepNetwork
const idx = content.indexOf('function solveStepNetwork(');
console.log(content.substring(idx, idx + 800));
