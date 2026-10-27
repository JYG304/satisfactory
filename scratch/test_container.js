const fs = require('fs');
const content = fs.readFileSync('e:/UE5/修仙工厂策划案/optical_array_prototype.html', 'utf8');
console.log('puzzleGoalList found:', content.includes('id="puzzleGoalList"'));

// Also check PUZZLE_LEVELS and evaluatePuzzleGoals execution
const idx = content.indexOf('function loadPuzzleLevel');
console.log(content.substring(idx, idx + 600));
