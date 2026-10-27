const fs = require('fs');

const cur = fs.readFileSync('e:/UE5/修仙工厂策划案/optical_array_prototype.html', 'utf8');
const idx = cur.indexOf('id="slotsLayer"');
console.log(cur.substring(idx - 100, idx + 400));
