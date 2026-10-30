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
  getElementById: (id) => {
    if (!elements[id]) elements[id] = createMockEl(id);
    return elements[id];
  },
  querySelectorAll: () => [],
  querySelector: () => null,
  createElement: (tag) => createMockEl('mock_' + tag),
  createElementNS: (ns, tag) => createMockEl('mock_ns_' + tag),
  addEventListener: (event, cb) => {
    if (event === 'DOMContentLoaded') global.__onDOMContentLoaded = cb;
  },
  removeEventListener: () => {},
  body: createMockEl('body')
};

global.window = {
  document: global.document,
  innerWidth: 3840,
  innerHeight: 2160,
  devicePixelRatio: 1,
  screen: { width: 3840, height: 2160 },
  addEventListener: (event, cb) => {
    if (event === 'DOMContentLoaded') global.__onDOMContentLoaded = cb;
  },
  removeEventListener: () => {},
  audio: {
    init: () => {},
    playPlace: () => {},
    playRemove: () => {},
    playRotate: () => {},
    playSnap: () => {}
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

eval(scriptCode + `
if (global.__onDOMContentLoaded) global.__onDOMContentLoaded();

// 1. Initial State: multi_disc_overdrive is loaded by default
console.log('--- 1. Testing Default Aligned State ---');
console.log('Support charged:', CENTER_CORE_STATE.support.charged);
console.log('Industry charged:', CENTER_CORE_STATE.industry.charged);
console.log('Combat charged:', CENTER_CORE_STATE.combat.charged);
if (!CENTER_CORE_STATE.support.charged) throw new Error('Expected support charged in preset');

// 2. Rotate support_1 away to angle 0 (misaligned by 15.2 deg > 6.0 deg)
console.log('\\n--- 2. Testing Rotation Misalignment Cut-off ---');
DISK_RINGS['support_1'].currentAngle = 0;
solveStepNetwork();

console.log('Support charged after misaligning support_1 to 0°:', CENTER_CORE_STATE.support.charged);
console.log('Industry charged after cut-off:', CENTER_CORE_STATE.industry.charged);
console.log('Combat charged after cut-off:', CENTER_CORE_STATE.combat.charged);

const logBoxHtml = elements['stepLogList'].innerHTML;
const hasCutoffLog = logBoxHtml.includes('始发激光断路') || logBoxHtml.includes('断路');
console.log('Has cut-off warning in optical logs:', hasCutoffLog);

if (CENTER_CORE_STATE.support.charged) {
  throw new Error('Support should NOT be charged when unaligned!');
}
if (!hasCutoffLog) {
  throw new Error('Expected misalignment log when laser hits wall!');
}
console.log('Laser cut-off verification PASSED: Discs do NOT receive power without proper disc rotation!');

// 3. Testing Magnetic Snapping
console.log('\\n--- 3. Testing Magnetic Gear Snapping ---');
DISK_RINGS['support_1'].currentAngle = 14.0; // 1.2° away from 15.2°
const snapped = applyRingMagneticSnap('support_1');
console.log('Snap triggered at 14.0°:', snapped);
console.log('New angle after magnetic snap:', DISK_RINGS['support_1'].currentAngle);

if (!snapped || Math.abs(DISK_RINGS['support_1'].currentAngle - 15.2) > 0.1) {
  throw new Error('Magnetic snap failed to snap to 15.2°!');
}
console.log('Magnetic gear snapping verification PASSED!');

// 4. Testing Floor Star Slot Rotation Necessity
console.log('\\n--- 4. Testing Floor Star Slot Rotation Alignment ---');
// In multi_disc_overdrive, combat_1 slot 0 is on combat_1 ring.
// combat_1 currentAngle is 0, which perfectly aligns with q_atk_1 (at angle 270, radius 66).
solveStepNetwork();
renderFloorBase(true);

const floorLayer = elements['floorCrossContainer'];
console.log('Floor layer rendered successfully, length:', floorLayer.innerHTML.length);

if (!floorLayer.innerHTML.includes('★已激活(+120%)')) {
  throw new Error('Expected floor star to be activated when ring is at 0°!');
}
console.log('Floor star is active at 0°');

// Now rotate combat_1 ring away by 18 degrees!
DISK_RINGS['combat_1'].currentAngle = 18.0;
solveStepNetwork();
renderFloorBase(true);

if (floorLayer.innerHTML.includes('红Ⅰ ★已激活(+120%)')) {
  throw new Error('q_atk_1 should NOT be activated when ring is rotated 18° away!');
}
const hasMisalignedStarPrompt = floorLayer.innerHTML.includes('↻差') || floorLayer.innerHTML.includes('待转盘对齐');
console.log('Has rotation prompt when star node is misaligned:', hasMisalignedStarPrompt);
if (!hasMisalignedStarPrompt) {
  throw new Error('Expected rotation prompt when star node is misaligned!');
}
console.log('Floor star slot rotation verification PASSED: Slots do NOT trigger without rotating to align!');

// 5. Test rotating combat_1 close (e.g. 2.0°) and snapping back to 0°
DISK_RINGS['combat_1'].currentAngle = 2.0;
const combatSnapped = applyRingMagneticSnap('combat_1');
console.log('Snap triggered for combat_1 at 2.0°:', combatSnapped);
console.log('New combat_1 angle after snap:', DISK_RINGS['combat_1'].currentAngle);
if (!combatSnapped || DISK_RINGS['combat_1'].currentAngle !== 0) {
  throw new Error('Combat ring failed to snap to 0° star node!');
}

solveStepNetwork();
renderFloorBase(true);
if (!floorLayer.innerHTML.includes('红Ⅰ ★已激活(+120%)')) {
  throw new Error('q_atk_1 should be reactivated after snapping back!');
}
console.log('Floor star re-activation after snap verification PASSED!');

console.log('\\n======================================================');
console.log('>>> ALL DISC ROTATION GAMEPLAY TESTS PASSED 100%! <<<');
console.log('======================================================');
`);
