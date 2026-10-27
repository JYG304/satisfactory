const fs = require('fs');
const orig = fs.readFileSync('scratch/commit_9af3d23.html', 'utf8');

const pSvgStart = orig.indexOf('<svg id="astrolabeVectorBg"');
const pSvgEnd = orig.indexOf('</svg>', pSvgStart);
const svgContent = orig.substring(pSvgStart, pSvgEnd + 6);

console.log(svgContent.substring(1500, 4500));
