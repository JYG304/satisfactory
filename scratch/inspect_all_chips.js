const fs = require('fs');

const content = fs.readFileSync('e:/UE5/修仙工厂策划案/optical_array_prototype.html', 'utf8');

const idxStart = content.indexOf('const CHIP_SPECS = {');
const idxEnd = content.indexOf('const KEYSTONE_TRAITS = {', idxStart);

console.log(content.substring(idxStart, idxStart + 2500));
