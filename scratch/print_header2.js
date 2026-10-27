const fs = require('fs');
const cur = fs.readFileSync('e:/UE5/修仙工厂策划案/optical_array_prototype.html', 'utf8');
const curLines = cur.split('\n');
console.log('Lines 220-270:');
console.log(curLines.slice(220, 275).join('\n'));
