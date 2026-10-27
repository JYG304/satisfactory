const fs = require('fs');
const content = fs.readFileSync('e:/UE5/修仙工厂策划案/optical_array_prototype.html', 'utf8');

const pos = 145308;
console.log(content.substring(pos - 150, pos + 250));
