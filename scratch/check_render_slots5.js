const fs = require('fs');

const cur = fs.readFileSync('e:/UE5/修仙工厂策划案/optical_array_prototype.html', 'utf8');
const idx = cur.indexOf('// 当前选中的盘体：显示完整的插槽基准孔');
console.log(cur.substring(idx + 300, idx + 1200));
