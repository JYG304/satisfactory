const fs = require('fs');

let content = fs.readFileSync('e:/UE5/修仙工厂策划案/中央处理器_光路阵盘/index.html', 'utf8');
content = content.replace(
  'id="leftPanel" class="w-80 bg-white border-r border-slate-200 flex flex-col z-20 shrink-0 shadow-sm collapsible-sidebar collapsed"',
  'id="leftPanel" class="w-80 bg-white border-r border-slate-200 flex flex-col z-20 shrink-0 shadow-sm collapsible-sidebar"'
);

fs.writeFileSync('e:/UE5/修仙工厂策划案/scratch/test_palette_open.html', content, 'utf8');
console.log('Created test_palette_open.html');
