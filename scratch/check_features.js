const fs = require('fs');
const content = fs.readFileSync('e:/UE5/修仙工厂策划案/processor/index.html', 'utf8');

console.log('clearBoard:', content.includes('function clearBoard('));
console.log('selectPaletteChip:', content.includes('function selectPaletteChip('));
console.log('quickPlacementBanner:', content.includes('quickPlacementBanner'));
console.log('zIndex 35:', content.includes('slotEl.style.zIndex = "35"'));
console.log('zIndex 10:', content.includes('slotEl.style.zIndex = "10"'));
console.log('drag fix:', content.includes('if (clickedSlot) return;'));
