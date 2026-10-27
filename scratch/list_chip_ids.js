const fs = require('fs');
const html = fs.readFileSync('processor/index.html', 'utf8');
const regex = /"([a-zA-Z0-9_]+)":\s*{\s*"id":\s*"\1"/g;
let match;
const ids = [];
while ((match = regex.exec(html)) !== null) {
  ids.push(match[1]);
}
console.log('Total chip specs found:', ids.length);
console.log(ids.join(', '));
