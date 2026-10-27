const fs = require('fs');

const cur = fs.readFileSync('e:/UE5/修仙工厂策划案/optical_array_prototype.html', 'utf8');
const idx = cur.indexOf('function renderBoardSlots');
console.log(cur.substring(idx + 1000, idx + 2500));
