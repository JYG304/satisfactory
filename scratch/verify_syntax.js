const fs = require('fs');

['optical_array_prototype.html', 'processor/index.html', '中央处理器_光路阵盘/index.html'].forEach(f => {
  const content = fs.readFileSync('e:/UE5/修仙工厂策划案/' + f, 'utf8');
  const scriptMatch = content.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi);
  console.log(f, 'scripts count:', scriptMatch ? scriptMatch.length : 0);
  scriptMatch.forEach((s, idx) => {
    const raw = s.replace(/<script[\s\S]*?>/i, '').replace(/<\/script>/i, '');
    if (!raw.trim()) return;
    try {
      new Function(raw);
      console.log('  Script #' + idx + ' syntax OK');
    } catch (e) {
      console.log('  Script #' + idx + ' SYNTAX ERROR:', e.message);
    }
  });
});
