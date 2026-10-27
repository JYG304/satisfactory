const fs = require('fs');

let html = fs.readFileSync('processor/index.html', 'utf8');

// Switch default specialization to industry
html = html.replace("let SPECIALIZED_DISC = 'combat';", "let SPECIALIZED_DISC = 'industry';");

fs.writeFileSync('scratch/test_industry_visual.html', html);
console.log('Created scratch/test_industry_visual.html');
