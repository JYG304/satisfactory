const fs = require('fs');
const orig = fs.readFileSync('scratch/commit_9af3d23.html', 'utf8');
console.log(orig.substring(84200, 86000));
