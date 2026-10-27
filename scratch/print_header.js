const fs = require('fs');

const cur = fs.readFileSync('e:/UE5/修仙工厂策划案/optical_array_prototype.html', 'utf8');

// Check lines 160-260
const curLines = cur.split('\n');
console.log('Lines 170-220:');
console.log(curLines.slice(170, 225).join('\n'));
