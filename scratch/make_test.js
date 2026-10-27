const fs = require('fs');
let c = fs.readFileSync('processor/index.html', 'utf8');
c = c.replace("let SPECIALIZED_DISC = 'combat';", "let SPECIALIZED_DISC = 'industry';");
fs.writeFileSync('scratch/test_industry.html', c);
console.log('Saved scratch/test_industry.html');
