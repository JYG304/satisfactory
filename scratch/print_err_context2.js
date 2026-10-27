const fs = require('fs');

const content = fs.readFileSync('e:/UE5/修仙工厂策划案/optical_array_prototype.html', 'utf8');
const tag = content.match(/<script>([\s\S]*?)<\/script>/i)[1];
const lines = tag.split('\n');

console.log(lines.slice(2350, 2415).join('\n'));
