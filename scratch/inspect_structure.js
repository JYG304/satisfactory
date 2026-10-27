const fs = require('fs');
const content = fs.readFileSync('e:/UE5/修仙工厂策划案/processor/index.html', 'utf8');
const lines = content.split('\n');

lines.forEach((l, i) => {
  if (l.includes('<header') || l.includes('<aside') || l.includes('id="diskStage"') || l.includes('<script>') || l.includes('const CHIP_SPECS =')) {
    console.log((i+1) + ': ' + l.trim());
  }
});
