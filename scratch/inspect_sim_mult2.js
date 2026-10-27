const fs = require('fs');
const content = fs.readFileSync('e:/UE5/修仙工厂策划案/optical_array_prototype.html', 'utf8');

const idx = content.indexOf('hitFloorNodesSet.add');
console.log(content.substring(idx - 200, idx + 1500));
