const fs = require('fs');
const readline = require('readline');

async function dumpGameFlow() {
  const rl = readline.createInterface({
    input: fs.createReadStream('策划案_V1_最终整合版.xlsx.inspect.ndjson'),
    crlfDelay: Infinity
  });
  
  for await (const line of rl) {
    if (line.includes('游戏流程') && line.includes('A1:G48')) {
      const obj = JSON.parse(line);
      console.log('--- GAME FLOW REGION ---');
      (obj.values || []).forEach((row, i) => {
        console.log(`Row ${i+1}: ${row.filter(Boolean).join(' | ')}`);
      });
    }
  }
}
dumpGameFlow();
