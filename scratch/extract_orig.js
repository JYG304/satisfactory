const fs = require('fs');
const c = fs.readFileSync('scratch/commit_9af3d23.html', 'utf8');
const p1 = c.indexOf('astrolabeVectorBg');
console.log('pos of astrolabeVectorBg:', p1);
const start = c.lastIndexOf('<svg', p1);
const end = c.indexOf('</svg>', p1);
console.log('start:', start, 'end:', end, 'length:', end - start);
fs.writeFileSync('scratch/original_svg.html', c.substring(start, end + 6));
console.log('Saved scratch/original_svg.html, size:', (end - start + 6));
