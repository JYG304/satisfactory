const fs = require('fs');
const content = fs.readFileSync('e:/UE5/修仙工厂策划案/optical_array_prototype.html', 'utf8');

// Find evaluatePuzzleGoals definition
const idx = content.indexOf('function evaluatePuzzleGoals');
console.log(content.substring(idx, idx + 800));
