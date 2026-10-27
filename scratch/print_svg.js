const fs = require('fs');
const orig = fs.readFileSync('scratch/commit_9af3d23.html', 'utf8');

const pSvgStart = orig.indexOf('<svg id="astrolabeVectorBg"');
const pSvgEnd = orig.indexOf('</svg>', pSvgStart);
const svgContent = orig.substring(pSvgStart, pSvgEnd + 6);
console.log('SVG length:', svgContent.length);

// Print first 2000 chars of SVG
console.log(svgContent.substring(0, 1500));
