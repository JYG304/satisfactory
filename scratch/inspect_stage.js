const fs = require('fs');
const html = fs.readFileSync('processor/index.html', 'utf8');

const idx = html.indexOf('id="diskStage"');
console.log('diskStage index:', idx);
console.log(html.substring(idx, idx + 2500));
