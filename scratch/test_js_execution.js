const fs = require('fs');

const html = fs.readFileSync('processor/index.html', 'utf8');

// Extract the script tag content
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>[\s\n]*<\/body>/);
if (!scriptMatch) {
  console.error("Could not find script block!");
  process.exit(1);
}

const scriptCode = scriptMatch[1];

// Create simple mock DOM
const elements = {};
function createMockEl(id) {
  return {
    id,
    classList: {
      add: () => {},
      remove: () => {},
      toggle: () => {}
    },
    style: {},
    setAttribute: () => {},
    getAttribute: () => null,
    addEventListener: () => {},
    appendChild: (child) => {
      // console.log(`Element ${id} appended child ${child.id || 'anonymous'}`);
    },
    children: [],
    innerHTML: '',
    textContent: ''
  };
}

global.document = {
  getElementById: (id) => {
    if (!elements[id]) {
      elements[id] = createMockEl(id);
    }
    return elements[id];
  },
  createElement: (tag) => {
    return createMockEl('created_' + Math.random().toString(36).substring(7));
  },
  createElementNS: (ns, tag) => {
    return createMockEl('created_ns_' + Math.random().toString(36).substring(7));
  },
  querySelectorAll: () => [],
  addEventListener: (event, cb) => {
    if (event === 'DOMContentLoaded') {
      global.__onDOMContentLoaded = cb;
    }
  }
};
global.window = {
  addEventListener: (event, cb) => {
    if (event === 'DOMContentLoaded') {
      global.__onDOMContentLoaded = cb;
    }
  }
};
global.AudioContext = function() {
  return {
    createOscillator: () => ({ connect: () => {}, start: () => {}, stop: () => {} }),
    createGain: () => ({ connect: () => {}, gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} } }),
    destination: {},
    currentTime: 0,
    resume: () => {}
  };
};
global.webkitAudioContext = global.AudioContext;

// Find line 1420 equivalent
try {
  eval(scriptCode);
} catch (e) {
  console.error("Eval error:", e);
}

// Now test renderBoardSlots with logging
console.log('Testing slots in detail:');
for (const [slotKey, slotData] of Object.entries(BOARD_SLOTS)) {
  if (slotData.chip) {
    console.log(`Slot ${slotKey} has chip ${slotData.chip}: spec is`, CHIP_SPECS[slotData.chip] ? 'FOUND' : 'UNDEFINED!');
  }
}

