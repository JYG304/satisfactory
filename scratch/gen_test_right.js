const fs = require('fs');

let content = fs.readFileSync('e:/UE5/修仙工厂策划案/optical_array_prototype.html', 'utf8');
content = content.replace(
  'id="rightPanel" class="w-80 bg-white border-l border-slate-200 flex flex-col z-20 shrink-0 shadow-sm collapsible-sidebar collapsed"',
  'id="rightPanel" class="w-80 bg-white border-l border-slate-200 flex flex-col z-20 shrink-0 shadow-sm collapsible-sidebar"'
);

fs.writeFileSync('e:/UE5/修仙工厂策划案/scratch/test_right_open.html', content, 'utf8');
console.log('Created test_right_open.html');
