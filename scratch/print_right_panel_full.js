const fs = require('fs');

const content = fs.readFileSync('e:/UE5/修仙工厂策划案/optical_array_prototype.html', 'utf8');

const idxStart = content.indexOf('<aside id="rightPanel"');
const idxEnd = content.indexOf('</aside>', idxStart);
console.log(content.substring(idxStart, idxEnd + 8));
