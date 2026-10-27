const fs = require('fs');

const content = fs.readFileSync('e:/UE5/修仙工厂策划案/optical_array_prototype.html', 'utf8');
const tag = content.match(/<script>([\s\S]*?)<\/script>/i)[1];

const lines = tag.split('\n');
let codeSoFar = '';
for (let i = 0; i < lines.length; i++) {
  codeSoFar += lines[i] + '\n';
  try {
    // Check line by line
  } catch (e) {
  }
}

// Find syntax error position with Babel or Function wrapper
try {
  new Function(tag);
} catch (err) {
  console.log('Error message:', err.message);
  console.log('Stack:', err.stack);
}

// Binary search for error line
let low = 1;
let high = lines.length;
let errLine = -1;

while (low <= high) {
  let mid = Math.floor((low + high) / 2);
  let testCode = lines.slice(0, mid).join('\n');
  try {
    // If it's incomplete it throws unexpected end of input or unexpected token
    new Function(testCode);
    low = mid + 1;
  } catch (e) {
    if (e.message.includes("Unexpected token '}'")) {
      errLine = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
}

console.log('Found error near line:', errLine);
if (errLine !== -1) {
  console.log('Lines around ' + errLine + ':');
  console.log(lines.slice(Math.max(0, errLine - 10), Math.min(lines.length, errLine + 10)).join('\n'));
}
