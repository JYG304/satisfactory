const fs = require('fs');

const bak = fs.readFileSync('e:/UE5/修仙工厂策划案/scratch/test_bak.html', 'utf8');
const cur = fs.readFileSync('e:/UE5/修仙工厂策划案/optical_array_prototype.html', 'utf8');

// Compare line ranges
const bakLines = bak.split('\n');
const curLines = cur.split('\n');

console.log('Bak lines:', bakLines.length, 'Cur lines:', curLines.length);

// Let's find first line of difference
for (let i = 0; i < Math.min(bakLines.length, curLines.length); i++) {
  if (bakLines[i] !== curLines[i]) {
    console.log(`First difference at line ${i + 1}:`);
    console.log('BAK:', bakLines[i]);
    console.log('CUR:', curLines[i]);
    break;
  }
}
