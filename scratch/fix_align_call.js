const fs = require('fs');
const targetPath = 'e:\\UE5\\修仙工厂策划案\\optical_array_prototype.html';
let content = fs.readFileSync(targetPath, 'utf8');

// Replace the getApertureAlignment call
content = content.replace(
  /const c1Align = getApertureAlignment\(DISK_RINGS\.sub_c1, 1210, 160, 48, 345\.2, 1380, 115\);/,
  `const c1Align = typeof getClosestSlotToAngle === 'function' ? getClosestSlotToAngle('sub_c1', 345.17, 18) : { isAligned: false };`
);

content = content.replace(
  /isC1Aligned: c1Align \? Math\.abs\(c1Align\.diff\) <= 18\.0 : false/,
  `isC1Aligned: !!(c1Align && c1Align.isAligned)`
);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Fixed c1Align in updatePanels!');
