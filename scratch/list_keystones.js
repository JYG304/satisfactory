const fs = require('fs');

const content = fs.readFileSync('e:/UE5/修仙工厂策划案/optical_array_prototype.html', 'utf8');

const idxStart = content.indexOf('const KEYSTONE_TRAITS = {');
const idxEnd = content.indexOf('const DISC_KEYSTONE_META = {', idxStart);

console.log(content.substring(idxStart, idxEnd));
