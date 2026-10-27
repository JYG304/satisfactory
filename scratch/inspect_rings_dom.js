const fs = require('fs');
const html = fs.readFileSync('processor/index.html', 'utf8');

const pSvgEnd = html.indexOf('</svg>', html.indexOf('id="astrolabeVectorBg"'));
console.log('pSvgEnd:', pSvgEnd);
const pStageEnd = html.indexOf('<!-- 全局高能光束', pSvgEnd);
console.log(html.substring(pSvgEnd, pStageEnd));
