const fs = require('fs');
const html = fs.readFileSync('processor/index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>[\s\n]*<\/body>/);
const scriptCode = scriptMatch[1];

const elements = {};
function createMockEl(id) {
  return {
    id,
    clientWidth: 1920,
    clientHeight: 1000,
    classList: { add: () => {}, remove: () => {}, toggle: () => {} },
    style: {},
    setAttribute: () => {},
    getAttribute: () => null,
    addEventListener: () => {},
    appendChild: () => {},
    remove: () => {},
    getBoundingClientRect: () => ({ width: 1640, height: 860, left: 0, top: 0 }),
    children: [],
    innerHTML: '',
    textContent: ''
  };
}

global.document = {
  body: createMockEl('body'),
  getElementById: (id) => {
    if (!elements[id]) elements[id] = createMockEl(id);
    return elements[id];
  },
  createElementNS: () => createMockEl('svg-element'),
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener: () => {}
};

global.window = {
  document: global.document,
  addEventListener: () => {},
  innerWidth: 1920,
  innerHeight: 1080
};

// Execute scriptCode
eval(scriptCode);

console.log('--- Verifying Tabs in HTML Markup ---');
['tab_all', 'tab_combat', 'tab_support', 'tab_industry', 'tab_shift'].forEach(id => {
  if (!html.includes(`id="${id}"`)) {
    throw new Error(`Tab ${id} not found in HTML!`);
  }
  console.log(`Tab ${id}: OK`);
});

['tab_funnel', 'tab_mobility', 'tab_keystone', 'tab_s1', 'tab_s2'].forEach(id => {
  if (html.includes(`id="${id}"`)) {
    throw new Error(`Obsolete tab ${id} still present in HTML!`);
  }
  console.log(`Obsolete tab ${id} absent: OK`);
});

console.log('--- Verifying Chip Categorization ---');
clearBoard();

// Filter: combat
filterPalette('combat');
let containerHtml = document.getElementById('paletteListContainer').innerHTML;
let cardCount = (containerHtml.match(/ondragstart="onPaletteDragStart/g) || []).length;
console.log('Combat chips count:', cardCount);
if (cardCount !== 11) throw new Error('Expected 11 combat chips, got ' + cardCount);

// Filter: support
filterPalette('support');
containerHtml = document.getElementById('paletteListContainer').innerHTML;
cardCount = (containerHtml.match(/ondragstart="onPaletteDragStart/g) || []).length;
console.log('Support chips count:', cardCount);
if (cardCount !== 14) throw new Error('Expected 14 support chips, got ' + cardCount);

// Filter: industry
filterPalette('industry');
containerHtml = document.getElementById('paletteListContainer').innerHTML;
cardCount = (containerHtml.match(/ondragstart="onPaletteDragStart/g) || []).length;
console.log('Industry chips count:', cardCount);
if (cardCount !== 20) throw new Error('Expected 20 industry chips, got ' + cardCount);

// Filter: shift
filterPalette('shift');
containerHtml = document.getElementById('paletteListContainer').innerHTML;
cardCount = (containerHtml.match(/ondragstart="onPaletteDragStart/g) || []).length;
console.log('Shift chips count:', cardCount);
if (cardCount !== 1) throw new Error('Expected 1 shift chip, got ' + cardCount);

// Filter: all
filterPalette('all');
containerHtml = document.getElementById('paletteListContainer').innerHTML;
cardCount = (containerHtml.match(/ondragstart="onPaletteDragStart/g) || []).length;
console.log('All chips count (clear board):', cardCount);
if (cardCount !== 46) throw new Error('Expected 46 total chips, got ' + cardCount);

// Test scenario loading which equips chips (including multiple chip_triangle_in)
console.log('--- Testing Scenario Equip and Palette Auto-Update ---');
window.loadScenario('act1_qi_pioneer');

filterPalette('all');
containerHtml = document.getElementById('paletteListContainer').innerHTML;
const equippedAllCount = (containerHtml.match(/ondragstart="onPaletteDragStart/g) || []).length;
console.log('Available unequipped chips in act1_qi_pioneer:', equippedAllCount);
if (equippedAllCount >= 46) {
  throw new Error('Equipped unique chips should disappear from palette! Expected < 46, got ' + equippedAllCount);
}

// Crucial: chip_triangle_in MUST remain available in palette even when placed multiple times across the board!
filterPalette('shift');
containerHtml = document.getElementById('paletteListContainer').innerHTML;
const shiftInScenarioCount = (containerHtml.match(/ondragstart="onPaletteDragStart/g) || []).length;
console.log('Shift chip available in palette during scenario (placed 4 times in act1_qi_pioneer):', shiftInScenarioCount);
if (shiftInScenarioCount !== 1) {
  throw new Error('Shift mirror MUST remain available in palette for continuous placement! Got ' + shiftInScenarioCount);
}

// Clear board restores all chips
window.clearBoard();
filterPalette('all');
containerHtml = document.getElementById('paletteListContainer').innerHTML;
const restoredAllCount = (containerHtml.match(/ondragstart="onPaletteDragStart/g) || []).length;
console.log('Restored unequipped chips after clearBoard:', restoredAllCount);
if (restoredAllCount !== 46) {
  throw new Error('Expected 46 chips after clearBoard, got ' + restoredAllCount);
}

console.log('\n>>> ALL 4 CATEGORIES AND PALETTE VERIFICATIONS PASSED 100%! <<<');
