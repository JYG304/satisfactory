const fs = require('fs');
const orig = fs.readFileSync('scratch/commit_9af3d23.html', 'utf8');

const p1 = orig.indexOf('const CHIP_SPECS = {');
console.log('pos of CHIP_SPECS:', p1);
if (p1 !== -1) {
  const p2 = orig.indexOf('const KEYSTONE_TRAITS =', p1);
  console.log('pos of KEYSTONE_TRAITS:', p2);
  const p3 = orig.indexOf('const DISC_KEYSTONE_META =', p2);
  console.log('pos of DISC_KEYSTONE_META:', p3);
}
