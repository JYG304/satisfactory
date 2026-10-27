const fs = require('fs');

let html = fs.readFileSync('scratch/temp_part1.html', 'utf8');
const sec3Code = fs.readFileSync('scratch/sec3_code.txt', 'utf8');
const sec5to7Code = fs.readFileSync('scratch/sec5_to_7_code.txt', 'utf8');
const sec8FloorCode = fs.readFileSync('scratch/sec8_floor_code.txt', 'utf8');
const sec12Code = fs.readFileSync('scratch/sec12_init.txt', 'utf8');

// 1. Replace Section 3
const pSec3 = html.indexOf('/* =========================================================================\n       3. 盘体结构定义');
const pSec4 = html.indexOf('/* =========================================================================\n       4. 左侧芯片调色板渲染');
if (pSec3 === -1 || pSec4 === -1) throw new Error('Could not find Sec3/Sec4 markers');
html = html.substring(0, pSec3) + sec3Code + '\n\n    ' + html.substring(pSec4);

// 2. Replace from renderBoardSlots() down to Section 8
const pRenderSlots = html.indexOf('function renderBoardSlots() {');
const pSec8 = html.indexOf('/* =========================================================================\n       8. SVG 精密工程绘制辅助');
if (pRenderSlots === -1 || pSec8 === -1) throw new Error('Could not find renderBoardSlots/Sec8 markers');
html = html.substring(0, pRenderSlots) + sec5to7Code + '\n\n    ' + html.substring(pSec8);

// 3. Replace Section 8.9 (FLOOR_SHAPE_DEFS + renderFloorBase + switchFloorShape) up to updatePanels
const pSec89 = html.indexOf('/* =========================================================================\n       8.9 底板基准系统');
const pUpdatePanels = html.indexOf('function updatePanels(');
if (pSec89 === -1 || pUpdatePanels === -1) throw new Error('Could not find Sec8.9/updatePanels markers');
html = html.substring(0, pSec89) + sec8FloorCode + '\n\n    ' + html.substring(pUpdatePanels);

// 4. Replace from loadScenario(type) to end of file
const pLoadScenario = html.indexOf('function loadScenario(type) {');
if (pLoadScenario === -1) throw new Error('Could not find loadScenario marker');
html = html.substring(0, pLoadScenario) + sec12Code;

// Validate JS syntax
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>[\s\n]*<\/body>/);
if (!scriptMatch) throw new Error('No script tag found');
new Function(scriptMatch[1]);
console.log('Merged HTML JavaScript syntax is 100% VALID!');

fs.writeFileSync('processor/index.html', html);
fs.writeFileSync('optical_array_prototype.html', html);
fs.writeFileSync('中央处理器_光路阵盘/index.html', html);
console.log('Successfully updated processor/index.html, optical_array_prototype.html, and 中央处理器_光路阵盘/index.html!');
