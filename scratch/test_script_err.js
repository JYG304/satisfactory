const fs = require('fs');

const content = fs.readFileSync('e:/UE5/修仙工厂策划案/optical_array_prototype.html', 'utf8');

// 1. Check JS syntax
const scriptMatches = content.match(/<script>([\s\S]*?)<\/script>/gi);
console.log('Script matches count:', scriptMatches ? scriptMatches.length : 0);
if (scriptMatches) {
  scriptMatches.forEach((tag, idx) => {
    const code = tag.replace(/<\/?script>/gi, '');
    try {
      new Function(code);
      console.log('Script #' + idx + ' syntax OK');
    } catch (e) {
      console.error('Script #' + idx + ' syntax error:', e.message);
    }
  });
}
