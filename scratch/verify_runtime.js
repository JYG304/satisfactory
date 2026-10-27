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
  createElement: (tag) => createMockEl('el_' + tag),
  createElementNS: (ns, tag) => createMockEl('svg_' + tag),
  querySelectorAll: () => [],
  addEventListener: (event, cb) => {
    if (event === 'DOMContentLoaded') global.__onDOMContentLoaded = cb;
  }
};
global.window = {
  innerWidth: 3840,
  innerHeight: 2160,
  devicePixelRatio: 1,
  screen: { width: 3840, height: 2160 },
  addEventListener: (event, cb) => {
    if (event === 'DOMContentLoaded') global.__onDOMContentLoaded = cb;
  },
  removeEventListener: () => {}
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

eval(scriptCode + `
if (global.__onDOMContentLoaded) global.__onDOMContentLoaded();

console.log('1. Startup CENTER_CORE_STATE:', JSON.stringify(CENTER_CORE_STATE));
console.log('2. Startup Ring Counts (Qi, Combat Primary):', JSON.stringify(getActiveRingCounts()));
console.log('3. Startup Constellation Title:', elements['constellationTitle'].textContent);

// Test clicking support center to detach it
window.handleCenterCoreClick('support', { stopPropagation: () => {} });
console.log('4. After clicking support center once (detached):', JSON.stringify(CENTER_CORE_STATE.support));

// Test dropping core_support onto dock_industry_0 (Independent Outer Ring North Dock)
window.placeCoreInOuterDock('dock_industry_0', 'core_support');
console.log('5. After dropping core_support onto dock_industry_0:', JSON.stringify(CENTER_CORE_STATE.support));
console.log('   Industry charged after reconnect:', CENTER_CORE_STATE.industry.charged);
console.log('   Combat charged after reconnect:', CENTER_CORE_STATE.combat.charged);
console.log('   Constellation Title after reconnect:', elements['constellationTitle'].textContent);

for (const sc of ['act1_qi_pioneer', 'act2_foundation_power', 'act3_core_factory', 'act3_core_swords', 'act3_core_roam', 'multi_disc_overdrive']) {
  window.loadScenario(sc);
  console.log('Scenario [' + sc + '] -> Support:', CENTER_CORE_STATE.support.charged, 'Industry:', CENTER_CORE_STATE.industry.charged, 'Combat:', CENTER_CORE_STATE.combat.charged, '|', elements['constellationTitle'].textContent);
}
console.log('ALL RUNTIME CHECKS PASSED!');
`);
