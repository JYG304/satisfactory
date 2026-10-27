const fs = require('fs');
const bak = fs.readFileSync('e:/UE5/修仙工厂策划案/optical_array_prototype.html.bak_clean', 'utf8');
const cur = fs.readFileSync('e:/UE5/修仙工厂策划案/optical_array_prototype.html', 'utf8');

console.log('Bak bytes:', bak.length, 'Cur bytes:', cur.length);

// Check if tags are balanced
['div', 'section', 'main', 'header', 'aside', 'svg', 'script'].forEach(tag => {
  const openCount = (cur.match(new RegExp('<' + tag + '[\\s>]', 'gi')) || []).length;
  const closeCount = (cur.match(new RegExp('</' + tag + '>', 'gi')) || []).length;
  console.log(`Tag <${tag}>: open=${openCount}, close=${closeCount}`);
});
