const fs = require('fs');

const clearBoardCode = [
  '    function clearBoard() {',
  '      for (const k in BOARD_SLOTS) {',
  '        BOARD_SLOTS[k].chip = null;',
  '      }',
  '      ACTIVE_SELECTED_CHIP = null;',
  '      renderPalette();',
  '      updateSelectedChipIndicator();',
  '      if (audio) audio.playRemove();',
  '      renderBoardSlots();',
  '      solveStepNetwork();',
  '    }',
  '    window.clearBoard = clearBoard;',
  ''
].join('\n');

['optical_array_prototype.html', 'processor/index.html', '中央处理器_光路阵盘/index.html'].forEach(f => {
  let content = fs.readFileSync('e:/UE5/修仙工厂策划案/' + f, 'utf8');
  if (!content.includes('function clearBoard(')) {
    content = content.replace('function removeChip(slotKey) {', clearBoardCode + '\n    function removeChip(slotKey) {');
    fs.writeFileSync('e:/UE5/修仙工厂策划案/' + f, content, 'utf8');
    console.log('Added clearBoard to', f);
  }
});
