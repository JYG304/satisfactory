const fs = require('fs');
const s = fs.readFileSync('e:/UE5/修仙工厂策划案/optical_array_prototype.html', 'utf8');
const headIdx = s.indexOf('</head>');
console.log('headIdx:', headIdx);
console.log('Content around </head>:\n', s.substring(headIdx - 100, headIdx + 150));
