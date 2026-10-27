const fs = require('fs');

const cur = fs.readFileSync('e:/UE5/修仙工厂策划案/optical_array_prototype.html', 'utf8');
const idx = cur.indexOf('if (hasChip) {');
console.log(cur.substring(idx + 500, idx + 2000));
