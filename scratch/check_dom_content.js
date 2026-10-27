const fs = require('fs');

const cur = fs.readFileSync('e:/UE5/修仙工厂策划案/optical_array_prototype.html', 'utf8');
const idx = cur.indexOf("window.addEventListener('DOMContentLoaded'");
console.log(cur.substring(idx, idx + 400));
