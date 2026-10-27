const fs = require('fs');

const content = fs.readFileSync('e:/UE5/修仙工厂策划案/optical_array_prototype.html', 'utf8');

const idxStart = content.indexOf('const CHIP_SPECS = {');
const idxEnd = content.indexOf('const KEYSTONE_TRAITS = {', idxStart);

const chipSection = content.substring(idxStart, idxEnd);

// Extract all chip keys and names
const chipRegex = /(\w+):\s*\{[\s\S]*?id:\s*'([^']+)'[\s\S]*?name:\s*'([^']+)'[\s\S]*?tag:\s*'([^']+)'[\s\S]*?type:\s*'([^']+)'/g;

let match;
const chips = [];
while ((match = chipRegex.exec(chipSection)) !== null) {
  chips.push({ key: match[1], id: match[2], name: match[3], tag: match[4], type: match[5] });
}

console.log('Total chips found:', chips.length);
chips.forEach((c, idx) => {
  console.log(`${idx + 1}. [${c.id}] Name: "${c.name}", Tag: "${c.tag}", Type: "${c.type}"`);
});
