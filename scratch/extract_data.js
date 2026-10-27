const fs = require('fs');

const orig = fs.readFileSync('scratch/commit_9af3d23.html', 'utf8');

// Extract CHIP_SPECS, KEYSTONE_TRAITS
const chipMatch = orig.match(/const CHIP_SPECS = ({[\s\S]*?});\s*\/\* ====/);
const keystoneMatch = orig.match(/const KEYSTONE_TRAITS = ({[\s\S]*?});\s*\/\* ====/);

console.log('CHIP_SPECS found:', !!chipMatch, 'length:', chipMatch ? chipMatch[1].length : 0);
console.log('KEYSTONE_TRAITS found:', !!keystoneMatch, 'length:', keystoneMatch ? keystoneMatch[1].length : 0);
