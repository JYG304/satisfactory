const fs = require('fs');
const content = fs.readFileSync('e:/UE5/修仙工厂策划案/optical_array_prototype.html', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(3710, 3760).join('\n'));
