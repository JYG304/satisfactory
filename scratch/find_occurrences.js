const fs = require('fs');
const content = fs.readFileSync('e:/UE5/修仙工厂策划案/optical_array_prototype.html', 'utf8');

let pos = 0;
while ((pos = content.indexOf('evaluatePuzzleGoals', pos)) !== -1) {
  console.log('--- At pos ' + pos + ' ---');
  console.log(content.substring(pos - 60, pos + 120));
  pos += 19;
}
