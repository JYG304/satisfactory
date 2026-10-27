const fs = require('fs');

// Read the original file to get exact chip specs, icons, audio, and styles
const orig = fs.readFileSync('scratch/commit_9af3d23.html', 'utf8');

// Extract CHIP_SPECS and KEYSTONE_TRAITS
const chipStart = orig.indexOf('const CHIP_SPECS = {');
const chipEnd = orig.indexOf('const KEYSTONE_TRAITS =', chipStart);
const chipSpecsStr = orig.substring(chipStart, chipEnd).trim();

const keystoneStart = orig.indexOf('const KEYSTONE_TRAITS = {');
const keystoneEnd = orig.indexOf('const DISC_KEYSTONE_META =', keystoneStart);
const keystoneTraitsStr = orig.substring(keystoneStart, keystoneEnd).trim();

console.log('CHIP_SPECS extracted, length:', chipSpecsStr.length);
console.log('KEYSTONE_TRAITS extracted, length:', keystoneTraitsStr.length);
